import axiosInstance from "../utils/axios";

export const apiRegister = async (data) =>
    axiosInstance({
        url: "/auth/register",
        method: "post",
        data,
        withCredentials: true
    });

export const apiLogin = async (data) =>
    axiosInstance({
        url: "/auth/login",
        method: "post",
        data,
        withCredentials: true
    });

export const apiGetCurrentUser = async () =>
    axiosInstance({
        url: "/auth/account",
        method: 'get',
    });

export const apiForgotPassword = async (data) =>
    axiosInstance({
        url: "/auth/forgot",
        method: 'post',
        data
    });

export const apiResetPassword = async (newPassword, token) =>
    axiosInstance({
        url: "/auth/reset-password",
        method: 'put',
        params: {
            token: token
        }, data: {
            newPassword: newPassword
        }
    });

export const apiValidateToken = async (token) =>
    axiosInstance({
        url: "/auth/validate-token",
        method: 'get',
        params: {
            token: token
        }
    });

export const apiLogout = async () =>
    axiosInstance({
        url: "/auth/logout",
        method: 'post',
        withCredentials: true,
    });


export const apiGetAllUser = async (params)=>
    axiosInstance({
        url:"/users",
        method:"get",
        params,
    });

export const apiUpdateCurrentUser = async (formData) =>
    axiosInstance({
        url: "/auth/account",
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const fetchAvatarBase64 = async (folder, fileName) => {
    return axiosInstance({
        url: '/files',
        params: {
            folder, fileName
        },
        method: 'get',
    });
};


export const getUserById = async (id) => {
    return axiosInstance({
        url: `/users/${id}`,
        method: 'get',
    });
}
export const apiAddOrUpdateCart = async (pid, quantity) => {
    return axiosInstance({
        url: '/cart',
        method: 'post',
        data: {
            id: {
                productId: pid
            },
            quantity: quantity
        }
    })
}

export const apiDeleteCart = async (pid) => {
    return axiosInstance({
        url: `/cart/${pid}`,
        method: 'delete'
    })
}

export const apiGetCart = async (page, size) => {
    return axiosInstance({
        url: '/cart',
        method: 'get',
        params: { page, size }
    })
}

export const apiDeleteWishlist = async (pid) => {
    return axiosInstance({
        url: `/wishlist`,
        method: 'delete',
        params: {
            pid
        }
    })
}

export const apiGetWishlist = async (page, size) => {
    return axiosInstance({
        url: '/wishlist',
        method: 'get',
        params: { page, size }
    })
}

export const apiAddWishList = async (pid) => {
    return axiosInstance({
        url: '/wishlist',
        method: 'post',
        data: {
            id: {
                productId: pid
            }
        }
    })
}
