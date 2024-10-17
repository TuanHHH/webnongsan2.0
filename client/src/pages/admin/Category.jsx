// import React from "react";
import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { getCategories } from "./../../store/app/asyncActions";
import category_default from "./../../assets/category_default.png";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiDeleteCategory } from "../../apis";
import { Pagination } from "@/components";
import { apiGetCategories } from "../../apis";
import { useParams, useSearchParams, useNavigate, createSearchParams, useLocation } from 'react-router-dom';
import { AddScreenButton } from '../../components/admin';



const Category = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(params.get('page')) || 1);
  
  const [sortOption, setSortOption] = useState('');

  const [categories, setCategories] = useState(null)

  const [pages, setPages] = useState(1);
const handlePagination = (page = 1) => {

  navigate({ search: createSearchParams({ page }).toString() });
  fetchCategories({page: page, size: 6,});
  setCurrentPage(page);

};
const fetchCategories = async (queries) => {
  const response = await apiGetCategories(queries)
  setCategories(response)
}
useEffect(() => {
  const queries = {
    page:currentPage,
    size: 6,
  };
  fetchCategories(queries);
}, []);

  const [showDeleteMessage, setShowDeleteMessage] = useState(false)
  const [deleteMessageContent, setDeleteMessageContent] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState('')


  const handleShowDeleteCategoryMessage = (cate, id) => {
    setDeleteMessageContent(`Phân loại: ${cate}`);
    setShowDeleteMessage(true);
    setDeleteCategoryId(id);
  };
  const handleCloseDeleteCategoryMessage = () => {
    setShowDeleteMessage(false);
    setDeleteMessageContent('');
    setDeleteCategoryId('');
  };


  const handleDeleteCategory = async (cid) => {
  
    try {
      const response = await apiDeleteCategory(cid);
      console.log(response.statusCode); // Kiểm tra statusCode
      console.log(response.statusCode === 200);
      console.log(response);
      
      if (response.statusCode === 200) {
        toast.success('Xóa danh mục thành công!', {
          autoClose: 2000,
        });
        
      } else {
        throw new Error('Xóa danh mục thất bại!'); // Ném lỗi nếu không thành công
      }
    } catch (error) {
      toast.error('Xóa danh mục thất bại, hãy xóa những sản phẩm liên kết đến phân loại này', {
        autoClose: 2000,
      });
    } finally {
      fetchCategories({page: currentPage, size: 6,});
    }

  };

  return (
    <>
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 border-2 border-black">
              <th className="w-1/12 border-2 border-black p-4">ID</th>
              <th className="w-3/12 border-2 border-black p-4">Ảnh</th>
              <th className="w-6/12 border-2 border-black p-4">
                Tên phân loại
              </th>
              <th className="w-1/12 border-2 border-black p-4">Sửa</th>
              <th className="w-1/12 border-2 border-black p-4">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {categories?.data?.result?.map((e) => (
              <tr key={e?.id} className="border-b">
                <td className="w-1/10 py-2 px-4 border-2 border-black content-center">{e?.id}</td>
                <td className='w-2/10 border border-black flex justify-center items-center'>
                  <img
                    src={e?.imageUrl && e.imageUrl.startsWith('https') ? e.imageUrl : (e?.imageUrl ? `http://localhost:8080/storage/category/${e.imageUrl}` : 'default_image.png')}
                    alt={e?.name}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td className='w-5/10 py-2 px-4 border-2 border-black content-center'>{e?.name}</td>

                <td className='w-1/10 py-2 px-4 border-2 border-black text-center'>
                  <a href={`${location.pathname}/edit/${e?.id}`}
                  >
                    <MdModeEdit className="w-8 h-8 inline-block" />
                  </a>
                </td>
                <td className='w-1/10 py-2 px-4 border-2 border-black text-center'>

                  <div onClick={() => {
                    handleShowDeleteCategoryMessage(e?.name, e?.id);
                  }}>
                    <MdDelete className="w-8 h-8 inline-block" />
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-5 rounded shadow-lg mx-40">
              <h2 className="text-lg font-bold">Sản phẩm: </h2>
              <p>{messageContent}</p>
              <div className="flex justify-end mt-4">
                <button onClick={handleCloseMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
              </div>
            </div>
          </div>
        )}

        {deleteMessageContent && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-5 rounded shadow-lg mx-40">
              <h2 className="text-lg font-bold text-center">Xác nhận xóa </h2>
              <h2 className="text-lg font-bold">{showDeleteMessage}</h2>
              <p>{deleteMessageContent}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    handleDeleteCategory(deleteCategoryId);
                    handleCloseDeleteCategoryMessage();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Xác nhận
                </button>
                <button
                  onClick={handleCloseDeleteCategoryMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

            <div>
              <AddScreenButton buttonName='+ Thêm phân loại' buttonClassName='bg-green-500 hover:bg-green-700' toLink='add'/>
            </div>
                              <div className='w-4/5 m-auto my-4 flex justify-center'>
                <Pagination
                    totalPage={categories?.data?.meta?.pages}
                    currentPage={currentPage}
                    totalProduct={categories?.data?.meta?.total}
                    pageSize={categories?.meta?.pageSize}
                    onPageChange={handlePagination}
                />
            </div>
      </div>
    </>
  );
};
export default Category;
