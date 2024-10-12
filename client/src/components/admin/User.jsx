import React from "react";
import { useState, useEffect } from "react";
import { apiGetAllUser, apiGetCurrentUser } from "./../../apis";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "./../../store/user/asyncActions";
import { MdDelete, MdModeEdit } from "react-icons/md";
// const User = () => {
//   return (
//     <div className="flex-1 bg-gray-100 p-4">
//     <h1 className="text-2xl font-bold">Nội dung chính</h1>
//     <p>User</p>

// </div>
//   )
// }
// const StatusComboBox = ({ status, onChange }) => {
//   return (
//     <select
//       className="w-1/10 py-1 px-2 border-2 border-black text-center text-sm"
//       value={status}
//       onChange={(e) => onChange(e.target.value)}
//     >
//       <option className="text-center" value={1}>
//         Active
//       </option>
//       <option className="text-center" value={0}>
//         Inactive
//       </option>
//     </select>
//   );
// };
// const StatusComboBox = ({ status, onChange }) => {
//   // Define a style for the select based on the status
//   const selectStyle = status === '1' 
//     ? "w-1/10 py-1 px-2 border-2 border-black text-center text-sm bg-green-200"
//     : status === '0'
//       ? "w-1/10 py-1 px-2 border-2 border-black text-center text-sm bg-red-200"
//       : "w-1/10 py-1 px-2 border-2 border-black text-center text-sm";

//   return (
//     <select
//       className={selectStyle}
//       value={status}
//       onChange={(e) => onChange(e.target.value)}
//     >
//       <option className="text-center" value={1}>Active</option>
//       <option className="text-center" value={0}>Inactive</option>
//     </select>
//   );
// }

const StatusComboBox = ({ status, onChange }) => {
  const selectStyle = status === '1'
    ? "w-1/10 py-1 px-2 border-2 border-black text-center text-sm bg-green-200"
    : status === '0'
      ? "w-1/10 py-1 px-2 border-2 border-black text-center text-sm bg-red-200"
      : "w-1/10 py-1 px-2 border-2 border-black text-center text-sm";

  return (
    <select
      className={selectStyle}
      value={status}
      onChange={(e) => onChange(e.target.value)}
    >
      <option className="text-center" value="1">Active</option>
      <option className="text-center" value="0">Inactive</option>
    </select>
  );
};

const User = () => {
  const [users, setUsers] = useState(null);
  const [cbbUser, setCbbUser] = useState(null)

  //   const { account } = useSelector((state) => {
  //     return state.user;
  // });
  // console.log(account)
  const fetchUsers = async (queries) => {
    const res = await apiGetAllUser(queries);
    // console.log(res.status_code);
    setUsers(res.data.result);
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers((prevUsers) => 
      prevUsers.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };
  
  useEffect(() => {
    const queries = {
      page: 1,
      size: 10,
    };
    fetchUsers(queries);
  }, []);
  console.log(users);

  return (
    <div>
      <style>
        {`
          .table-grid {
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 3fr 3fr 2fr 2fr 2fr 1fr 1fr; /* Tạo layout với kích thước mong muốn */
  border: 2px solid black;
}

.cell {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word; /* Đảm bảo từ sẽ xuống dòng khi quá dài */
  white-space: pre-wrap; /* Đảm bảo xuống dòng khi nội dung dài */
  word-break: break-all; /* Cho phép ngắt từ ở bất kỳ vị trí nào nếu cần */
}
          }
        `}
      </style>

<div className="table-grid">
  {/* Header */}
  <div className="cell bg-gray-200">ID</div>
  <div className="cell bg-gray-200">Avatar</div>
  <div className="cell bg-gray-200">Tên</div>
  <div className="cell bg-gray-200">Email</div>
  <div className="cell bg-gray-200">Địa chỉ</div>
  <div className="cell bg-gray-200">Số điện thoại</div>
  <div className="cell bg-gray-200">Trạng thái</div>
  <div className="cell bg-gray-200">Chức năng</div>
  <div className="cell bg-gray-200">Sửa</div>
  <div className="cell bg-gray-200">Xóa</div>

  {/* Rows */}
  {users?.map((e) => (
    <React.Fragment key={e.id}>
      <div className="cell">{e.id}</div>
      <div className="cell">
        <img
          src={e.avatarUrl || ""}
          alt={e.name}
          className="w-16 h-16 object-cover"
        />
      </div>
      <div className="cell">{e.name}</div>
      <div className="cell">{e.email}</div>
      <div className="cell">{e.address}</div>
      <div className="cell">{e.phone}</div>
      <div className="cell">
        <StatusComboBox
          status={e.status}
          value = {e?.status}
          onChange={(newStatus) => {
            handleStatusChange(e.id, newStatus);
            /* Handle status change here */
          }}
        />
      </div>
      <div className="cell">{/* Chức năng */}</div>
      <div className="cell">
        <MdModeEdit className="w-8 h-8 inline-block" />
      </div>
      <div className="cell">
        <MdDelete className="w-8 h-8 inline-block" />
      </div>
    </React.Fragment>
  ))}
</div>
    </div>
  );
};

export default User;
