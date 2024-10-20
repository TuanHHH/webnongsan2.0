import React, { useState, useEffect } from "react";
import { apiGetAllOrders, apiUpdateOrderStatus } from "@/apis";
import { FaInfoCircle } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Table, Button, Dropdown, Menu, Select } from "antd";
import { createSearchParams } from "react-router-dom";
import { statusOrder } from "@/utils/constants";

const Order = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(params.get("page")) || 1);
  const ORDER_PER_PAGE = 12;
  const [orderMeta, setOrderMeta] = useState(null);
  const status = params.get("status");

  const fetchOrders = async (queries) => {
    const res = await apiGetAllOrders(queries);
    setOrders(res.data.result);
    setOrderMeta(res.data.meta);
  };

  useEffect(() => {
    const queries = {
      page: currentPage,
      size: ORDER_PER_PAGE,
      filter: [],
    };
    if (status) queries.filter.push(`status=${status}`);
    fetchOrders(queries);
  }, [currentPage, status]);

  const handlePagination = (page) => {
    setCurrentPage(page);
    const queries = {
      page: page,
      size: ORDER_PER_PAGE,
      filter: [],
    };
    if (status) queries.filter.push(`status=${status}`);
    fetchOrders(queries);
    const params = { page: page.toString() };
    if (status) params.status = status;
    navigate({
      search: createSearchParams(params).toString(),
    });
  };

  const handleChangeStatusOrder = (value) => {
    setCurrentPage(1);
    const queries = {
      page: 1,
      size: ORDER_PER_PAGE,
      filter: [],
    };
    const params = { page: "1" };
    if (value !== "default") {
      queries.filter.push(`status=${value}`);
      params.status = value;
    }
    fetchOrders(queries);
    navigate({
      search: createSearchParams(params).toString(),
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await apiUpdateOrderStatus(orderId, newStatus);
      if (res.statusCode === 200) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        const queries = {
          page: currentPage,
          size: ORDER_PER_PAGE,
          filter: status ? [`status=${status}`] : [],
        };
        fetchOrders(queries);
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra: " + err.message);
    }
  };

  const statusMenu = (order) => {
    const items = [
      ...(order.status === 0
        ? [
            {
              key: "in-delivery",
              label: "In Delivery",
              onClick: () => updateOrderStatus(order.id, 1),
            },
            {
              key: "cancel",
              label: "Cancel",
              onClick: () => updateOrderStatus(order.id, 3),
            },
          ]
        : []),
      ...(order.status === 1
        ? [
            {
              key: "success",
              label: "Success",
              onClick: () => updateOrderStatus(order.id, 2),
            },
          ]
        : []),
    ];
  
    return items.length > 0 ? <><Menu items={items} /></> : null;
  };
  

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
      render: (price) => `${price.toLocaleString('vi-VN')} đ`,
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
        <Dropdown overlay={statusMenu(order)} trigger={["click"]}>
          <Button className="w-28">
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
      <div className="mb-4">
        <Select
          placeholder="Sắp xếp theo trạng thái đơn đặt hàng"
          options={statusOrder}
          onChange={handleChangeStatusOrder}
          style={{ width: 250, marginRight: 16 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: ORDER_PER_PAGE,
          total: orderMeta?.total,
          onChange: handlePagination,
        }}
      />
    </div>
  );
};

export default Order;
