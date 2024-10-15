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
import { Pagination } from '@/components';
import { data } from 'autoprefixer';
import { SearchBar } from '@/components';
import product_default from "./../../assets/product_default.png";
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { SearchProduct } from '../../components/admin';
import { AddScreenButton } from '../../components/admin';
const PRODUCT_PER_PAGE = 6 ;
const Product = () => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(getCategories());
    // }, [dispatch]);

    const { categories } = useSelector((state) => {
        return state.app;
    },
);
const [params] = useSearchParams();
const navigate = useNavigate()
const [currentPage, setCurrentPage] = useState(Number(params.get('page')) || 1);
// const [category, setCategory] = useState(null);
// Thông tin sản phẩm
const [showMessage, setShowMessage] = useState(false);
const [messageContent, setMessageContent] = useState('');
const [productName, setProductName] = useState('');
const searchQuery = params.get('search') || '';

// const handlePagination = (page = 1) => {
//   // setPages(page);
//   setCurrentPage(page);
//   // navigate({ search: createSearchParams({ page }).toString() });
//   navigate({
//     search: `${createSearchParams({ search:searchQuery }).toString()}
//     &
//     ${createSearchParams({ page }).toString()}`
//   });
// const handlePagination = (page = 1) => {
//   setCurrentPage(page);

//   const queries = {
//     page: page,
//     size: 9,
//     filter: []
//   };
  // fetchProducts({page: page, size: 6,})
  // const queries = {
  //   page:currentPage,
  //   // page: 1, 
  //   size: 9,
  //   filter: []
  // };
//   const searchTerm = params.get('search');
//   if (searchTerm) {
//     queries.filter.push(`productName~'${searchTerm}'`);
//   }
//   const categorySearch  = params.get('category');
//   if (categorySearch){
//     queries.filter.push(`category~'${categorySearch}'`);
//   }
//   console.log(queries)
//   fetchProducts(queries);
// };
const handlePagination = (page = 1) => {
  setCurrentPage(page);

  const queries = {
    page: page,
    size: PRODUCT_PER_PAGE,
    filter: []
  };

  const searchTerm = params.get('search');
  console.log(searchTerm)
  const categorySearch = params.get('category');
  console.log(categorySearch)

  // Only add filter if they are not null
  if (searchTerm && searchTerm !== 'null') {
    queries.filter.push(`productName~'${searchTerm}'`);
  }
  
  if (categorySearch && categorySearch !== 'null') {
    queries.filter.push(`category.name~'${categorySearch}'`);
  }

  // Build search params dynamically
  const searchParams = {
    ...(searchTerm && searchTerm !== 'null' && { search: searchTerm }),
    ...(categorySearch && categorySearch !== 'null' && { category: categorySearch }),
    page: page,
  };

  navigate({
    search: createSearchParams(searchParams).toString()
  });

  fetchProducts(queries);
};
// const handleCategoryChange = (selectedCategory) => {
//   navigate({
//     search: createSearchParams({
//       search: searchQuery !== 'null' ? searchQuery : undefined,
//       category: selectedCategory !== 'null' ? selectedCategory : undefined,
//       page: 1 // Reset to page 1 on category change
//     }).toString()
//   });

//   fetchProducts({
//     page: 1,
//     size: PRODUCT_PER_PAGE,
//     filter: selectedCategory ? [`category.name~'${selectedCategory}'`] : []
//   });
// };
const handleCategoryChange = (selectedCategory) => {
  navigate({
    search: createSearchParams({
      search: searchQuery !== 'null' ? searchQuery : undefined, // Giữ lại từ khóa tìm kiếm
      category: selectedCategory !== 'null' ? selectedCategory : undefined,
      page: 1 // Đặt lại về trang 1 khi thay đổi danh mục
    }).toString()
  });

  fetchProducts({
    page: 1,
    size: PRODUCT_PER_PAGE,
    filter: selectedCategory ? [`category.name~'${selectedCategory}'`] : []
  });
};
useEffect(() => {
  const queries = {
    page: currentPage,
    size: PRODUCT_PER_PAGE,
    filter: []
  };

  const searchTerm = params.get('search');
  const categorySearch = params.get('category');

  if (searchTerm && searchTerm !== 'null') {
    queries.filter.push(`productName~'${searchTerm}'`);
  }

  if (categorySearch && categorySearch !== 'null') {
    queries.filter.push(`category.name~'${categorySearch}'`);
  }

  fetchProducts(queries);
}, [currentPage, params]);


