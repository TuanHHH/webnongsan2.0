import React from "react";
import { useState, useEffect } from "react";
import { apiGetOrders } from "./../../apis";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Order = () => {
    const location = useLocation();
  const [orders, setOrders] = useState(null);
  const fetchOrders = async (queries) => {
    const res = await apiGetOrders(queries);
    console.log(res.status_code);
    // if (res.status_code === 300) {
      setOrders(res.data.result);
    // }
  };
  useEffect(() => {
    const queries = {
      page: 1,
      size: 10,
    };
    fetchOrders(queries);
  }, []);
  console.log(orders);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 border-2 border-black">
            <th className="w-1/12 border-2 border-black">Id</th>
            <th className="w-2/12 border-2 border-black">Email</th>
            <th className="w-2/12 border-2 border-black">Địa chỉ</th>
            <th className="w-1/12 border-2 border-black">
              Thời gian chuyển hàng đến
            </th>
            <th className="w-1/12 border-2 border-black">Thời gian đặt hàng</th>
            <th className="w-1/12 border-2 border-black">
              Phương thức thanh toán
            </th>
            <th className="w-1/12 border-2 border-black">Tổng giá trị</th>
            <th className="w-1/12 border-2 border-black">Trạng thái</th>
            <th className="w-1/12 border-2 border-black">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.id}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.userEmail}
              </td>
              <td className="w-2/12 py-2 px-4 border-2 border-black content-center">
                {e.address}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.orderTime}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.deliveryTime}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.paymentMethod}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.status}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
                {e.total_price}
              </td>
              <td className="w-1/12 py-2 px-4 border-2 border-black content-center">
              {/* <Link to={`/orders/${e.id}`} className="text-blue-500 hover:text-blue-700">{<FaInfoCircle/>}</Link> */}
              <a 
                  // href={`${location.pathname}/OrderDetail/${e.id}`}
                  href={`${location.pathname}/${e.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaInfoCircle />
                </a>
              </td>
            </tr>
          ))}
        </tbody> 
      </table>
    </div>
  );
};
export default Order;
