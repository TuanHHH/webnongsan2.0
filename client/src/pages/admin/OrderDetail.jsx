// import { apiGetOrderDetail, apiGetOrderInfor } from "@/apis";
// import { TurnBackHeader } from "@/components/admin";
// import React, { useEffect, useState } from "react";
// import { getUserById } from "@/apis";
// import product_default from "./../../assets/product_default.png";

// function OrderDetail() {
//   const [orderDetail, setOrderDetail] = useState(null);
//   const [orderInformation, setOrderInformation] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [user_Id, setUser_Id] = useState(null);
//   const [user, setUser] = useState(null);
//   const [totalMoney, setTotalMoney] = useState(0);
//   const fetchOrderDetail = async (oid) => {
//     const res = await apiGetOrderDetail(oid);
//     const res2 = await apiGetOrderInfor(oid);
//     setOrderDetail(res);
//     setOrderInformation(res2);
//     setUser_Id(res2?.data?.userId);
//   };

//   const fetchUserById = async (uid) => {
//     const userId = parseInt(uid, 10);
//     if (isNaN(userId)) {
//       console.error("Invalid user ID");
//       return;
//     }
//     try {
//       const res = await getUserById(userId);
//       setUser(res);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };

//   const path = window.location.pathname;
//   const oid = path.split("/").pop();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await fetchOrderDetail(oid);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, [oid]);

//   useEffect(() => {
//     if (user_Id) {
//       fetchUserById(user_Id);
//     }
//   }, [user_Id]);

//   useEffect(() => {
//     if (orderInformation?.data?.paymentMethod === "1") {
//       setPaymentMethod("Tiền mặt 💵");
//     } else if (orderInformation?.data?.paymentMethod === "2") {
//       setPaymentMethod("Thẻ ngân hàng 💳");
//     }
//   }, [orderInformation]);

//   useEffect(() => {
//     if (orderDetail?.data?.result) {
//       const total = orderDetail.data.result.reduce((sum, item) => {
//         return sum + item.unit_price * item.quantity;
//       }, 0);
//       setTotalMoney(total);
//     }
//   }, [orderDetail]);

//   return (
//     <div className="w-full">
//       <TurnBackHeader
//         turnBackPage="/admin/order"
//         header="Quay về trang đơn đặt hàng"
//       />
//       <div className="order-details w-full">
//         <div>
//           <style>
//             {`
//               .order-details {
//                 font-family: Arial, sans-serif;
//                 margin: 20px;
//                 width: 90%; 
//               }
              
//               .order-info {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-bottom: 20px;
//                 padding: 20px;
//                 border: 1px solid #ddd;
//                 border-radius: 12px;
//               }
              
//               .customer-info, .order-summary {
//                 width: 45%;
//               }
              
//               .cart-items {
//                 border: 1px solid #ddd;
//                 border-radius: 8px;
//                 padding: 20px;
//                 width: 100%; 
//               }
              
//               table {
//                 width: 100%; 
//                 border-collapse: collapse;
//               }
              
//               th, td {
//                 padding: 10px;
//                 border: 1px solid #ddd;
//                 text-align: left;
//               }
              
//               .image-placeholder {
//                 width: 50px;
//                 height: 50px;
//                 background-color: #f0f0f0;
//                 border-radius: 4px;
//               }
              