const [showDeleteMessage, setShowDeleteMessage] = useState(false);
const [deleteMessageContent, setDeleteMessageContent] = useState('');
const [showEditForm, setShowEditForm] = useState(false); // Thêm state để điều khiển hiển thị EditProductForm

const handleShowDeleteProductMessage = (e) => {
  
  setShowDeleteMessage(true);
};
const handleCloseDeleteProductMessage = () => {
  setShowDeleteMessage(false);
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


      const [products, setProducts] = useState(null)
      console.log(products)
      const fetchProducts = async (queries) => {
        const response = await apiGetProducts(queries)
        // console.log(response)
        setProducts(response)
      }
      
      // useEffect(() => {
      //     const queries = {
      //       page:currentPage,
      //       // page: 1, 
      //       size: 3,
      //       filter: []
      //     };
      //     const searchTerm = params.get('search');
      //     if (searchTerm) {
      //       queries.filter.push(`productName~'${searchTerm}'`);
      //     }
      //     const categorySearch  = params.get('category');
      //     if (categorySearch){
      //       queries.filter.push(`category~'${categorySearch}'`);
      //     }
      //     fetchProducts(queries);
      // }, []);

      useEffect(() => {
        // Bạn có thể thực hiện tìm kiếm hoặc cập nhật trạng thái dựa trên searchQuery ở đây
        console.log('Giá trị tìm kiếm đã thay đổi:', searchQuery);
      }, [searchQuery]);
  return (
    <div className="w-full pr-3 relative">
    {/* <div className="w-full mr-3"> */}
    <div>

      {/* <div>Phần này quan trọng phải xem lại</div> */}
      
    {/* <div className="mb-14">
      <SearchProduct/>
      <div>
      <select onChange={(e) => handleCategoryChange(e.target.value)}>
  <option value="">All Categories</option>
  {categories?.map((category) => (
    <option key={category?.id} value={category?.name}>
      {category?.name}
    </option>
  ))}

</select>
      </div>
      </div> */}

    </div>

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
        {products?.data?.result?.map((e) => (
        <tr key={e.id} className="border-b">
                        <td className="w-2/12  border-2 border-black content-center">{e?.product_name||productData?.productName}</td>
                        <td className='w-12/12 border border-black flex justify-center items-center'>
                        <img
                                            src={e?.imageUrl || product_default}
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
            <div>
              <AddScreenButton buttonName='+ Thêm sản phẩm' buttonClassName='bg-green-500 hover:bg-green-700' toLink='add'/>
            </div>
                  <div className='w-4/5 m-auto my-4 flex justify-center'>
                <Pagination
                    totalPage={products?.data?.meta?.pages}
                    currentPage={currentPage}
                    totalProduct={products?.data?.meta?.total}
                    pageSize={productName?.meta?.pageSize}
                    onPageChange={handlePagination}
                />
            </div>
            <div><StatusComboBox/></div>
    </div>
  );
};
export default Product;

const StatusComboBox = () => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleChange = (event) => {
      setSelectedStatus(event.target.value);
      console.log("Selected Status:", event.target.value);
  };

  return (
      <div className="w-full">
          <label htmlFor="status" className="block mb-2 text-gray-700">
              Chọn trạng thái:
          </label>
          <select
              id="status"
              value={selectedStatus}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
          >
              <option value="">-- Chọn trạng thái --</option>
              <option value="pending">Pending Order</option>
              <option value="in_delivery">In Delivery</option>
              <option value="cancelled">Cancelled</option>
              <option value="success">Success</option>
          </select>
      </div>
  );
};
