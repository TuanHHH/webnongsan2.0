import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { apiGetAllUser} from "./../../apis";
import { useSelector} from "react-redux";
import { MdDelete, MdModeEdit } from "react-icons/md";
import ToggleOption from "@/components/admin/ToogleOption";
import { apiSetStatusUser } from "./../../apis";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toast
import avatarDefault from "./../../assets/avatarDefault.png";
import { Pagination } from "@/components";
import { useNavigate, useSearchParams, createSearchParams } from "react-router-dom";

const User = () => {
  const {current} = useSelector(state => state.user);
  const [users, setUsers] = useState(null);
  const [showChangeStatusMessage, setShowChangeStatusMessage] = useState(false);
  const [showStopChangeStatusMessage, setShowStopChangeStatusMessage] = useState(false)
  const [newStatus, setNewStatus] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [selectUser, setSelectUser] = useState(null)

  const [params] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(params.get('page')) || 1);
  const USER_PER_PAGE = 8
  const navigate = useNavigate()
  const handleSetStatusUser = async (user) =>{
    const userToUpdate ={
      id: user?.id,
      name: user?.name,
      email:user?.email,
      status: (user?.status=== 1) ? 0 : 1,
      phone:user?.phone,
      address:user?.address,
      avatarUrl:user?.avatarUrl || "",
    }
    try{
      const res = await apiSetStatusUser(userToUpdate);
      toast.success("Cập nhập trạng thái thành công")
    }catch(err){
      toast.error("Có lỗi xảy ra: "+err.message)
    }
  }
  const handlePagination = (page = 1) => {

    navigate({ search: createSearchParams({ page }).toString() });
    fetchUsers({page: page, size: USER_PER_PAGE});
    setCurrentPage(page);
  
  };
  const handleChangeStatus = (userId,currentStatus)=>{

    if(current.id===userId){
      setShowStopChangeStatusMessage(true);
    }else{
      // const newStatus = currentStatus === '1' ? '0' : '1'; // Tính toán trạng thái mới
      setSelectedUserId(userId);
      
      setSelectedStatus(currentStatus);
      setShowChangeStatusMessage(true);

    }
  }
  const handleCloseChangeStatus = ()=>{
    setShowChangeStatusMessage(false);
    setSelectedUserId(null); // Reset ID
    setSelectedStatus(null);
    setSelectUser(null)
  }

  const handleCloseStopChangeStatus=()=>{
    setShowStopChangeStatusMessage(false);
  }

  const handleConfirmChangeStatus = () =>{
    if (selectedUserId !== null) {
      console.log(selectedUserId)
      console.log(selectedStatus)

    setUsers((prevUsers) => {
      // Kiểm tra xem prevUsers có tồn tại và có cấu trúc đúng không
      if (!prevUsers || !prevUsers.data || !Array.isArray(prevUsers.data.result)) {
          console.error("Invalid users data structure", prevUsers);
          return prevUsers; // Trả về prevUsers nếu không hợp lệ
      }
  
      // Cập nhật trạng thái người dùng
      return {
          ...prevUsers, // Giữ lại các thuộc tính khác của prevUsers
          data: {
              ...prevUsers.data, // Giữ lại các thuộc tính khác của data
              result: prevUsers.data.result.map(user =>
                  user.id === selectedUserId ? { ...user, status: (user.status === 1) ? 0 : 1 } : user
              )
          }
      };
  });
    // let newStatus = (selectedStatus=== 1) ? 0 : 1;
    handleSetStatusUser(selectUser);
    handleCloseChangeStatus(); // Đóng thông báo
    setSelectUser(null);
    setSelectedStatus(null);
  }
  }
  
  const fetchUsers = async (queries) => {
    const res = await apiGetAllUser(queries);
    setUsers(res);
  };

  // const handleStatusChange = (id, newStatus) => {
  //   setUsers((prevUsers) => 
  //     prevUsers.map(user => 
  //       user.id === id ? { ...user, status: newStatus } : user
  //     )
  //   );
  // };
  
  useEffect(() => {
    const queries = {
      page: currentPage,
      size: USER_PER_PAGE,
    };
    fetchUsers(queries);
  }, []);
  // console.log(users);

  return (
    <div>
      <style>
        {`
            .table-grid {
              display: grid;
              grid-template-columns: 1fr 2fr 3fr 3fr 7fr 2fr 2fr; /* Tạo layout với kích thước mong muốn */
              // grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; /* Tạo layout với kích thước mong muốn */
              // grid-template-columns: 0.4fr 1.5fr 2fr 1fr 0.9fr 1fr 1fr;
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
  {/* <div className="cell bg-gray-200">Chức năng</div> */}
  {/* <div className="cell bg-gray-200">Sửa</div>
  <div className="cell bg-gray-200">Xóa</div> */}

  {/* Rows */}
  {users?.data?.result?.map((e) => (
    <React.Fragment key={e.id}>
      <div className="cell">{e.id}</div>
      <div className="cell">
      <div className="flex justify-center items-center">
        <img
          src={e.avatarUrl || avatarDefault}
          alt={e.name}
          className="w-20 h-20 object-cover"
        />
      </div>
      </div>
      <div className="cell">{e.name}</div>
      <div className="cell">{e.email}</div>
      <div className="cell">{e.address}</div>
      <div className="cell">{e.phone}</div>
      <div className="cell">
      <div onClick={() => {
    handleChangeStatus(e.id, e.status);
    setSelectUser(e);
}}>
  <ToggleOption initialStatus={e.status}/>
  {/* <ToggleOption initialStatus={e.status} onChange={handleStatusChange} onClick={showChangeStatusMessage}/> */}
</div>

      </div>
      {/* <div className="cell">Chức năng</div> */}
      {/* <div className="cell">
        <MdModeEdit className="w-8 h-8 inline-block" />
      </div>
      <div className="cell">
        <MdDelete className="w-8 h-8 inline-block" />
      </div> */}
    </React.Fragment>
  ))}
</div>
{showChangeStatusMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-5 rounded shadow-lg mx-40"style={{ maxHeight: '80vh', overflowY: 'auto'}}>
                        <h2 className="text-lg font-bold text-center">Xác nhận thay đổi trạng thái cho người sử dụng</h2>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleConfirmChangeStatus} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                                Xác nhận
                            </button>
                            <button onClick={handleCloseChangeStatus} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showStopChangeStatusMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-5 rounded shadow-lg mx-40"style={{ maxHeight: '80vh', overflowY: 'auto'}}>
                        <h2 className="text-lg font-bold text-center">Bạn không thể thay đổi trạng thái của chính bạn</h2>
                        <div className="flex justify-center mt-4">
                            <button onClick={handleCloseStopChangeStatus} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div>
            <Pagination
                    totalPage={users?.data?.meta?.pages}
                    currentPage={currentPage}
                    totalProduct={users?.data?.meta?.total}
                    pageSize={users?.meta?.pageSize}
                    onPageChange={handlePagination}
                />
            </div>
    </div>
  );
};

export default User;
