// import React from "react";
// const Overview = () => {
//     return (
//         <div className="container">
//             <div className="row">
//                 <div className="col-sm-12">
//                     <table
//                         style={{ width: '100%' }}
//                         className="table table-hover table-striped table-bordered "
//                         role="grid"
//                         aria-describedby="example_info"
//                     >
//                         <thead>
//                             <tr role="row">
//                                 <th className="sorting_asc" tabIndex="0" aria-controls="example" rowSpan="1" colSpan="1" style={{ width: '180.4px' }} aria-sort="ascending" aria-label="Name: activate to sort column descending">Name</th>
//                                 <th className="sorting" tabIndex="0" aria-controls="example" rowSpan="1" colSpan="1" style={{ width: '274.4px' }} aria-label="Position: activate to sort column ascending">Position</th>
//                                 <th className="sorting" tabIndex="0" aria-controls="example" rowSpan="1" colSpan="1" style={{ width: '131.4px' }} aria-label="Office: activate to sort column ascending">Office</th>
//                                 <th className="sorting" tabIndex="0" aria-controls="example" rowSpan="1" colSpan="1" style={{ width: '63.4px' }} aria-label="Age: activate to sort column ascending">Age</th>
//                                 <th className="sorting" tabIndex="0" aria-controls="example" rowSpan="1" colSpan="1" style={{ width: '123.4px' }} aria-label="Start date: activate to sort column ascending">Start date</th>
//                                 <th className="sorting" tabIndex="0" aria-controls="example" rowSpan="1" colSpan="1" style={{ width: '100.2px' }} aria-label="Salary: activate to sort column ascending">Salary</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {[
//                                 { name: 'Airi Satou', position: 'Accountant', office: 'Tokyo', age: 33, startDate: '2008/11/28', salary: '$162,700' },
//                                 { name: 'Angelica Ramos', position: 'Chief Executive Officer (CEO)', office: 'London', age: 47, startDate: '2009/10/09', salary: '$1,200,000' },
//                                 { name: 'Ashton Cox', position: 'Junior Technical Author', office: 'San Francisco', age: 66, startDate: '2009/01/12', salary: '$86,000' },
//                                 { name: 'Bradley Greer', position: 'Software Engineer', office: 'London', age: 41, startDate: '2012/10/13', salary: '$132,000' },
//                                 { name: 'Brenden Wagner', position: 'Software Engineer', office: 'San Francisco', age: 28, startDate: '2011/06/07', salary: '$206,850' },
//                                 { name: 'Brielle Williamson', position: 'Integration Specialist', office: 'New York', age: 61, startDate: '2012/12/02', salary: '$372,000' },
//                                 { name: 'Bruno Nash', position: 'Software Engineer', office: 'London', age: 38, startDate: '2011/05/03', salary: '$163,500' },
//                                 { name: 'Caesar Vance', position: 'Pre-Sales Support', office: 'New York', age: 21, startDate: '2011/12/12', salary: '$106,450' },
//                                 { name: 'Cara Stevens', position: 'Sales Assistant', office: 'New York', age: 46, startDate: '2011/12/06', salary: '$145,600' },
//                                 { name: 'Cedric Kelly', position: 'Senior Javascript Developer', office: 'Edinburgh', age: 22, startDate: '2012/03/29', salary: '$433,060' },
//                             ].map((employee, index) => (
//                                 <tr role="row" className={index % 2 === 0 ? 'even' : 'odd'} key={employee.name}>
//                                     <td tabIndex="0" className="sorting_1">{employee.name}</td>
//                                     <td>{employee.position}</td>
//                                     <td>{employee.office}</td>
//                                     <td>{employee.age}</td>
//                                     <td>{employee.startDate}</td>
//                                     <td>{employee.salary}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                         <tfoot>
//                             <tr>
//                                 <th rowSpan="1" colSpan="1">Name</th>
//                                 <th rowSpan="1" colSpan="1">Position</th>
//                                 <th rowSpan="1" colSpan="1">Office</th>
//                                 <th rowSpan="1" colSpan="1">Age</th>
//                                 <th rowSpan="1" colSpan="1">Start date</th>
//                                 <th rowSpan="1" colSpan="1">Salary</th>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>

//             <hr />
//             <div className="col-lg-12">
//                 <div className="single_element">
//                     <div className="quick_activity">
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="quick_activity_wrap">
//                                     {[
//                                         { title: 'Total Income', amount: '579,000', saved: '25%' },
//                                         { title: 'Total Expenses', amount: '79,000', saved: '25%' },
//                                         { title: 'Cash on Hand', amount: '92,000', saved: '25%' },
//                                         { title: 'Net Profit Margin', amount: '179,000', saved: '65%' },
//                                     ].map(activity => (
//                                         <div className="single_quick_activity" key={activity.title}>
//                                             <h4>{activity.title}</h4>
//                                             <h3>$ <span className="counter">{activity.amount}</span></h3>
//                                             <p>Saved {activity.saved}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// };
// export default Overview;

import React from 'react';

const Overview = () => {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Tổng lợi nhuận</h2>
            <p className="text-2xl font-bold">$45,231.89</p>
            {/* <p className="text-green-500">+20.1% from last month</p> */}
          </div>
          <div className="bg-white shadow rounded-lg p-4 pr-40">
            <h2 className="text-sm font-medium">Người sử dụng</h2>
            <p className="text-2xl font-bold">+2350</p>
            {/* <p className="text-green-500">+180.1% from last month</p> */}
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Tổng sản phẩm</h2>
            <p className="text-2xl font-bold">12,234</p>
            {/* <p className="text-gray-500">+19 added today</p> */}
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-sm font-medium">Đơn hàng</h2>
            <p className="text-2xl font-bold">573</p>
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
