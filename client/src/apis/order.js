import axiosInstance from "../utils/axios";
export const apiGetOrders = async (params) =>
    axiosInstance({
        url: "/orders",
        method: "get",
        params:params
    })

export const apiGetOrderDetail = async (oid) =>
    axiosInstance({
        url: `/OrderDetails/${oid}`,
        method: "get",
    })
export const apiGetOrderInfor = async (oid)=>
    axiosInstance({
        url: `/orderInfo/${oid}`,
        method:"get",
    })
    
export const apiGetOverviewOrder = async()=>
    axiosInstance({
        url:`overviewOrder`,
        method:`get`,
    })

export const apiUpdateOrderStatus = async(orderId,status)=>
    axiosInstance({
        url:`updateOrderStatus/${orderId}`,
        params:{status:status},
    })