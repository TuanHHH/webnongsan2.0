import axiosInstance from "../utils/axios";
import axiosInstanceRecommended from "../utils/recommendedAxios";
export const apiGetCategory = async (cid) =>
    axiosInstance({
        url: `/categories/${cid}`,
        method: "get",
    });

export const apiUpdateCategory = async (category) =>
    axiosInstance({
        url: `/categories`,
        method: "put",
        data: category,
    });
export const apiDeleteCategory = async (cid) =>
    axiosInstance({
        url: `/categories/${cid}`,
        method:"delete",
    });
