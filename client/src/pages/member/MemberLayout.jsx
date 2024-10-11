import React from "react";
import { useSelector } from "react-redux";
import path from "../../utils/path";
import { Navigate, Outlet} from "react-router-dom";
import MemberSidebar from "../../components/sidebar/MemberSidebar";

const MemberLayout = ()=>{
    const {isLoggedIn, current} = useSelector(state => state.user)
    if(!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true}/>
    return (
        <div className="w-full flex bg-gray-100 min-h-screen relative ">
            <div className="w-[250px] flex-none top-0 bottom-0 fixed">
                <MemberSidebar/>
            </div>
            <div className="w-[250px]"></div>
            <div className="flex-auto bg-gray-100 min-h-screen ">
                <Outlet/>
            </div>
        </div>
    )
}

export default MemberLayout