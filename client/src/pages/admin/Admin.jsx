import React,{useEffect,useState} from "react";
import { TopHeader } from "../../components";
import { Link } from "react-router-dom";
import { Route, Routes} from "react-router-dom";
import path from "../../utils/path";
import { Navigate } from 'react-router-dom'
// import { LeftNavBar, Overview } from "../../components/admin";
// import { Category,FeedBack,Order,Product,User} from "../../components/admin";
// import {OrderDetail} from "../../components/admin";
// import {EditProduct} from "../../components/admin";
// import {EditCategory} from "../../components/admin";
import {Category,FeedBack,Order,Product,User} from "./";
import {Overview} from './';
import {OrderDetail} from "./";
import {EditProduct,EditCategory} from "./";
import { useSelector } from "react-redux";
import { useRef } from 'react';
// import {EditCategory} from ".";
import {AdminLayout} from "../../components/admin";
const Admin= () =>{
    const { isLoggedIn, current } = useSelector(state => state.user);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [toLogin, setToLogin] = useState(false)
    const isMounted = useRef(false); // Dùng để theo dõi xem component có đang mounted không
    const lastMount = async () => {
        try {
          if (isMounted.current) {
            // console.log(current.role.roleName.toLowerCase() !=='admin')
            // console.log(current)
            if(!current || !isLoggedIn){
                setToLogin(true);
            }
            if(current.role.roleName.toLowerCase() !=='admin'){
                setShouldNavigate(true);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      useEffect(() => {
        isMounted.current = true; // Đánh dấu rằng component đã mounted
        lastMount();
    
        return () => {
          isMounted.current = false; // Đánh dấu rằng component đã unmounted
        };
      }, [isMounted]); // Chạy một lần khi component mount
      if (toLogin) {
        return <Navigate to={`/login`} replace={true} />;
    }
      if (shouldNavigate) {
        return <Navigate to={`/`} replace={true} />;
    }

    return(
        <div className="min-h-screen font-main">
            <Routes>
                <Route path="/" element= {<AdminLayout/>}>
                    <Route path={path.ADMIN_OVERVIEW} element={<Overview/>}></Route>
                    <Route path={path.ADMIN_PRODUCT} element={<Product/>}></Route>
                    <Route path={path.ADMIN_EDIT_PRODUCT} element={<EditProduct/>}></Route>

                    <Route path={path.ADMIN_CATEGORY} element={<Category/>}></Route>
                    <Route path={path.ADMIN_EDIT_CATEGORY} element={<EditCategory/>}></Route>

                    {/* <Route path={path.ADMIN_FEEDBACK_DETAIL} element={<FeedBackDetail/>}></Route> */}
                    
                    <Route path={path.ADMIN_ORDER} element={<Order/>}></Route>
                    <Route path={path.ADMIN_ORDER_DETAIL} element={<OrderDetail/>}></Route>

                    <Route path={path.ADMIN_USER} element={<User/>}></Route>
                    {/* <Route path={path.ADMIN_USER_DETAIL} element={<UserDetail/>}></Route> */}
                    
                </Route>
            </Routes>
        </div>
    )
};

export default Admin;
