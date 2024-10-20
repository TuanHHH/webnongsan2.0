import axiosInstance from "@/utils/axios";
export const apiGetAllOrders = async (params) =>
    axiosInstance({
        url: "/allOrders",
        method: "get",
        params:params,
        paramsSerializer: {
            encode: (value) => value,
            serialize: (params) => {
                return Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
            }
        }
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