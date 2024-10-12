// import React from "react";
import React, { useState, useEffect } from 'react';
import { apiGetProducts } from './../../apis';
import { apiDeleteProduct } from './../../apis';
import { getCategories } from "./../../store/app/asyncActions";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete,MdModeEdit } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { EditProductForm } from '../../components/admin';
import { DeleteProductForm } from '../../components/admin';

const Product = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const { categories } = useSelector((state) => {
        return state.app;
    },
);
// const [category, setCategory] = useState(null);
// Thông tin sản phẩm
const [showMessage, setShowMessage] = useState(false);
const [messageContent, setMessageContent] = useState('');
const [productName, setProductName] = useState('');


const [showDeleteMessage, setShowDeleteMessage] = useState(false);
const [deleteMessageContent, setDeleteMessageContent] = useState('');
const [showEditForm, setShowEditForm] = useState(false); // Thêm state để điều khiển hiển thị EditProductForm

const handleShowDeleteProductMessage = (e) => {
  
  setShowDeleteMessage(true);
};
const handleCloseDeleteProductMessage = () => {
  setShowDeleteMessage(false);
  // handleCloseDeleteProductProcess()
  setShowEditForm(false); // Đóng form khi đóng thông báo
};
const handleConfirmDelete=async(pid)=>{
  try{
    const response =await apiDeleteProduct(pid)
    console.log(response);
    toast.success('Xóa sản phẩm thành công!', {
      autoClose: 2000,
  });
  }catch (error) {
    toast.error('Xóa sản phẩm thất bại!', {
        autoClose: 2000,
    });
}

};


const [deleteProduct, setDeleteProduct] = useState(null)

const handleDeleteProductProcess = (e) => {

  const product = {
    id:e.id,
    productName: e?.product_name, //!!e?.productName,
    price:e.price,
    imageUrl:e.imageUrl,
    quantity:e.quantity,
    rating:e.rating,
    sold:e.sold,
    description:e.description,
  };

  setDeleteProduct(product);
};


const handleShowMessage = (detailProduct,productName) => {
  setMessageContent(`Chi tiết sản phẩm: ${detailProduct}`);
  setProductName(productName);
  setShowMessage(true);
};
const handleCloseMessage = () => {
  setShowMessage(false);
  setMessageContent('');
  setProductName('');
};

