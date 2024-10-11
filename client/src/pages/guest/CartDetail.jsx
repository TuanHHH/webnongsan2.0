import React, { useEffect, useState, useRef } from 'react';
import { QuantitySelector } from '@/components';
import { ClipLoader } from 'react-spinners';
import icons from '@/utils/icons';
import { apiGetCart, apiAddOrUpdateCart, apiDeleteCart } from '@/apis';
import { toast } from 'react-toastify';
import withBaseComponent from '@/hocs/withBaseComponent';
import { getCurrentUser } from '@/store/user/asyncActions';
import { Link } from 'react-router-dom';
import path from '@/utils/path';
import { useSelector } from 'react-redux';

const { IoTrashBinOutline } = icons;

const DEBOUNCE_DELAY = 2000;
const DELETE_DELAY = 750;

const Cart = ({ dispatch }) => {
  const {current, isLoggedIn} = useSelector(state => state.user)
  //console.log(current, isLoggedIn)
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(new Set());
  // Trạng thái loading xóa sản phẩm
  const [loadingDeletes, setLoadingDeletes] = useState(new Set()); 
  const debounceTimeouts = useRef({});
  const pendingChanges = useRef({});

  const deleteProductInCart = async (pid) => {
    const res = await apiDeleteCart(pid);
    if (res.statusCode === 200) {
      toast.success("Đã xóa sản phẩm");
      dispatch(getCurrentUser())
    } else {
      toast.error("Có lỗi trong quá trình xóa");
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await apiGetCart();
        const products = response.data.result;
        setCartItems(products);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
      }
    };

    if (isLoggedIn && current){
      fetchCartItems();
    }

    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => clearTimeout(timeout));
      Object.entries(pendingChanges.current).forEach(([pid, change]) => {
        if (change !== undefined) {
          apiAddOrUpdateCart(pid, change);
        }
      });
    };
  }, []);

  useEffect(() => {
    const isAnyQuantityInvalid = cartItems.some(
      (item) => item.quantity < 1 || isNaN(item.quantity)
    );
    setIsCheckoutDisabled(isAnyQuantityInvalid || pendingUpdates.size > 0 || loadingDeletes.size > 0);
  }, [cartItems, pendingUpdates, loadingDeletes]);

  const handleQuantityChange = (pid, newQuantity) => {
    const currentItem = cartItems.find(item => item.id === pid);
    if (!currentItem) return;

    const validatedQuantity =
      newQuantity === '' || isNaN(newQuantity) || newQuantity < 1
        ? 1
        : Math.min(newQuantity, currentItem.stock);

    const quantityDifference = validatedQuantity - currentItem.quantity;

    if (quantityDifference === 0) return;

    // Thêm pid vào danh sách pending updates
    setPendingUpdates(prev => new Set(prev).add(pid));

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === pid
          ? {
            ...item,
            quantity: validatedQuantity,
          }
          : item
      )
    );

    const currentPendingChange = pendingChanges.current[pid] || 0;
    pendingChanges.current[pid] = currentPendingChange + quantityDifference;

    if (debounceTimeouts.current[pid]) {
      clearTimeout(debounceTimeouts.current[pid]);
    }

    debounceTimeouts.current[pid] = setTimeout(async () => {
      try {
        const finalChange = pendingChanges.current[pid];
        if (finalChange !== undefined) {
          const rs = await apiAddOrUpdateCart(pid, finalChange);
          if (rs.statusCode === 201) {
            toast.success(`Đã cập nhật số lượng mới: ${rs.data.quantity}`);
          } else {
            toast.error("Có lỗi xảy ra");
          }
          delete pendingChanges.current[pid];

          // Xóa pid khỏi danh sách pending updates sau khi cập nhật thành công
          setPendingUpdates(prev => {
            const newSet = new Set(prev);
            newSet.delete(pid);
            return newSet;
          });
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật giỏ hàng:', error);
      }
    }, DEBOUNCE_DELAY);
  };

  const increaseQuantity = (pid) => {
    const item = cartItems.find((item) => item.id === pid);
    if (item && item.quantity < item.stock) {
      handleQuantityChange(pid, item.quantity + 1);
    }
  };

  const decreaseQuantity = (pid) => {
    const item = cartItems.find((item) => item.id === pid);
    if (item && item.quantity > 1) {
      handleQuantityChange(pid, item.quantity - 1);
    }
  };

  const removeItem = (pid) => {
    setLoadingDeletes(prev => new Set(prev).add(pid)); // Thêm sản phẩm vào danh sách đang xóa
    setTimeout(() => {
      deleteProductInCart(pid);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== pid));
      setLoadingDeletes(prev => {
        const newSet = new Set(prev);
        newSet.delete(pid); // Xóa sản phẩm khỏi danh sách đang xóa
        return newSet;
      });

    }, DELETE_DELAY);
  };

  return (
    <div className="w-main mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-10 items-center border-b pb-4"
            >
              <div className="col-span-6 flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg truncate">{item.productName}</h3>
                  <p className="text-sm text-gray-500">
                    {item.price.toLocaleString('vi-VN')} đ
                  </p>
                  <p className="text-xs text-gray-500">Tồn kho: {item.stock}</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <QuantitySelector
                  quantity={item.quantity}
                  stock={item.stock}
                  onIncrease={() => increaseQuantity(item.id)}
                  onDecrease={() => decreaseQuantity(item.id)}
                  onChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                />
              </div>
              <div className="col-span-2 flex justify-center">
                {loadingDeletes.has(item.id) ? (
                  <ClipLoader size={20} color="#FF0000" />
                ) : (
                  <span
                    onClick={() => removeItem(item.id)}
                    className="hover:cursor-pointer hover:scale-110 transition-transform duration-200"
                  >
                    <IoTrashBinOutline color="red" size={20} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center'>
          <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
          <Link to={`/${path.PRODUCTS_BASE}`} className='mt-4'>
            <button className='bg-main p-4 rounded-xl text-white hover:underline hover:bg-green-500'>Mua sắm ngay</button>
          </Link>
        </div>
      )}

      {cartItems?.length > 0 && <>
        <div className="mt-6 text-right">
          <span className="text-lg font-semibold">
            Tổng:{' '}
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString('vi-VN')}{' '}
            đ
          </span>
        </div>
        <div className="mt-4 text-right">
          <button
            className={`bg-main text-white px-4 py-2 rounded-md hover:bg-green-500 
            ${isCheckoutDisabled ? 'opacity-50 cursor-not-allowed' : ''} 
            inline-flex items-center gap-2`}
            disabled={isCheckoutDisabled}
          >
            <span>Thanh toán</span>
            {(pendingUpdates.size > 0 || loadingDeletes.size > 0) && (
              <ClipLoader size={16} color="#ffffff" />
            )}
          </button>
        </div>
      </>
      }
    </div>
  );
};

export default withBaseComponent(Cart);
