import React, { useEffect, useState } from "react";
import { Button, InputForm } from "../../components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avatarDefault.png"
import { apiUpdateCurrentUser, fetchAvatarBase64, getUserById } from "../../apis";
import { getCurrentUser } from "../../store/user/asyncActions";
import { toast } from "react-toastify";
import path from "../../utils/path";


const Personal = () => {
    const { handleSubmit, register, formState: { errors, isDirty }, reset } = useForm()
    const { current } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [avatarData, setAvatarData] = useState()
    const [user,setUser] = useState()


    const fetchUserByCurrentId = async ()=>{
        try {
            const response = await getUserById(current?.id);
            // Kiểm tra nếu response.data là một Blob
            setUser(response.data)
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    }

    const fetchAvatar = async () => {
        try {
                const response = await fetchAvatarBase64("avatar", user?.avatarUrl);
                // Kiểm tra nếu response.data là một Blob
                setAvatarData(response);
            const response = await fetchAvatarBase64("avatar", current?.avatarUrl);
            // Kiểm tra nếu response.data là một Blob
            setAvatarData(response);

        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    };


    useEffect(()=>{
        fetchUserByCurrentId()
    },[current])
    useEffect(()=>{
        reset({
            name: user?.name,
            email: user?.email,
            avatarUrl: user?.avatarUrl,
            phone: user?.phone,
            address: user?.address
        }) 
    },[user])
    useEffect(()=>{
        if(user?.avatarUrl){
            fetchAvatar()
        }
    },[user])

    const handleUpdateInfor = async (data)=>{
    useEffect(() => {
        reset({
            name: current?.name,
            email: current?.email,
            avatarUrl: current?.avatarUrl,
            phone: current?.phone,
            address: current?.address
        })
    }, [current])
    useEffect(() => {
        if (current?.avatarUrl) {
            fetchAvatar()
        }
    }, [current])
    const handleUpdateInfor = async (data) => {
        const formData = new FormData()
        if (data.avatarUrl.length > 0) formData.append('avatarUrl', data.avatarUrl[0])
        delete data.avatarUrl
        for (let i of Object.entries(data)) formData.append(i[0], i[1])
        const response = await apiUpdateCurrentUser(formData);
        const delay = 2000
        if (response.statusCode === 200) {
            toast.success(response.message, {
                hideProgressBar: false, // Bật thanh tiến trình
                autoClose: delay, // Tùy chọn để tự động đóng sau 3 giây (hoặc thời gian bạn muốn)
            })
            setTimeout( () => {
                dispatch(getCurrentUser());
            }, delay);

        } else {
            toast.error(response.message, {
                hideProgressBar: false,
                autoClose: delay,
            })
        }
    }

    return (
        <div className="w-full relative px-4">


            <header className="text-xl font-semibold py-4 border-b border-b-blue-200">
                Personal
            </header>
            <form onSubmit={handleSubmit(handleUpdateInfor)} className="w-3/5 mx-auto py-8 flex flex-col gap-4">
                <InputForm
                    label='Name'
                    register={register}
                    errors={errors}
                    id='name'
                    validate={{
                        required: 'Vui lòng điền thông tin',
                        minLength: {
                            value: 5,
                            message: 'Tên phải có ít nhất 5 ký tự'
                        },
                        maxLength: {
                            value: 100,
                            message: 'Tên không được vượt quá 100 ký tự'
                        },
                        pattern: {
                            value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯăẠ-ỹ\s,.-/]+$/,
                            message: 'Tên không được chứa số hay ký tự đặc biệt'
                        }
                    }}
                />
                <InputForm
                    label='Email Address'
                    register={register}
                    errors={errors}
                    id='email'
                    validate={{
                        required: 'Vui lòng điền thông tin',
                        pattern: {
                            //value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|org|edu|gov|mil|int|info|biz|co\.uk|ac\.uk|io|vn|com\.vn|net\.vn)$/,
                            message: "Địa chỉ email không hợp lệ"
                        }
                    }}
                />
                <InputForm
                    label='Address'
                    register={register}
                    errors={errors}
                    id='address'
                    validate={{
                        required: 'Vui lòng điền thông tin',
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
                <InputForm
                    label='Phone'
                    register={register}
                    errors={errors}
                    id='phone'
                    validate={{
                        required: 'Vui lòng điền thông tin',
                        pattern: {
                            value: /^0\d{9}$/, // Regex để kiểm tra số điện thoại bắt đầu bằng 0 và có 10 số
                            message: 'Số điện thoại không hợp lệ'
                        }
                    }}

                />
                <div className="flex items-center gap-2">
                    <span>Account status: </span>
                    <span>{+user?.status === 0 ? "Block" : "Actived"}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                    <span className="font-medium">Role: </span>
                    <span>{current?.role == 1 ?"Admin":"User"}</span>
                </div> */}
                    <span>{current?.role == 1 ? "Admin" : "User"}</span>
                </div>

                {/* <div className="flex items-center gap-2">
                    <span className="font-medium">Created At: </span>
                    <span>{moment(current?.createdAt).fromNow()}</span>
                </div> */}
                <div className="flex flex-col gap-2">
                    <span className="font-medium">Profile image:</span>
                    <label htmlFor="file" className="flex w-1/5">
                        <img src={user?.avatarUrl ? avatarData : avatar} alt="avatar" className="w-20 h-20 ml-8 object-cover rounded-full"/>
                     

                    </label>
                    <input type="file" accept="image/*" id="file" {...register('avatarUrl')} hidden />
                </div>
                {isDirty && <div className="w-full flex justify-end"><Button type="submit">Update Information</Button></div>}
            </form>
        </div>
    )
}

export default Personal