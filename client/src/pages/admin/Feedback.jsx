import React, { useEffect, useState } from "react";
import { Button, CustomSelect, FeedbackCard, Pagination } from "@/components";
import { useForm } from "react-hook-form";
import { apiGetAllRatingsPage, apiHideRating } from "@/apis";
import { useDispatch, useSelector } from "react-redux";
//import product_default from '@/assets/product_default.png';
import { showModal } from '@/store/app/appSlice'
import { createSearchParams, useSearchParams } from "react-router-dom";
import { sortFeedbackOrder, statusHideOrder, statusOrder } from "@/utils/constants";
import withBaseComponent from "@/hocs/withBaseComponent"
import { FaEye } from "react-icons/fa6";
import { MdOutlineBlock } from "react-icons/md";
import { toast } from "react-toastify";
import { getCurrentUser } from "@/store/user/asyncActions";


const Feedback = ({navigate, location})=>{

    const { isLoggedIn } = useSelector(state => state.user)
    const [paginate, setPaginate] = useState(null)
    const [feedbacksPage, setFeedbacksPage] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [paramPage, SetParamPage] = useState()
    const dispatch = useDispatch()
    const {current} = useSelector(state => state.user)
    const {handleSubmit,register,formState:{errors}, watch,setValue} = useForm()
    const [params] = useSearchParams()
    const status = watch("status")
    const sort = watch("sort")

    const fectRatings = async (page = 1,safParam = {})=>{
        const { status, sort } = safParam;
        let response;
        if(status === "default" && sort !== "default" && sort !== "product_name"){
            response = await apiGetAllRatingsPage({page,sort})
        }else if (status !== "default" && sort === "default"){
            response = await apiGetAllRatingsPage({page,status})
        }else if (status !== "default" && sort === "product_name"){
            response = await apiGetAllRatingsPage({page,status})
        }else if (status === "default" && sort === "product_name"){
            response = await apiGetAllRatingsPage({page})
        }else if (status === "default" && sort === "default"){
            response = await apiGetAllRatingsPage({page})
        }else {
            response = await apiGetAllRatingsPage({page,...safParam})
        }
         
        if (response.statusCode === 200) {
            let feedbacksList = response.data?.result
            // Nếu sort là "product_name", sắp xếp feedbacksPage theo thuộc tính product_name
            if (sort === "product_name") {
                feedbacksList = feedbacksList.sort((a, b) => {
                    if (a.product_name < b.product_name) return 1;
                    if (a.product_name > b.product_name) return -1;
                    return 0;
                });
            }
            setFeedbacksPage(feedbacksList)
            setPaginate(response.data?.meta)
            setCurrentPage(page)
        }
    }
    useEffect(()=>{
        if(current) {
            fectRatings(currentPage,paramPage)
        }
    },[current, currentPage])
    useEffect(()=>{
        const pr = Object.fromEntries([...params])
        SetParamPage(pr)
        fectRatings(1,pr)
    },[params])

    const handleViewDetail = (id)=>{
        if (!isLoggedIn) {
            Swal.fire({
              text: "Đăng nhập trước để đánh giá sản phẩm",
              confirmButtonText: "Đăng nhập",
              cancelButtonText: "Hủy",
              showCancelButton: true,
              title: "Oops!"
            }).then(rs => {
              if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
          } else {
            const feedback = feedbacksPage.find(feedback => feedback?.id === id);
            dispatch(showModal(
              {
                isShowModal: true, 
                modalChildren: <FeedbackCard 
                    data={feedback} 
                    onClose={()=>dispatch(showModal({isShowModal: false}))}
                    />
              }))
          }
    }
    const handleHideFeedback = async (id)=>{
        if (!isLoggedIn) {
            Swal.fire({
              text: "Đăng nhập trước để đánh giá sản phẩm",
              confirmButtonText: "Đăng nhập",
              cancelButtonText: "Hủy",
              showCancelButton: true,
              title: "Oops!"
            }).then(rs => {
              if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
            }else {
                const feedback = feedbacksPage.find(feedback => feedback.id === id);
                const response = await apiHideRating(feedback?.id);
                const delay = 1000
                console.log(response)
                if(+response.statusCode === 201) {
                    
                    const message = feedback?.status === 0 ? "Hide feedback succeed" : "Unhide feedback succeed"
                    toast.success(message,{
                        hideProgressBar: false, // Bật thanh tiến trình
                        autoClose: delay - 350, // Tùy chọn để tự động đóng sau 3 giây (hoặc thời gian bạn muốn)
                    })
                    setTimeout(async () => {
                        dispatch(getCurrentUser());
                        
                    }, delay);
                    
                }else{
                    toast.error("Can't hide this feedback",{
                        hideProgressBar: false, 
                        autoClose: delay, 
                    })
                }
            }
    }
    const handleChangeStatusValue = ({value}) =>{
        const currentParams = Object.fromEntries(params.entries());
        navigate({
            pathname: location.pathname,
            search: createSearchParams({
                ...currentParams,
                status:value
            }).toString()
        })
    }
    const handleChangeSortValue = ({value})=>{
        const currentParams = Object.fromEntries(params.entries());
        navigate({
            pathname: location.pathname,
            search: createSearchParams({
                ...currentParams,
                sort:value
            }).toString()
        })
    }
    return (
        <div className="w-full relative px-4 flex flex-col gap-6">
            <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
                Feedbacks
            </header>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%] grid grid-cols-4 gap-4">
                    <div className="col-span-1 flex items-center justify-end">
                        <span>Sort:</span>
                    </div>
                    <div className="col-span-1 flex items-start">
                        <CustomSelect
                            options={sortFeedbackOrder}
                            value={sort}
                            onChange={(val)=>handleChangeSortValue(val)}
                            wrapClassName="w-full"
                        />
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                        <span>Filter by status:</span>
                    </div>
                    <div className="col-span-1 flex items-start">
                        <CustomSelect
                            options={statusHideOrder}
                            value={status}
                            onChange={(val)=>handleChangeStatusValue(val)}
                            wrapClassName="w-full"
                        />
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                    
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated Time</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View Detail</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Hide</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {feedbacksPage?.map((fb, index) => (
                    <tr
                    key={fb?.id + "-" + index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-200`}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{fb?.product_name}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-600">{fb?.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                            {fb.ratingStar}
                            <span className="px-1 py-1 whitespace-nowrap text-center text-sm text-yellow-500">{"★"}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-700">
                        {fb.description.length > 50 ? `${fb?.description.substring(0, 50)}...` : fb?.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                            {new Date(fb?.updatedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="relative group">
                                <Button 
                                handleOnClick={() => handleViewDetail(fb?.id)}
                                style="text-blue-500 hover:text-blue-700 focus:outline-n "
                                >
                                    <FaEye size={20} color="green"/>
                                </Button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    View Detail
                                </div>
                            </div>
                            
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="relative group">
                                <Button 
                                    handleOnClick={() => handleHideFeedback(fb?.id)}
                                    style="text-blue-500 hover:text-blue-700 focus:outline-n "
                                    >
                                        {fb?.status === 0 ? <MdOutlineBlock  size={20} color="red"/> : <MdOutlineBlock  size={20} color="gray"/>} 
                                </Button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {fb?.status === 0 ? "Hide" : "Unhide"}
                                </div>
                            </div>
                        </td>
                        
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
            </div>
            {paginate?.pages > 1 && <div>
              <Pagination totalPage={paginate?.pages} currentPage={paginate?.page}
                pageSize={paginate?.pageSize} totalProduct={paginate?.total} onPageChange={(page) => setCurrentPage(page)} />
            </div>}
        </div>
    )
}

export default withBaseComponent(Feedback)
