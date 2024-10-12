import axiosInstance from "../utils/axios";
export const apiAdminLogin = async (data) =>
    axiosInstance({
        url: "/auth/admin/login",
        method: "post",
        data,
        withCredentials: false
    });
export const apiLogout = async () =>
    axiosInstance({
        url: "/auth/admin/logout",
        method: 'post',
        withCredentials: true,
    });