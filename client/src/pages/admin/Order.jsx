import React, { useState, useEffect } from "react";
import { apiGetOrders } from "./../../apis";
import { FaInfoCircle } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "@/components";
import { toast } from "react-toastify";
import { apiUpdateOrderStatus } from "./../../apis";
const Order = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    Number(params.get("page")) || 1
  );

  const handleStatusChange = (e) => {
    handlePagination(1, e.target.value);
  };
  
  const ORDER_PER_PAGE = 12;
  const [hoveredOrderId, setHoveredOrderId] = useState(null);

  const setOrderInDelivery = async (orderId) => {
    try {
      const res = await apiUpdateOrderStatus(orderId, 1); // Chờ kết quả
      if (res.statusCode === 200) {
        toast.success("Đơn hàng đã được đặt là đang vận chuyển!");
        // Có thể gọi lại fetchOrders() để làm mới danh sách đơn hàng nếu cần
        fetchOrders();
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
        fetchOrders();
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
        fetchOrders();
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  const fetchOrders = async (queries) => {
    const res = await apiGetOrders(queries);
    setOrders(res);
  };

  const handlePagination = (page = 1) => {
    setCurrentPage(page);

    const queries = {
      page: page,
      size: ORDER_PER_PAGE,
      filter: [],
    };

    navigate({
      pathname: location.pathname,
      search: new URLSearchParams(queries).toString(),
    });

    fetchOrders(queries);
  };

  useEffect(() => {
    const queries = {
      page: currentPage,
      size: ORDER_PER_PAGE,
    };
    fetchOrders(queries);
  }, [currentPage]); // Fetch orders when currentPage changes

  return (
    <div className="w-full">
      <div>
        <style>
          {`
            .table-grid {
              display: grid;
              grid-template-columns: 0.4fr 1.5fr 2fr 1fr 0.9fr 1fr 1fr 0.7fr;
              border: 2px solid black;
            }
            .cell {
              border: 1px solid black;
              padding: 8px;
              text-align: center;
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: pre-wrap;
              word-break: break-all;
            }
            .header {
              background-color: #E5E5E5;
              font-weight: bold;
            }
          `}
        </style>
      </div>
      <div className="table-grid">
        {/* Header */}
        <div className="cell header">Id</div>
        <div className="cell header">Email</div>
        <div className="cell header">Địa chỉ</div>
        <div className="cell header">Th. gian ĐH</div>
        <div className="cell header">Thanh toán</div>
        <div className="cell header">Tổng giá trị</div>
        <div className="cell header">Trạng thái</div>
        <div className="cell header">Chi tiết</div>

        {/* Rows */}
        {orders?.data?.result?.map((e) => (
          <React.Fragment key={e.id}>
            <div className="cell">{e.id}</div>
            <div className="cell">{e.userEmail}</div>
            <div className="cell">{e.address}</div>
            <div className="cell">
              {new Date(e.orderTime).toLocaleDateString("vi-VN")}
            </div>
            <div className="cell">{e.paymentMethod}</div>
            <div className="cell">{e.total_price}</div>
            {/* <div className="cell"> */}
            <div
              className="cell"
              onMouseEnter={() => setHoveredOrderId(e.id)}
              onMouseLeave={() => setHoveredOrderId(null)}
            >
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  e.status === 0
                    ? "bg-yellow-100 text-yellow-800"
                    : e.status === 1
                    ? "bg-green-100 text-green-800"
                    : e.status === 2
                    ? "bg-green-200 text-green-900"
                    : "bg-red-100 text-red-800"
                }`}
                title={
                  e.status === 0
                    ? "Pending"
                    : e.status === 1
                    ? "In Delivery"
                    : e.status === 2
                    ? "Succeed"
                    : "Cancelled"
                }
              >
                {e.status === 0
                  ? "Pending"
                  : e.status === 1
                  ? "In Delivery"
                  : e.status === 2
                  ? "Succeed"
                  : "Cancelled"}
              </span>
              {hoveredOrderId === e.id && (
                <div className="absolute bg-white border border-gray-300 shadow-lg mt-1">
                  {e.status === 0 && (
                    <>
                      <button
                        className="block px-4 py-2 text-green-600 hover:bg-gray-100"
                        onClick={() => setOrderInDelivery(e.id)}
                      >
                        In Delivery
                      </button>
                      <button
                        className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                        onClick={() => setOrderCancel(e.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {e.status === 1 && (
                    <button
                      className="block px-4 py-2 text-green-600 hover:bg-gray-100"
                      onClick={() => setOrderSuccess(e.id)}
                    >
                      Success
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="cell">
              <div className="flex justify-center">
                <a
                  href={`${location.pathname}/${e.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaInfoCircle />
                </a>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="w-4/5 m-auto my-4 flex justify-center">
        <Pagination
          totalPage={orders?.data?.meta?.pages}
          currentPage={currentPage}
          totalProduct={orders?.data?.meta?.total}
          pageSize={orders?.data?.meta?.pageSize}
          onPageChange={handlePagination}
        />
      </div>
    </div>
  );
};

export default Order;