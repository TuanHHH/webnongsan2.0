import axiosInstance from "../utils/axios";
import axiosInstanceRecommended from "../utils/recommendedAxios";
export const apiGetCategory = async (cid) =>
    axiosInstance({
        url: `/categories/${cid}`,
        method: "get",
    });

export const apiDeleteCategory = async (cid) =>
    axiosInstance({
        url: `/categories/${cid}`,
        method:"delete",
    });

export const apiUpdateCategory = async (category, image, folder) => {
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
        // Gửi yêu cầu tạo sản phẩm
        const categoryResponse = await axiosInstance({
            url: `/categories`,
            method: "put",
            data: {
                ...category, // Sao chép các thuộc tính từ category
                imageUrl: imageName || category.imageUrl // Thêm imageUrl vào dữ liệu sản phẩm, nếu không có thì để là null
            },
        });

        return categoryResponse.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo sản phẩm:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const apiCreateCategory = async (category, image, folder) => {
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
        // Gửi yêu cầu tạo sản phẩm
        const categoryResponse = await axiosInstance({
            url: `/categories`,
            method: "post",
            data: {
                ...category, // Sao chép các thuộc tính từ category
                imageUrl: imageName || null // Thêm imageUrl vào dữ liệu sản phẩm, nếu không có thì để là null
            },
        });

        return categoryResponse.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo sản phẩm:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};