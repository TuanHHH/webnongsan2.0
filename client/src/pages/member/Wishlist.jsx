import React, { useEffect, useState, useRef } from 'react';
import { Pagination } from '@/components';
import { ClipLoader } from 'react-spinners';
import icons from '@/utils/icons';
import { apiDeleteWishlist, apiGetWishlist } from '@/apis';
import { toast } from 'react-toastify';
import withBaseComponent from '@/hocs/withBaseComponent';
//import { getCurrentUser } from '@/store/user/asyncActions';
import { Link } from 'react-router-dom';
import path from '@/utils/path';
import { useSelector } from 'react-redux';

const { IoTrashBinOutline } = icons;
const DELETE_DELAY = 750;
const PAGE_SIZE = 5;

const Wishlist = () => {
    const { current, isLoggedIn } = useSelector(state => state.user);
    const [wishlist, setWishlist] = useState(null);
    const [pages, setPages] = useState(1);
    const [loadingDeletes, setLoadingDeletes] = useState(new Set());
    const debounceTimeouts = useRef({});

    const handlePagination = (page = 1) => {
        setPages(page);
        fetchWishlistItems(page, PAGE_SIZE);
    };

    const deleteProductInWishlist = async (pid) => {
        const res = await apiDeleteWishlist(pid);
        if (res.statusCode === 200) {
            toast.success("Đã xóa sản phẩm khỏi yêu thích");
            //dispatch(getCurrentUser());
        } else {
            toast.error("Có lỗi trong quá trình xóa");
        }
    };

    const fetchWishlistItems = async (page = 1, pageSize = PAGE_SIZE) => {
        try {
            const response = await apiGetWishlist(page, pageSize);
            setWishlist(response?.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu wishlist:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn && current) {
            fetchWishlistItems(pages, PAGE_SIZE);
        }

        return () => {
            Object.values(debounceTimeouts.current).forEach(timeout => clearTimeout(timeout));
        };
    }, [isLoggedIn, pages]);

    const removeItem = (pid) => {
        // Thêm sản phẩm vào danh sách đang xóa
        setLoadingDeletes(prev => new Set(prev).add(pid));

        // Cập nhật wishlist để xóa sản phẩm trên giao diện sau một khoảng thời gian
        debounceTimeouts.current[pid] = setTimeout(() => {
            setWishlist(prevWishlist => {
                if (!prevWishlist || !prevWishlist.result) return prevWishlist;
                
                const updatedResult = prevWishlist.result.filter(item => item.id !== pid);
                return {
                    ...prevWishlist,
                    result: updatedResult,
                    meta: {
                        ...prevWishlist.meta,
                        total: prevWishlist.meta.total - 1
                    }
                };
            });

            // Gọi API xóa sản phẩm (để xóa từ server)
            deleteProductInWishlist(pid).then(() => {
                // Cập nhật trạng thái loading sau khi API call hoàn thành
                setLoadingDeletes(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(pid);
                    return newSet;
                });
            }).catch(error => {
                console.error("Lỗi khi xóa sản phẩm:", error);
                toast.error("Có lỗi xảy ra khi xóa sản phẩm");
                // Nếu xóa thất bại, có thể cần khôi phục lại item trong wishlist
            });
        }, DELETE_DELAY);
    };

    return (
        <div className='w-full relative px-4'>
            <header className="text-xl font-semibold py-4 mb-5">
                Wishlist
            </header>
            <div className="w-4/5 mx-auto py-8 flex flex-col gap-4">
                {wishlist?.result?.length > 0 ? (
                    <div className="space-y-2">
                        {wishlist?.result.map((item) => (
                            <div key={item.id} className='grid grid-cols-10 items-center border-b pb-4'>
                                <Link
                                    to={`/products/${encodeURIComponent(item?.category)}/${item?.id}/${encodeURIComponent(item?.productName)}`}
                                    className={`col-span-6 flex items-center ${item?.stock <= 0 ? 'opacity-50' : ''}`}
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-20 h-20 object-cover rounded-md mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="truncate hover:underline">{item.productName}</h3>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                </Link>
                                <div className='col-span-2 flex justify-center'>
                                    <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')} đ</p>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    <button
                                        disabled={loadingDeletes.has(item.id)}
                                        onClick={() => removeItem(item.id)}
                                        className={`transition-transform duration-200 hover:cursor-pointer hover:scale-110 ${loadingDeletes.has(item.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loadingDeletes.has(item.id) ? (
                                            <ClipLoader size={20} color="#FF0000" />
                                        ) : (
                                            <IoTrashBinOutline className={`${item.stock <= 0 ? 'opacity-100' : ''}`} color="red" size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center min-h-[70vh]'>
                        <p className="text-gray-500">Wishlist của bạn đang trống.</p>
                        <Link to={`/${path.PRODUCTS_BASE}`} className='mt-4'>
                            <button className='bg-main p-4 rounded-xl text-white hover:underline hover:bg-green-500'>Mua sắm ngay</button>
                        </Link>
                    </div>
                )}
            </div>
            <div className='w-4/5 m-auto my-4 flex justify-center'>
                <Pagination
                    totalPage={wishlist?.meta?.pages}
                    currentPage={pages}
                    totalProduct={wishlist?.meta?.total}
                    pageSize={wishlist?.meta?.pageSize}
                    onPageChange={handlePagination}
                />
            </div>
        </div>
    );
};

export default Wishlist;