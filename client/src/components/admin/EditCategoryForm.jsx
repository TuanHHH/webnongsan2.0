import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputFormAdmin from "./InputFormAdmin";
import { apiUpdateCategory } from "../../apis";
import category_default from "./../../assets/category_default.png";
import { toast } from 'react-toastify';
function EditCategoryForm({ initialCategoryData }) {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  const [categoryData, setCategoryData] = useState(initialCategoryData);

  const [categoryImage, setCategoryImage] = useState(null);
  const [previewCategoryImage, setPreviewCategoryImage] = useState(initialCategoryData?.imageUrl)


  const handleUpdateCategory = async (data) => {
    const categoryToUpdate = {
      id:  initialCategoryData.id,
      name: data.name,
      imageUrl: initialCategoryData?.imageUrl,
    };
    try {
      const response = await apiUpdateCategory(categoryToUpdate,categoryImage,'category')
      toast.success("Sửa phân loại thành công!");
      reset(data);
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
      setCategoryImage(file)
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
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
                src={previewCategoryImage || category_default}
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
      </div>
    </div>
  );
}

export default EditCategoryForm;
