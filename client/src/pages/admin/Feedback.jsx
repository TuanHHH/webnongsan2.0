import React from "react";
const Feedback = ()=>{
    return(
        // <div className="flex-1 bg-gray-100 p-4">
        //     <h1 className="text-2xl font-bold">Nội dung chính</h1>
        //     <p>Feedback</p>
        // </div>
        <div className="w-full">
            <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b"></h1>
            <span>User</span>
            <div className="w-full py-4">
                <table className="table-auto mb-6 text-left">
                    <thead className="font-bold bg-gray-700 text-[13px] border border-blue-300 text-center">
                        <tr>
                            <th className="px-4 py-2">Id</th>
                            <th className="px-4 py-2">Mô tả</th>
                            <th className="px-4 py-2">Số sao</th>
                            <th className="px-4 py-2">Trạng thái</th>
                            <th className="px-4 py-2">Id Sản phẩm</th>
                            <th className="px-4 py-2">Email</th>
                        </tr>
                    </thead>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4">
                        <span className="px-2 text-orange-600 hover:underline cursor-pointer">
                            Sửa
                        </span>
                        <span className="px-2 text-orange-600 hover:underline cursor-pointer">
                            Xóa
                        </span>
                    </td>
                </table>
            </div>
        </div>
    )
};
export default Feedback;