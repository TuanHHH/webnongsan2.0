import axiosInstance from "@/utils/axios";

export const apiGetCategories = () =>
    axiosInstance({
        url: "/categories",
        method: "get",
    });