const notify = () => {
  toast.success(`Chi tiết sản phẩm:`, {
      position: "top-center",
      autoClose: 2000, // Thời gian hiển thị thông báo
      onClose: () => navigate(path) // Điều hướng sau khi thông báo được đóng
  });
};
//   {
//   toast("Thông báo của bạn ở đây!");
// };

      const [products, setProducts] = useState(null)
      // console.log(category)
      const fetchProducts = async (queries) => {
        const response = await apiGetProducts(queries)
        // console.log(response)
        setProducts(response.data.result)
      }
      
      useEffect(() => {
          const queries = {
            page: 1, 
            size: 6,
          };
          fetchProducts(queries);
      }, []);

  return (
    <div className="w-full pr-3 relative">
    {/* <div className="w-full mr-3"> */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 border-2 border-black">
            <th className="w-2/12 border-2 border-black p-4">Tên sản phẩm</th>
            <th className="w-2/12 border-2 border-black p-4">Ảnh</th>
            <th className="w-1/12 border-2 border-black p-4">Giá</th>
            <th className="w-1/12 border-2 border-black p-4">Đơn vị</th>
            <th className="w-1/12 border-2 border-black p-4">Phân loại</th>
            <th className="w-1/12 border-2 border-black p-4">Đánh giá</th>
            <th className="w-1/12 border-2 border-black p-4">Đã bán</th>
            <th className="w-1/12 border-2 border-black p-4">Chi tiết</th>
            <th className="w-1/12 border-2 border-black p-4">Sửa</th>
            <th className="w-1/12 border-2 border-black p-4">Xóa</th>
          </tr>
        </thead>
        <tbody>
        {products?.map((e) => (
        <tr key={e.id} className="border-b">
                        <td className="w-2/12  border-2 border-black content-center">{e?.product_name||productData?.productName}</td>
                        <td className='w-12/12 border border-black flex justify-center items-center'>
                        <img
                                            src={e?.imageUrl || category_default}
                                            alt={e?.product_name}
                                            // className="w-5 h-5 object-cover"
                                            //  className="w-25 h-25 object-cover"
                                            className="w-21 h-21 object-cover"
                                        />
                        </td>
                        <td className='w-1/12 py-2 px-4 border-2 border-black content-center'>{e.price}</td>
                        <td className='w-1/12 py-2 px-4 border-2 border-black content-center'>{e.unit}</td>
                        <td className='w-1/12 py-2 px-4 border-2 border-black content-center'>{e.category}</td>
                        <td className='w-1/12 py-2 px-4 border-2 border-black content-center'>{e.rating}</td>
                        <td className='w-1/12 py-2 px-4 border-2 border-black content-center'>{e.sold}</td>
                         
                        <td className='w-1/12 border-2 border-black content-center'>
                          <button className='hover:bg-gray-300 content-center' onClick={() => handleShowMessage(e.description,e.product_name)}>Xem chi tiết</button>
                        </td>

                        <td className="w-1/12 border-2 border-black text-center">
                        <a href={`${location.pathname}/edit/${e?.id}`}>
                        <MdModeEdit className="w-8 h-8 inline-block"/>
                        </a>
                        </td>

                        <td className="w-1/12 border-2 border-black text-center">
                        {/* <a href={`${location.pathname}/delete/${e?.id}`}>
                        <MdDelete className="w-8 h-8 inline-block"/>
                        </a> */}
                        <div   onClick={() => {
                          // handleShowDeleteProductMessage(e?.name,e?.id);
                          // handleDeleteProductProcess(e);
                          handleDeleteProductProcess(e);
                          handleShowDeleteProductMessage(e);
                          console.log(e)
                          // handleDeleteProductProcess=(e?.id,e?.productName,e?.price,e?.imageUrl,e?.quantity,e?.rating,e?.sold,e?.description);
                        }}>
                          <MdDelete className="w-8 h-8 inline-block"/>
                        </div>
                        </td>
        </tr>
    ))
    }
        </tbody>
      </table>
            {/* Thông báo lớn */}
            {/* {showMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h2 className="text-lg font-bold">Chi tiết sản phẩm</h2>
                        <p>{messageContent}</p>
                        <button onClick={handleCloseMessage} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
                    </div>
                </div>
            )} */}
            
{/* {showMessage && (
                <div className="bg-white p-5 rounded shadow-lg">
                <h2 className="text-lg font-bold">Thông báo</h2>
                <p>{messageContent}</p>
                <div className="flex justify-end mt-4">
                    <button onClick={handleCloseMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
                </div>
            </div>
            )} */}
            {showMessage && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white p-5 rounded shadow-lg mx-40">
            <h2 className="text-lg font-bold">Sản phẩm: {productName}</h2>
            <p>{messageContent}</p>
            <div className="flex justify-end mt-4">
                <button onClick={handleCloseMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
            </div>
        </div>
    </div>
)}
{/* {deleteMessageContent &&(
  <div>
  <EditProductForm initialProductData={deleteProduct}/>
  <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            handleShowDeleteProductMessage(e);
            handleCloseDeleteProductMessage();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Xác nhận
        </button>
        <button
          onClick={handleCloseDeleteProductMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
      </div>
)} */}


{showDeleteMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-5 rounded shadow-lg mx-40"style={{ maxHeight: '80vh', overflowY: 'auto'}}>
                        <h2 className="text-lg font-bold text-center">Xác nhận xóa sản phẩm</h2>
                        <DeleteProductForm initialProductData={deleteProduct} />
                        <div className="flex justify-between mt-4">
                            <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                                Xác nhận
                            </button>
                            <button onClick={handleCloseDeleteProductMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

{/* {deleteMessageContent && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="bg-white p-5 rounded shadow-lg mx-40">
    <h2 className="text-lg font-bold text-center">Xác nhận xóa </h2>
      <h2 className="text-lg font-bold">{showDeleteMessage}</h2>
      <p>{deleteMessageContent}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            handleShowDeleteProductMessage(deleteProductId);
            handleCloseDeleteProductMessage();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Xác nhận
        </button>
        <button
          onClick={handleCloseDeleteProductMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)} */}
    </div>
  );
};
export default Product;
