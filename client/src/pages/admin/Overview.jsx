import React, { useEffect, useState } from 'react';
import { apiGetProducts } from '@/apis';
import { apiGetOrders } from '@/apis';
import { apiGetAllUser } from '@/apis';

// import { useState } from 'react';
const Overview = () => {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const fetchProducts = async()=>{
    const res = await apiGetProducts();
    setTotalProduct(res.data.meta.total)
  };
  const fetchOrders = async()=>{
    const res = await apiGetOrders();
    let total = 0;
    for (let i=0;i<res.data.result.length;i++){
      total+=res.data.result[i].total_price;
    }
    setTotalProfit(total)
    setTotalOrder(res.data.meta.total)
  }
  const fetchUsers = async()=>{
    const res = await apiGetAllUser();
    setTotalUser(res.data.meta.total)
  }
  useEffect(()=>{
    fetchOrders();
    fetchProducts();
    fetchUsers();
  },[])
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getCategories());
  // }, [dispatch]); //Tải lại category
  
  // const 
  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Tổng lợi nhuận</h2>
            <p className="text-2xl font-bold">${totalProfit}</p>
            {/* <p className="text-green-500">+20.1% from last month</p> */}
          </div>
          <div className="bg-white shadow rounded-lg p-4 pr-40">
            <h2 className="text-sm font-medium">Người sử dụng</h2>
            <p className="text-2xl font-bold">{totalUser}</p>
            {/* <p className="text-green-500">+180.1% from last month</p> */}
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Tổng sản phẩm</h2>
            <p className="text-2xl font-bold">{totalProduct}</p>
            {/* <p className="text-gray-500">+19 added today</p> */}
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Đơn hàng</h2>
            <p className="text-2xl font-bold">{totalOrder}</p>
            {/* <p className="text-green-500">+201 since last hour</p> */}
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2">Order</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Product</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td>#3210</td>
                <td className="text-green-500">Shipped</td>
                <td>John Doe</td>
                <td>Product XYZ</td>
                <td>$59.99</td>
              </tr>
              <tr className="border-t">
                <td>#3209</td>
                <td className="text-yellow-500">Processing</td>
                <td>Jane Smith</td>
                <td>Product ABC</td>
                <td>$39.99</td>
              </tr>
              <tr className="border-t">
                <td>#3208</td>
                <td className="text-red-500">Cancelled</td>
                <td>Bob Johnson</td>
                <td>Product 123</td>
                <td>$79.99</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