//               strong {
//                 font-weight: bold;
//               }
//             `}
//           </style>
//         </div>
//         <div className="w-full">
//           <h1>Order Details</h1>
//           <div className="order-info">
//             <div className="customer-info">
//               <h2>Thông tin khách hàng</h2>
//               <p>
//                 <strong>Tên:</strong> {user?.data?.name}
//               </p>
//               <p>
//                 <strong>☎Số điện thoại:</strong> {user?.data?.phone}
//               </p>
//               <p>
//                 <strong>@Email:</strong> {orderInformation?.data?.userEmail}
//               </p>
//               <p>
//                 <strong>📍Địa chỉ</strong>
//                 {user?.data?.address}
//               </p>
//             </div>
//             <div className="order-summary">
//               <h2>Đơn hàng</h2>
//               <p>
//                 <strong>Tổng số tiền:</strong>{" "}
//                 {orderInformation?.data?.total_price} đ
//               </p>
//               <p>
//                 <strong>Phương thức thanh toán:</strong> {paymentMethod}
//               </p>
//               <p>
//                 📅 <strong>Thời gian đặt hàng:</strong>{" "}
//                 {new Date(orderInformation?.data?.orderTime)
//                   .toLocaleString("vi-VN", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     day: "numeric",
//                     month: "numeric",
//                     year: "numeric",
//                     hour12: false,
//                   })
//                   .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$1/$2/$3")}
//               </p>
//               <p>
//                 <p>
//                   {orderInformation?.data?.status === 0 ? (
//                     <strong>🕑 Đơn hàng đang chờ xác nhận</strong>
//                   ) : orderInformation?.data?.status === 1 ? (
//                     orderInformation?.data?.deliveryTime ? (
//                       <>
//                         {/* <strong>📅 Thời gian chuyển đến:</strong> */}
//                         <strong>✅ Đơn hàng đã được xác nhận</strong>
//                       </>
//                     ) : (
//                       <></>
//                     )
//                   ) : orderInformation?.data?.status === 2 ? (
//                     // <strong>✅ Đơn hàng đã thành công</strong>
//                     <>
//                       <strong>📅 Được chuyển đến lúc: </strong>
//                       {new Date(orderInformation?.data?.deliveryTime)
//                         .toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "numeric",
//                           month: "numeric",
//                           year: "numeric",
//                           hour12: false,
//                         })
//                         .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$1/$2/$3")}
//                     </>
//                   ) : orderInformation?.data?.status === 3 ? (
//                     <>
//                       <strong>❌ Đơn hàng đã bị hủy lúc:</strong>
//                       {new Date(orderInformation?.data?.deliveryTime)
//                         .toLocaleString("vi-VN", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           day: "numeric",
//                           month: "numeric",
//                           year: "numeric",
//                           hour12: false,
//                         })
//                         .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$1/$2/$3")}
//                     </>
//                   ) : null}
//                 </p>
//               </p>
//             </div>
//           </div>
//           <div className="cart-items">
//             <h2>Cart Items</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Ảnh</th>
//                   <th>Sản phẩm</th>
//                   <th>Giá</th>
//                   <th>Số lượng</th>
//                   <th>Tổng cộng</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderDetail?.data?.result.map((item, index) => (
//                   // <tr key={item.orderId}>
//                   <tr key={`${item.orderId}-${index}`}>
//                     <td>
//                       <div className="image-placeholder">
//                         <img
//                           src={
//                             item?.imageUrl && item.imageUrl.startsWith("https")
//                               ? item.imageUrl
//                               : item.imageUrl
//                               ? `http://localhost:8080/storage/product/${item.imageUrl}`
//                               : "product_default"
//                           }
//                           alt={item.productName}
//                         />
//                       </div>
//                     </td>
//                     <td>{item.productName}</td>
//                     <td>
//                       {" "}
//                       {item.unit_price
//                         ? item.unit_price.toLocaleString("vi-VN")
//                         : "0"}{" "}
//                       đ
//                     </td>
//                     <td>{item.quantity}</td>

//                     <td>
//                       {(item.unit_price * item.quantity).toLocaleString(
//                         "vi-VN"
//                       )}{" "}
//                       đ
//                     </td>
//                   </tr>
//                 ))}
//                 <tr>
//                   <td colSpan="4" className="text-end px-9">
//                     <p>
//                       <strong>Tổng số tiền</strong>
//                     </p>
//                   </td>
//                   <td>{totalMoney.toLocaleString("vi-VN")} đ</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderDetail;
import React, { useEffect, useState } from "react";
import { apiGetOrderDetail, apiGetOrderInfor, getUserById } from "@/apis";
import { TurnBackHeader } from "@/components/admin";
import { Card, Row, Col, Typography, Table, Space, Image } from "antd";
import product_default from "./../../assets/product_default.png";

const { Title, Text } = Typography;

