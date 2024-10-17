import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import payment from '../../assets/payment/payment.svg';
import { apiCreateOrder, apiDeleteCart, apiGetSelectedCart, apiSendEmail, getUserById } from "../../apis/user";
import { Button, InputForm } from "../../components";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../store/user/asyncActions";
import { FaRegCreditCard } from "react-icons/fa6";
import { apiGetProduct, apiUpdateProduct } from "@/apis";

const Checkout = ()=>{
    const {isLoggedIn, current} = useSelector(state => state.user)
    const {handleSubmit,register,formState:{errors, isDirty, isValid},reset} = useForm()
    const [cart,setCart] = useState()
    const [user,setUser] = useState()
    const [isCart,setIsCart] = useState(false)
    const location = useLocation();
    const { selectedItems } = location.state || {};
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fetchCart = async () =>{
        const response = await apiGetSelectedCart(selectedItems);
        const fetchedCart = response?.data; // Lưu trữ dữ liệu trong biến riêng biệt
        setCart(fetchedCart);
        // Cập nhật trạng thái isCart dựa trên fetchedCart
        setIsCart(fetchedCart && fetchedCart?.length > 0);
    }
    const fetchUserByCurrentId = async ()=>{
        try {
            const response = await getUserById(current?.id);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    }
    const handlePayment = async (data) =>{
        const formData = new FormData();
        formData.append("userId",current?.id);
        formData.append("address", data.address);
        formData.append("totalPrice",cart?.reduce((sum,el) => 
            +el?.price * el.quantity + sum,0 ));
        formData.append("paymentMethod","COD");

        // Thêm từng sản phẩm trong giỏ hàng vào formData
        const items = cart?.map((item) => ({
            productId: item?.id,
            productName: item?.productName,
            quantity: item?.quantity,
            productPrice: item?.price
        }));
        formData.append("items", new Blob([JSON.stringify(items)], { type: "application/json" }));
        const response = await apiCreateOrder(formData);
        const delay = 2000
        if(response?.statusCode === 201) {
            toast.success(response?.data?.message,{
                hideProgressBar: false, // Bật thanh tiến trình
                autoClose: delay, // Tùy chọn để tự động đóng sau 3 giây (hoặc thời gian bạn muốn)
            })

            // Sử dụng Promise.all để xử lý tất cả các yêu cầu song song
            await Promise.all(cart.map(async (item) => {
                const resProduct = await apiGetProduct(item?.id);
                const product = resProduct?.data;

                // Kiểm tra xem sản phẩm có tồn tại không
                if (product) {
                    const productData = {
                        quantity: product?.quantity - item?.quantity,
                    };
                    console.log(productData);

                    // Cập nhật lại số lượng sản phẩm sau khi thanh toán
                    await apiUpdateProduct(item?.id,productData);
                }

                // Xóa sản phẩm đó khỏi cart
                await apiDeleteCart(item?.id);
            }));
            
            await apiSendEmail(formData);
            location.state = {}
            setTimeout(() => {
                navigate('/')
                window.location.reload()
            }, delay);
        }else{
            toast.error(response?.data?.error,{
                hideProgressBar: false, 
                autoClose: delay, 
            })
        }
    }
    useEffect(()=>{
        if(current) {
            fetchCart()
            fetchUserByCurrentId()
            console.log(selectedItems)
        }
    },[current])

    useEffect(()=>{
        reset({
            address: user?.address
        }) 
    },[user])
    
    return (
        <div className="p-8 grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6">
            <div className="w-full flex justify-center items-center col-span-3">
                <img src={payment} alt="payment" className="h-[70%] object-contain" />
            </div>
            {!isCart && 
                <div className="flex flex-col gap-4 w-full justify-center items-center col-span-7">
                    <span className="text-2xl font-medium">
                        Xin hãy chọn sản phẩm để thanh toán
                    </span>
                    <Button
                        handleOnClick={() => navigate('/')}
                        
                    >
                    Quay về trang chủ
                    </Button>
                </div>
            }
            {isCart && 
                <div className="flex w-full flex-col justify-center items-center col-span-7 gap-6">
                <h2 className="text-3xl mb-6 font-bold">Check out your order</h2>
                <div className="grid grid-cols-10 h-full w-full gap-6">
                    <table className="table-auto w-full col-span-6 border-collapse border border-gray-300 rounded-lg">
                        <thead>
                        {/* border bg-gray-300 */}
                            <tr className=" border-b hover:bg-gray-50 transition duration-200">
                                <th className="p-2 text-left">Products</th>
                                <th className="p-2 text-center">Quantity</th>
                                <th className="p-2 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart?.map((el,index) =>(<tr className="border" key={el?.productId + "-"+index}>
                                <td className="p-2 text-left">{el?.productName}</td>
                                <td className="p-2 text-center">{el?.quantity}</td>
                                <td className="p-2 text-right">{el?.price + ' VND'}</td>
                            </tr>))}
                        </tbody>
                    </table>
                    {/* col-span-4 flex  flex-col gap-[35px] p-4 bg-gray-200 */}
                    <form onSubmit={handleSubmit(handlePayment)} className="p-6 bg-white rounded-lg shadow-md col-span-4 space-y-4">
                        <span className="font-medium">Thông tin thanh toán</span>
                        <div className="flex items-center justify-center mb-6">
                            <FaRegCreditCard  className="w-16 h-16 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-center">
                            Total Price: <span className="text-green-500">{`${cart?.reduce((sum,el) => 
                            +el?.price * el.quantity + sum,0 )} VND`}</span>
                        </div>
                        {/* <span className="flex items-center gap-8 text-base mt-8"> */}
                        {/* <span>Total Price:</span>
                        <span className="text-main font-bold text-2xl">{`${cart?.reduce((sum,el) => 
                            +el?.productPrice * el.quantity + sum,0 )} VND`}</span>
                        </span> */}
                        <InputForm 
                            label='Address:'
                            register={register} 
                            errors={errors} 
                            id='address'
                            validate={{
                                required:'Vui lòng nhập địa chỉ của bạn',
                                minLength: {
                                    value: 5,
                                    message: 'Địa chỉ phải có ít nhất 5 ký tự'
                                },
                                pattern: {
                                    value: /^[0-9a-zA-ZÀÁÂÃÈÉÊỀẾỆÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêềếệìíòóôõùúăđĩũơưạ-ỹ\s,.-/]+$/,
                                    message: 'Địa chỉ không được chứa ký tự đặc biệt'
                                }
                            }}
                        />
                        {/* px-4 py-2 rounded-md text-white bg-main text-semibold my-2 w-full justify-end */}
                        {isValid && <Button style={"px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-500 shadow-lg transition duration-300 w-full"} type="submit">Thanh toán khi nhận hàng</Button>}
                    </form>
                </div>
            </div>
            }

        </div>
    )
}

export default Checkout;