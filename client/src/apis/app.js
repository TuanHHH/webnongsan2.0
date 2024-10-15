import axiosInstance from "@/utils/axios";

// export const apiGetCategories = () =>
//     axiosInstance({
//         url: "/categories",
//         method: "get",
//     });

export const apiGetCategories = (params) =>
    axiosInstance({
        url: "/categories",
        method: "get",
        params
    });
