import axiosInstance from "../utils/axios";
import axiosInstanceRecommended from "../utils/recommendedAxios";
export const apiGetOrders = async (params) =>
    axiosInstance({
        url: "/orders",
        method: "get",
        params,
    });
export const apiGetOrderDetail = async (params) =>
    axiosInstance({
        url: "/orderDetail",
        method: "get",
        params,
    })