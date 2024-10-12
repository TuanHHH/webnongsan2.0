import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputFormAdmin from "./InputFormAdmin";
import { apiUpdateProduct } from "../../apis";
const EditProductForm = ({ initialProductData }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  // const handleUpdateProduct = (data) => {};
  // console.log(initialProductData)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  // Dữ liệu sản phẩm ban đầu
  // const initialProductData = {
  //   id: 25,
  //   product_name: "Lốc 10 gói mì Hảo 100 tôm chua cay gói 65g",
  //   price: 33000,
  //   imageUrl: "https://cdn.tgdd.vn/Products/Images/2565/325755/bhx/mi-hao-100-tom-chua-cay-goi-65g-clone-202405141433496672.jpg",
  //   quantity: 73,
  //   rating: 0,
  //   sold: 0,
  //   description: "Sợi mì vàng dai ngon hòa quyện trong nước súp tôm chua cay thơm lừng, đậm đà thấm đẫm từng sợi mì sóng sánh cùng hương thơm quyến rũ ngất ngây."
  // };

  // State để quản lý dữ liệu sản phẩm
  const [productData, setProductData] = useState(initialProductData);

  // Hàm xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };
  const handleUpdateProduct = async (data) =>{
    const productToUpdate = {
      id:data?.id,
      productName: data?.product_name, //!!e?.productName,
      price:data?.price,
      imageUrl:data?.imageUrl,
      quantity:data?.quantity,
      rating:data?.rating,
      sold:data?.sold,
      description:data?.description,

    };
    console.log(productToUpdate)
    try {
      const response = await apiUpdateProduct(productToUpdate);
      setMessage("Cập nhật danh mục thành công!");
      setError("");
      reset(data);
    } catch (err) {
      setError("Có lỗi xảy ra: " + err.message);
      setMessage("");
    }
  }
  return (
    <div className="w-full">
      <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
      {message && <div className="text-green-500 mb-4">{message}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit(handleUpdateProduct)} className="space-y-4">
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
            {/* <textarea
    className="border p-2 w-full h-40" // Set the height to 40 pixels
    defaultValue={productData?.description}
    label="Mô tả"
    register={register}
    errors={errors}
    id="description"
    validate={{ required: "Cần điền thông tin vào trường này" }}
  /> */}
  <textarea
  {...register("description", { required: "Cần điền thông tin vào trường này" })}
  className="border p-2 w-full h-40"
  defaultValue={productData?.description}
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
            <button type="submit" className="bg-green-500 text-white p-2 w-full rounded-md mt-4">
            Lưu
          </button>
          </div>

      </form>
    </div>
    </div>
    </div>
  );
};

export default EditProductForm;
