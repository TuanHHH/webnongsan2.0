import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputFormAdmin from "./InputFormAdmin";
import { apiUpdateCategory } from "../../apis";
import category_default from "./../../assets/category_default.png";

function EditCategoryForm({ initialCategoryData }) {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const [categoryImage, setCategoryImage] = useState(initialCategoryData?.imageUrl || category_default);
  const [cateImageUrl, setCateImageUrl] = useState(initialCategoryData?.imageUrl || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpdateCategory = async (data) => {
    const categoryToUpdate = {
      id: categoryData.id,
      name: data.name,
      imageUrl: cateImageUrl,
    };
    try {
      const response = await apiUpdateCategory(categoryToUpdate);
      setMessage("Cập nhật danh mục thành công!");
      setError("");
      reset(data);
    } catch (err) {
      setError("Có lỗi xảy ra: " + err.message);
      setMessage("");
    }
  };

  const [categoryData, setCategoryData] = useState(initialCategoryData);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageUrl("");
        setCategoryImage(reader.result);
        setCateImageUrl(event.target.file[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setCategoryImage(imageUrl);
      setCateImageUrl(imageUrl);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      {/* <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-lg"> */}
        {message && <div className="text-green-500 mb-4">{message}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit(handleUpdateCategory)} className="space-y-4">
          <div>
            <InputFormAdmin
              disabled={true}
              className="border p-2 w-full"
              defaultValue={categoryData?.id}
              label="Id"
              register={register}
              errors={errors}
              id="id"
            />
          </div>

          <div>
            <InputFormAdmin
              className="border p-2 w-full"
              defaultValue={categoryData?.name}
              label="Tên phân loại"
              register={register}
              errors={errors}
              id="name"
              validate={{ required: "Cần điền thông tin vào trường này" }}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Hình ảnh</label>
            <div className="w-full h-48 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={categoryImage}
                alt={initialCategoryData?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <button type="submit" className="bg-green-500 text-white p-2 w-full rounded-md">
            Lưu
          </button>
        </form>

        <div className="mt-4">
          <label className="cursor-pointer">
            <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
              Chọn ảnh
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex flex-col mt-4">
          <input
            type="text"
            placeholder="Nhập URL ảnh"
            value={imageUrl}
            onChange={handleUrlChange}
            className="border rounded-md p-2 mb-2"
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition">
            Tải ảnh từ URL
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryForm;