function OrderDetail() {
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderInformation, setOrderInformation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [user_Id, setUser_Id] = useState(null);
  const [user, setUser] = useState(null);
  const [totalMoney, setTotalMoney] = useState(0);
  
  const fetchOrderDetail = async (oid) => {
    const res = await apiGetOrderDetail(oid);
    const res2 = await apiGetOrderInfor(oid);
    setOrderDetail(res);
    setOrderInformation(res2);
    setUser_Id(res2?.data?.userId);
  };

  const fetchUserById = async (uid) => {
    const userId = parseInt(uid, 10);
    if (isNaN(userId)) {
      console.error("Invalid user ID");
      return;
    }
    try {
      const res = await getUserById(userId);
      setUser(res);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const path = window.location.pathname;
  const oid = path.split("/").pop();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrderDetail(oid);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [oid]);

  useEffect(() => {
    if (user_Id) {
      fetchUserById(user_Id);
    }
  }, [user_Id]);

  useEffect(() => {
    if (orderInformation?.data?.paymentMethod == "COD") {
      setPaymentMethod("Tiền mặt 💵");
    } else if (orderInformation?.data?.paymentMethod == "BANKING") {
      setPaymentMethod("Thẻ ngân hàng 💳");
    }
  }, [orderInformation]);

  useEffect(() => {
    if (orderDetail?.data?.result) {
      const total = orderDetail.data.result.reduce((sum, item) => {
        return sum + item.unit_price * item.quantity;
      }, 0);
      setTotalMoney(total);
    }
  }, [orderDetail]);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      render: (text, record) => (
        <Image
          width={50}
          src={
            record.imageUrl && record.imageUrl.startsWith("https")
              ? record.imageUrl
              : record.imageUrl
              ? `http://localhost:8080/storage/product/${record.imageUrl}`
              : product_default
          }
          alt={record.productName}
        />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Giá',
      dataIndex: 'unit_price',
      render: (text) => `${text ? text.toLocaleString("vi-VN") : "0"} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      render: (text, record) => `${(record.unit_price * record.quantity).toLocaleString("vi-VN")} đ`,
    },
  ];

  return (
    <div className="w-full">
      <TurnBackHeader
        turnBackPage="/admin/order"
        header="Quay về trang đơn đặt hàng"
      />
      <Card title="Chi tiết đơn hàng" style={{ width: '90%', margin: '20px auto' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>Thông tin khách hàng</Title>
            <Text strong>Tên:</Text> {user?.data?.name}<br />
            <Text strong>☎Số điện thoại:</Text> {user?.data?.phone}<br />
            <Text strong>📩Email:</Text> {orderInformation?.data?.userEmail}<br />
            <Text strong>📍Địa chỉ:</Text> {orderInformation?.data?.address}
          </Col>
          <Col span={12}>
            <Title level={4}>Đơn hàng</Title>
            <Text strong>Tổng số tiền:</Text> {orderInformation?.data?.total_price.toLocaleString("vi-VN")} đ<br />
            <Text strong>Phương thức thanh toán:</Text> {paymentMethod}<br />
            <Text strong>📅 Thời gian đặt hàng:</Text> {new Date(orderInformation?.data?.orderTime)
              .toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour12: false,
              })}
            <br />
            <Text strong>
              {orderInformation?.data?.status === 0 ? "🕑 Đơn hàng đang chờ xác nhận" :
              orderInformation?.data?.status === 1 ? "✅ Đơn hàng đã được xác nhận" :
              orderInformation?.data?.status === 2 ? `📅 Được chuyển đến lúc: ${new Date(orderInformation?.data?.deliveryTime)
                .toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour12: false,
                })}` :
              orderInformation?.data?.status === 3 ? `❌ Đơn hàng đã bị hủy lúc: ${new Date(orderInformation?.data?.deliveryTime)
                .toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour12: false,
                })}` :
              null}
            </Text>
          </Col>
        </Row>
      </Card>
      <Card title="Cart Items" style={{ width: '90%', margin: '20px auto' }}>
        <Table
          columns={columns}
          dataSource={orderDetail?.data?.result}
          rowKey={(record, index) => `${record.orderId}-${index}`}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4}>
                  <Text strong>Tổng số tiền</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong>{totalMoney.toLocaleString("vi-VN")} đ</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
}

export default OrderDetail;
