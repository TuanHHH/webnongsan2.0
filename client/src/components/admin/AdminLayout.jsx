import React from 'react'
import { Outlet} from 'react-router-dom'
import { TopHeader } from "../../components";
import { LeftNavBar} from "../../components/admin";
import { AdminHeader } from "../../components/admin";
const AdminLayout = () => {
    return (
        <div>
            <div className="min-h-screen font-main">
                <TopHeader />
                <AdminHeader />
                    <div className="w-main h-[48px] py-2 border-y flex items-center text-sm"></div>
                    <div className="flex w-full">
                        <LeftNavBar />
                            <Outlet />
                    </div>
                </div>
        </div>
    );
};

export default AdminLayout