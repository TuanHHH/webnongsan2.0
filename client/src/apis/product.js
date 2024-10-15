import axiosInstance from "../utils/axios";
import axiosInstanceRecommended from "../utils/recommendedAxios";
export const apiGetProducts = async (params) =>
    axiosInstance({
        url: "/products",
        method: "get",
        params,
        paramsSerializer: {
            encode: (value) => value,
            serialize: (params) => {
                return Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
            }
        }
    });

export const apiGetProduct = async (pid) =>
    axiosInstance({
        url: `/products/${pid}`,
        method: "get",
    });

export const apiGetRecommendedProducts = async (pid) =>
    axiosInstanceRecommended({
        url: `/similar-products/${pid}`,
        method: 'get',
    });

export const apiDeleteProduct = async (pid)=>
    axiosInstance({
        url: `/products/${pid}`,
        method: 'delete',
    });

    
export const apiRatings = async (data) =>
    axiosInstance({
        url: `/product/ratings`,
        method: "put",
        data
    });

export const apiGetRatingsPage = async (pid, params) =>
    axiosInstance({
        url: `/product/ratings/${pid}`,
        method: "get",
        params,
    });

export const apiGetMaxPrice = async (category, productName) =>
    axiosInstance({
        url: `/products/max-price`,
        method: "get",
        params: { category, productName },
    });

export const apiCreateProduct = async (product, image, folder) => {
    // Tạo một đối tượng FormData
    const formData = new FormData();
    
    // Chỉ thêm file vào FormData nếu nó không rỗng
    if (image) {
        formData.append('file', image);
        formData.append('folder', folder);
    }

    let imageName;

    try {
        // Nếu có file hình ảnh, gửi yêu cầu để tải lên
        if (image) {
            const response = await axiosInstance({
                url: `/files`,
                method: "post",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data', // Thiết lập header cho multipart/form-data
                },
            });
            imageName = response.data.fileName; // Lưu tên file hình ảnh
        }
        console.log(imageName)
        // Gửi yêu cầu tạo sản phẩm
        const productResponse = await axiosInstance({
            url: `/products`,
            method: "post",
            data: {
                ...product, // Sao chép các thuộc tính từ product
                imageUrl: imageName || null  // Thêm imageUrl vào dữ liệu sản phẩm, nếu không có thì để là null
            },
        });

        return productResponse.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo sản phẩm:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const apiUpdateProduct = async (product, image, folder) => {
    // Tạo một đối tượng FormData
    const formData = new FormData();
    
    // Chỉ thêm file vào FormData nếu nó không rỗng
    if (image) {
        formData.append('file', image);
        formData.append('folder', folder);
    }

    let imageName;

    try {
        // Nếu có file hình ảnh, gửi yêu cầu để tải lên
        if (image) {
            const response = await axiosInstance({
                url: `/files`,
                method: "post",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data', // Thiết lập header cho multipart/form-data
                },
            });
            imageName = response.data.fileName; // Lưu tên file hình ảnh
        }
        console.log(imageName)
        // Gửi yêu cầu tạo sản phẩm
        const productResponse = await axiosInstance({
            url: `/products`,
            method: "put",
            data: {
                ...product, // Sao chép các thuộc tính từ product
                imageUrl: imageName || product.imageUrl // Thêm imageUrl vào dữ liệu sản phẩm, nếu không có thì để là null
            },
        });

        return productResponse.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo sản phẩm:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};