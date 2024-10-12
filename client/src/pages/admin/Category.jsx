// import React from "react";
import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { getCategories } from "./../../store/app/asyncActions";
import category_default from "./../../assets/category_default.png";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete,MdModeEdit } from "react-icons/md";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiDeleteCategory } from "../../apis";
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
const handleDeleteCategory = async (cid) => {


    try {
        const response = await apiDeleteCategory(cid);
        // console.log(response);
        toast.success('Xóa danh mục thành công!', {
            autoClose: 2000,
        });
        // Cập nhật lại danh sách categories
        dispatch(getCategories());
    } catch (error) {
        toast.error('Xóa danh mục thất bại!', {
            autoClose: 2000,
        });
    }
};
// Trong component

const notify = () => {
    toast("Thông báo của bạn ở đây!");
  };
  const handleAction = () => {
    if (role === 'admin') {
      toast.success('Thành công!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (role === 'user') {
      toast.error('Thất bại!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

const Category = () => {
    const dispatch = useDispatch();
            useEffect(() => {
                dispatch(getCategories());
            }, [dispatch]); //Tải lại category

    const { categories } = useSelector((state) => {
        return state.app;
    });
    
    const [showDeleteMessage, setShowDeleteMessage] = useState(false)
    const [deleteMessageContent, setDeleteMessageContent] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [deleteCategoryId, setDeleteCategoryId] = useState('')
    // const handleShowMessage = () => {
    //     setMessageContent(`Chi tiết sản phẩm:`);
    //     setShowMessage(true);
    //   };
    //   const handleCloseMessage = () => {
    //     setShowMessage(false);
    //     setMessageContent('');
    //   };
    const handleShowDeleteCategoryMessage = (cate,id) => {
        setDeleteMessageContent(`Phân loại: ${cate}`);
        setShowDeleteMessage(true);
        setDeleteCategoryId(id);
      };
      const handleCloseDeleteCategoryMessage = () => {
        setShowDeleteMessage(false);
        setDeleteMessageContent('');
        setDeleteCategoryId('');
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
                {categories?.map((e) => (
                        <tr key={e.id} className="border-b">
                        <td className="w-1/10 py-2 px-4 border-2 border-black content-center">{e.id}</td>
                        <td className='w-2/10 border border-black flex justify-center items-center'>
                        <img
                                            src={e.imageUrl || category_default}
                                            alt={e.name}
                                            // className="w-5 h-5 object-cover"
                                             className="w-20 h-20 object-cover"
                                        />
                        </td>
                        <td className='w-5/10 py-2 px-4 border-2 border-black content-center'>{e.name}</td>

                            <td className='w-1/10 py-2 px-4 border-2 border-black text-center'>
                            <a href={`${location.pathname}/edit/${e.id}`}>
                            <MdModeEdit className="w-8 h-8 inline-block"/>
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
                        <div   onClick={() => {
    handleShowDeleteCategoryMessage(e.name,e.id);
  }}>
                        <MdDelete className="w-8 h-8 inline-block"/>
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
         
        </div>
        </>
    );
};
export default Category;
