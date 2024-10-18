import React, { useEffect, useState } from "react";
import { CustomSelect, Pagination } from "@/components";
import { useForm } from "react-hook-form";
import { apiGetOrders } from "@/apis";
import { useSelector } from "react-redux";
import product_default from '@/assets/product_default.png';
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { statusOrder } from "@/utils/constants";
import withBaseComponent from "@/hocs/withBaseComponent"


const History = ({ navigate, location }) => {
    const { current } = useSelector(state => state.user)
    const { handleSubmit, register, formState: { errors }, watch, setValue } = useForm()
    const [paginate, setPaginate] = useState(null)
    const [ordersPage, setOrdersPage] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [paramPage, SetParamPage] = useState()
    const [params] = useSearchParams()
    const status = watch("status")

    const navigateProduct = useNavigate()
    const fectOrders = async (page, status = {}) => {
        let response;
        if (status?.status === "default" || status?.status === undefined) {
            response = await apiGetOrders({ page });
            setPaginate(response.data?.meta);
            setCurrentPage(page);
        } else if (!isNaN(+status?.status)) {
            response = await apiGetOrders({ page, status: status?.status });
            console.log(response)
            setPaginate(response.data?.meta);
            setCurrentPage(page);
        }
        setOrdersPage(response?.data?.result)
    }
    useEffect(() => {
        if (current) {
            fectOrders(currentPage, paramPage)
            console.log(ordersPage)
        }
    }, [current, currentPage])

    useEffect(() => {
        const pr = Object.fromEntries([...params])
        SetParamPage(pr)
        fectOrders(1, pr)
    }, [params])

    const handleChangeStatusValue = ({ value }) => {
        const currentParams = Object.fromEntries(params.entries());
        navigate({
            pathname: location.pathname,
            search: createSearchParams({
                ...currentParams,
                status: value
            }).toString()
        })
    }
    return (
        <div className="w-full relative px-4 flex flex-col gap-6">
            <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
                History
            </header>
            <div className="flex justify-end items-center px-4">
                <form className="w-[45%] grid grid-cols-4 gap-4">
                    <div className="col-span-3 flex items-center justify-end">
                        <span>Filter by status:</span>
                    </div>
                    <div className="col-span-1 flex items-start">
                        <CustomSelect
                            options={statusOrder}
                            value={status}
                            onChange={(val) => handleChangeStatusValue(val)}
                            wrapClassName="w-full"
                        />
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ordersPage?.map((order, index) => (
                                <tr
                                    key={order.productId + "-" + index}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-200`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center cursor-pointer"
                                            onClick={e => navigateProduct(`/${encodeURIComponent(order?.category)}/${order?.productId}/${encodeURIComponent(order?.productName)}`)}
                                            onMouseEnter={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onMouseLeave={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={order?.imageUrl || product_default}
                                                    alt={order.productName}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(+order.unit_price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 0
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === 1 ? "bg-green-200 text-green-900" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {order.status === 0 ? "Pending" : order.status === 1 ? "Succeed" : "Cancelled"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                        {new Date(order.orderTime).toLocaleString("vi-VN")}
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

export default withBaseComponent(History)
