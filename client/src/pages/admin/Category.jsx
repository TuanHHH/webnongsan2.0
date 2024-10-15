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
// import { ToastContainer, toast } from 'react-toastify';


// const handleDeleteCategory = async (cid) => {
//     try {
//         const response = await apiDeleteCategory(cid);
//         console.log(response)
//         toast.success('Xóa danh mục thành công!',{
//             autoClose: 2000, // Set the timeout to 2 seconds
//             progress: (value) => value,//undefined, // Show the progress bar
//           });
//     } catch (error) {
//       toast.error('Xóa danh mục thất bại!',{
//         autoClose: 2000, // Set the timeout to 2 seconds
//         progress: (value) => value,//undefined, // Show the progress bar
//       });
//     }
//   };
// const handleDeleteCategory = async (cid) => {


//     try {
//         const response = await apiDeleteCategory(cid);
//         console.log(response);
//         toast.success('Xóa danh mục thành công!', {
//             autoClose: 2000,
//         });
//         // Cập nhật lại danh sách categories
//         dispatch(getCategories());
//     } catch (error) {
//         toast.error('Xóa danh mục thất bại!', {
//             autoClose: 2000,
//         });
//     }
// };



// const handleDeleteCategory = async (cid) => {
//   try {
//     const response = await apiDeleteCategory(cid);
//     console.log(response.statusCode)
//     console.log(response.statusCode === 200)
//     console.log(response)
//     if (response.statusCode === 200) {
//       toast.success('Xóa danh mục thành công!', {
//         autoClose: 2000,
//       });
//       // dispatch(getCategories());
//     // } else {
//     //   throw new Error('Xóa danh mục thất bại!'); // Ném lỗi nếu không thành công
//     }
//   } catch (error) {
//     toast.error('Xóa danh mục thất bại, hãy xóa những sản phẩm liên kết đển phân loại này', {
//       autoClose: 2000,
//     })
//       ;
//   }
// };

// const handleDeleteCategory = async (cid) => {
//   try {
//     const response = await apiDeleteCategory(cid);
//     console.log(response.statusCode); // Kiểm tra status thay cho statusCode
//     console.log(response.statusCode === 200);
//     console.log(response);
    
//     if (response.statusCode === 200) {
//       toast.success('Xóa danh mục thành công!', {
//         autoClose: 2000,
//       });
//       // dispatch(getCategories()); // Cập nhật danh sách sau khi xóa thành công
//     } else {
//       throw new Error('Xóa danh mục thất bại!'); // Ném lỗi nếu không thành công
//     }
//   } catch (error) {
//     toast.error('Xóa danh mục thất bại, hãy xóa những sản phẩm liên kết đến phân loại này', {
//       autoClose: 2000,
//     });
//   }
// };
// const dispatch = useDispatch();




// Trong component

// const notify = () => {
//     toast("Thông báo của bạn ở đây!");
//   };
//   const handleAction = () => {
//     if (role === 'admin') {
//       toast.success('Thành công!', {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     } else if (role === 'user') {
//       toast.error('Thất bại!', {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//     }
//   };

// import { useSearchParams } from 'react-router-dom';
const Category = () => {
    // const location = useLocation();


  // // Get all search parameters
  // const allParams = Object.fromEntries(searchParams);

  // console.log('All parameters:', allParams);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getCategories());
  // }, [dispatch]); //Tải lại category
  // const [categories, setCategories] = useState(null)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(params.get('page')) || 1);

// const [pages, setPages] = useState(1);
// const handlePagination = (page = 1) => {
//   setPages(page);
//   fetchCategories({page: page, size: 6,})
// };
// const fetchCategories = async(queries)=>{
//   const response = dispatch(queries);
//   setCategories(response)
// }

// useEffect(() => {
//   const queries = {
//     page: 1, 
//     size: 6,
//   };
//   dispatch(getCategories(queries));
// }, [dispatch]); //Tải lại category

  // const { categories } = useSelector((state) => {
  //   return state.app;
  // });
  // console.log(categories)
  
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
      // dispatch({page: currentPage, size: 6,})
      // dispatch(getCategories()); // Cập nhật danh sách sau khi xóa, ở đây sẽ được thực hiện luôn
    }


  // Slice categories for pagination
  // const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  // console.log(paginatedCategories)
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
                    src={e?.imageUrl || category_default}
                    alt={e?.name}
                    // className="w-5 h-5 object-cover"
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
                {/* <td className='w-1/10 py-2 px-4 border-2 border-black text-center'>
                        <Link 
                            to={`/edit/${e.id}`} 
                            onClick={() => handleShowMessage()}
                        >
                            <MdModeEdit className="w-8 h-8 inline-block"/>
                        </Link>
                        </td> */}
                {/* <td className='w-1/10 py-2 px-4 border-2 border-black text-center'>
                        <a href={`${location.pathname}/delete/${e.id}`}>
                        <MdDelete className="w-8 h-8 inline-block"/>
                        </a>
                        </td> */}
                <td className='w-1/10 py-2 px-4 border-2 border-black text-center'>
                  {/* <Link 
                            // to={`${location.pathname}/delete/${e.id}`} 
                            onClick={() => handleDeleteCategory(e.id)}
                        >
                            <MdDelete className="w-8 h-8 inline-block"/>
                        </Link> */}
                  <div onClick={() => {
                    handleShowDeleteCategoryMessage(e?.name, e?.id);
                  }}>
                    <MdDelete className="w-8 h-8 inline-block" />
                  </div>
                  {/* <span 
                                    onClick={() => handleShowMessage(e.name, `${location.pathname}/delete/${e.id}`)}
                                    className="cursor-pointer"
                                >
                                    <MdDelete className="w-8 h-8 inline-block"/>
                                </span> */}
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
        {/* {deleteMessageContent && (
             <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                 <div className="bg-white p-5 rounded shadow-lg mx-40">
                     <h2 className="text-lg font-bold">${showDeleteMessage} </h2>
                     <p>{deleteMessageContent}</p>
                     <div className="flex justify-end mt-4">
                         <button onClick={handleCloseDeleteCategoryMessage} className="bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
                     </div>
                 </div>
             </div>
         )} */}
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

            {/* Pagination Component */}
            {/* <Pagination 
        totalPage={totalPage}
        currentPage={currentPage}
        pageSize={pageSize}
        totalProduct={totalProduct}
        onPageChange={onPageChange}
            /> */}
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
