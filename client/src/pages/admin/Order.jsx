import React, { useState, useEffect } from "react";
import { apiGetAllOrders, apiUpdateOrderStatus } from "@/apis";
import { FaInfoCircle } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Button, Dropdown, Menu } from "antd";

const Order = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(params.get("page")) || 1);
  const ORDER_PER_PAGE = 12;

  const fetchOrders = async (queries) => {
    const res = await apiGetAllOrders(queries);
    setOrders(res.data.result);
  };

  useEffect(() => {
    const queries = {
      page: currentPage,
      size: ORDER_PER_PAGE,
    };
    fetchOrders(queries);
  }, [currentPage]);

  const handlePagination = (page) => {
    setCurrentPage(page);
    const queries = {
      page: page,
      size: ORDER_PER_PAGE,
    };
    navigate({
      pathname: location.pathname,
      search: new URLSearchParams(queries).toString(),
    });
    fetchOrders(queries);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await apiUpdateOrderStatus(orderId, status);
      if (res.statusCode === 200) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        fetchOrders({ page: currentPage, size: ORDER_PER_PAGE });
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  const statusMenu = (order) => (
    <Menu>
      {order.status === 0 && (
        <>
          <Menu.Item onClick={() => updateOrderStatus(order.id, 1)}>In Delivery</Menu.Item>
          <Menu.Item onClick={() => updateOrderStatus(order.id, 3)}>Cancel</Menu.Item>
        </>
      )}
      {order.status === 1 && (
        <Menu.Item onClick={() => updateOrderStatus(order.id, 2)}>Success</Menu.Item>
      )}
    </Menu>
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Thời gian ĐH',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (order) => (
        <Dropdown overlay={statusMenu(order)} trigger={['click']}>
          <Button className="w-20">
            {order.status === 0
              ? "Pending"
              : order.status === 1
              ? "In Delivery"
              : order.status === 2
              ? "Succeed"
              : "Cancelled"}
          </Button>
        </Dropdown>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'detail',
      render: (record) => (
        <a href={`${location.pathname}/${record.id}`} className="text-blue-500 hover:text-blue-700">
          <FaInfoCircle />
        </a>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: ORDER_PER_PAGE,
          total: orders.length,
          onChange: handlePagination,
        }}
      />
    </div>
  );
};

export default Order;
