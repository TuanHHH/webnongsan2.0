import React, { useEffect, useState } from "react";
import { apiGetProducts } from "@/apis";
import { apiGetAllOrders } from "@/apis";
import { apiGetAllUser, apiGetOverviewOrder } from "@/apis";
import { apiUpdateOrderStatus } from "@/apis";
import { toast } from "react-toastify";

const Overview = () => {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [overviewOrder, setOverviewOrder] = useState(null);
  const [hoverOrderStatus, setHoverOrderStatus] = useState(null);
  const fetchProducts = async () => {
    const res = await apiGetProducts();
    if (res.statusCode === 200) {
      setTotalProduct(res.data.meta.total);
    }
  };

  const setOrderInDelivery = async (orderId) => {
    try {
      const res = await apiUpdateOrderStatus(orderId, 1); // Chờ kết quả
      if (res.statusCode === 200) {
        toast.success("Đơn hàng đã được đặt là đang vận chuyển!");
        await fetchOrders();
        await fetchOverviewOrder();
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  const setOrderSuccess = async (orderId) => {
    try {
      const resSuccess = await apiUpdateOrderStatus(orderId, 2); // Chờ kết quả
      if (resSuccess.statusCode === 200) {
        toast.success("Xử lý đơn hàng thành công!");
        // Có thể gọi lại fetchOrders() để làm mới danh sách đơn hàng nếu cần
        await fetchOrders();
        await fetchOverviewOrder();
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  const setOrderCancel = async (orderId) => {
    try {
      const resCancel = await apiUpdateOrderStatus(orderId, 3); // Chờ kết quả
      if (resCancel.statusCode === 200) {
        toast.success("Hủy đơn hàng thành công!");
        // Có thể gọi lại fetchOrders() để làm mới danh sách đơn hàng nếu cần
        await fetchOrders();
        await fetchOverviewOrder();
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  // const fetchOrders = async () => {
  //   const res = await apiGetOrdersAll();
  //   if (res.statusCode === 200) {
  //     let total = 0;
  //     for (let i = 0; i < res.data.result.length; i++) {
  //       total += res.data.result[i].total_price;
  //     }
  //     setTotalProfit(total);
  //     setTotalOrder(res.data.meta.total);
  //   }
  // };
  const fetchOrders = async () => {
    const res = await apiGetAllOrders();
    if (res.statusCode === 200) {
      let total = 0;
      for (let i = 0; i < res.data.result.length; i++) {
        if(res.data.result[i].status===2){
          total += res.data.result[i].total_price;
        }
      }
      setTotalProfit(total);
      setTotalOrder(res.data.meta.total);
    }
  };
  const fetchOverviewOrder = async () => {
    const res = await apiGetOverviewOrder();

    if (res.statusCode === 200) {
      setOverviewOrder(res);
    }
  };
  const fetchUsers = async () => {
    const res = await apiGetAllUser();
    if (res.statusCode === 200) {
      setTotalUser(res.data.meta.total);
    }
  };
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
    fetchOverviewOrder();
  }, []);
  
  return (
    <div className="flex">
      <div>
      </div>
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4 pb-12">
            <h2 className="text-sm font-medium">Tổng lợi nhuận</h2>
            <p className="text-2xl font-bold">{totalProfit.toLocaleString("vi-VN")} đ</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 pr-28">
            <h2 className="text-sm font-medium">Người sử dụng</h2>
            <p className="text-2xl font-bold">{totalUser}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Tổng sản phẩm</h2>
            <p className="text-2xl font-bold">{totalProduct}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Đơn hàng</h2>
            <p className="text-2xl font-bold">{totalOrder}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Đơn đặt hàng mới nhất</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-3">Đơn hàng</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3">Khách hàng</th>
                <th className="pb-3">Đặt hàng lúc</th>
                <th className="pb-3">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {overviewOrder?.data?.map((item) => (
                <tr className="border-t"  key={item?.id}>
                  <td className="pb-1">{item?.id}</td>
                  <td>
                    <div
                      className="pb-3 relative"
                      onMouseEnter={() => setHoverOrderStatus(item.id)}
                      onMouseLeave={() => setHoverOrderStatus(null)}
                    >
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === 1
                            ? "bg-green-100 text-green-800"
                            : item.status === 2
                            ? "bg-green-200 text-green-900"
                            : "bg-red-100 text-red-800"
                        }`}
                        title={
                          item.status === 0
                            // ? "Pending"
                            ?"Đợi"
                            : item.status === 1
                            // ? "In Delivery"
                            ?"Đang vận chuyển"
                            : item.status === 2
                            // ? "Succeed"
                            ?"Xong"
                            // : "Cancelled"
                            :"Hủy"
                        }
                      >
                        {item.status === 0
                          // ? "Pending"
                          ?"Đợi"
                          : item.status === 1
                          // ? "In Delivery"
                          ?"Đang vận chuyển"
                          : item.status === 2
                          // ? "Succeed" 
                          ?"Hoàn thành"
                          // : "Cancelled"
                          :"Hủy"
                          }
                      </span>
                      {hoverOrderStatus === item.id && (
                        <div className="absolute  left-0 mt-1 bg-white border border-gray-300 shadow-lg z-10">
                          {item.status === 0 && (
                            <>
                              <button
                                className="block px-4 py-2 text-green-600 hover:bg-gray-100"
                                onClick={() => setOrderInDelivery(item.id)}
                              >
                                Đang vận chuyển
                              </button>
                              <button
                                className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                                onClick={() => setOrderCancel(item.id)}
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          {item.status === 1 && (
                            <button
                              className="block px-4 py-2 text-green-600 hover:bg-gray-100"
                              onClick={() => setOrderSuccess(item.id)}
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{item?.userName}</td>
                  <td>
                    {new Date(item?.orderTime).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{item?.total_price.toLocaleString("vi-VN")} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


};

export default Overview;
