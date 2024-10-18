import React from 'react'
import { Link } from 'react-router-dom';
import path from "@/utils/path";
import logo from "@/assets/logo.png";
const AdminHeader = () => {
    return (
        <div className="flex justify-between w-main h-[110px] py-[35px] border border-red-500">
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className="w-[120px] object-contain" />
            </Link>
            <div className="mr-[40%] mt-[20px] h-[32px] flex border border-red-500">
                Chào mừng bạn đến với
            </div>
        </div>
    );
};
export default AdminHeader