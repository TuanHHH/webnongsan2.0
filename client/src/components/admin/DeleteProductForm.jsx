import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputFormAdmin from "./InputFormAdmin";
const DeleteProductForm = ({ initialProductData }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  const handleUpdateProduct = (data) => {};
  const [productData, setProductData] = useState(initialProductData);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };
  return (
    <div className="w-full">
      <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
      <form className="space-y-4">
      <div>
          <InputFormAdmin
          disabled={true}
            className="border p-2 w-full"
            defaultValue={productData?.id}
            label="Id sản phẩm"
            register={register}
            errors={errors}
            id="id"
            // validate={{ required: "Need fill this field" }}
          />
        </div>
        <div>
          <InputFormAdmin
          disabled={true}
            className="border p-2 w-full"
            defaultValue={productData?.product_name||productData?.productName}
            label="Tên sản phẩm"
            register={register}
            errors={errors}
            id="product_name"
            validate={{ required: "Cần điền thông tin vào trường này" }}
          />
        </div>

        <div>
          <InputFormAdmin
          disabled={true}
            className="border p-2 w-full"
            defaultValue={productData?.price}
            label="Giá"
            register={register}
            errors={errors}
            id="price"
            validate={{ required: "Cần điền thông tin vào trường này" }}
            type="number" // Ensure this is treated as a number input
          />
        </div>

        <div className="mb-96">
          <InputFormAdmin
          disabled={true}
            className="border p-2 w-full"
            defaultValue={productData?.quantity}
            label="Số lượng"
            register={register}
            errors={errors}
            id="quantity"
            validate={{ required: "Cần điền thông tin vào trường này" }}
            type="number"
            // onWheel={(e) => e.preventDefault()} // Ngăn chặn điều chỉnh bằng cuộn chuột
              inputMode="numeric"
              pattern="[0-9]*"
              step={0}
              min={0}
          />
        </div>

        <div>
            <textarea
            disabled={true}
    className="border p-2 w-full h-40" // Set the height to 40 pixels
    defaultValue={productData?.description}
    label="Mô tả"
    register={register}
    errors={errors}
    id="description"
    validate={{ required: "Cần điền thông tin vào trường này" }}
  />
        </div>
        <div>
          <label className="block">Đánh giá:</label>
          <input
            disabled={true}
            type="number"
            name="rating"
            value={productData?.rating}
            onChange={handleChange}
            className="border p-2 w-full"
            min="0"
            max="5"
          />
        </div>
        <div>
          <label className="block">Số lượng đã bán:</label>
          <input
          disabled={true}
            type="number"
            name="sold"
            value={productData?.sold}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="block">
        {/* <label className="block mb-2 text-gray-700">Hình ảnh</label>
            <div className="w-full h-48 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={categoryImage}
                alt={initialCategoryData?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div> */}
        </div>
        <div className="mb-4">
            <label className="block mb-2 text-gray-700">Hình ảnh</label>
            <div className="w-full h86 flex items-center justify-center border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={productData?.imageUrl}
                alt={productData?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

      </form>
    </div>
    </div>
    </div>
  );
};






export default DeleteProductForm