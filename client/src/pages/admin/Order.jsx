import React from "react";
import { useState, useEffect } from "react";
import { apiGetOrders } from "./../../apis";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Pagination } from "@/components";
import { useParams, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';

const Order = () => {
  const [params] = useSearchParams();
const navigate = useNavigate()
  const location = useLocation();
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(Number(params.get('page')) || 1);
  const ORDER_PER_PAGE = 12 ;
  const fetchOrders = async (queries) => {
    const res = await apiGetOrders(queries);
    setOrders(res);
  };
  const handlePagination = (page = 1) => {
    
    setCurrentPage(page);
  
    const queries = {
      page: page,
      size:  ORDER_PER_PAGE,
      filter: []
    };
  
    navigate({
      search: createSearchParams(searchParams).toString()
    });
  
    fetchOrders(queries);
  };

  useEffect(() => {
    const queries = {
      page: currentPage,
      size: ORDER_PER_PAGE,
    };
    fetchOrders(queries);
  }, []);

  return (
    <div className="w-full">
      <div>
        <style>
          {`
            .table-grid {
                display: grid;
                grid-template-columns: 0.4fr 1.5fr 2fr 1fr 0.9fr 1fr 1fr 0.7fr;
                /* Tạo layout với kích thước mong muốn */
                border: 2px solid black;
            }

            .cell {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
                word-wrap: break-word;
                overflow-wrap: break-word;
                /* Đảm bảo từ sẽ xuống dòng khi quá dài */
                white-space: pre-wrap;
                /* Đảm bảo xuống dòng khi nội dung dài */
                word-break: break-all;
                /* Cho phép ngắt từ ở bất kỳ vị trí nào nếu cần */
            }

            .header {
                background-color: #E5E5E5;
                /* Background color for header */
                font-weight: bold;
                // white-space: nowrap; /* Prevent line breaks */
                // overflow: hidden; /* Hide overflowed text */
                // text-overflow: ellipsis; /* Show ellipsis for overflowed text */
            }
          }
        `}
        </style>
      </div>
      <div>
        <div className="table-grid">
          {/* Header */}
          <div className="cell header">Id</div>
          <div className="cell header">Email</div>
          <div className="cell header">Địa chỉ</div>
          {/* <div className="cell header">Thời gian chuyển hàng đến</div> */}
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
              <div className="cell">{new Date(e.orderTime).toLocaleDateString('vi-VN')}</div>
              {/* <div className="cell">{e.deliveryTime}</div> */}
              <div className="cell">{e.paymentMethod}</div>
              <div className="cell">{e.total_price}</div>
              <div className="cell">{e.status}</div>
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
      </div>

      <div className='w-4/5 m-auto my-4 flex justify-center'>
                <Pagination
                    totalPage={orders?.data?.meta?.pages}
                    currentPage={currentPage}
                    totalProduct={orders?.data?.meta?.total}
                    pageSize={orders?.meta?.pageSize}
                    onPageChange={handlePagination}
                />
            </div>
    </div>
  );
};
export default Order;
