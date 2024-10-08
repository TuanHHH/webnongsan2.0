import React, {useEffect} from 'react'
import path from './utils/path'
import { Route, Routes, useLocation} from "react-router-dom";
import { Login, Home, Public, ProductDetail, ForYou, Product, ResetPassword} from "./pages/guest";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "./store/app/asyncActions";
import { Bounce, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from './components';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {isShowModal, modalChildren} = useSelector(state => state.app)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen font-main relative">
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes> 
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route path={path.PRODUCTS} element={<Product />}></Route>
          <Route path={path.FOR_YOU} element={<ForYou/>}></Route>
          <Route path={path.PRODUCT_DETAIL} element={<ProductDetail />}></Route>
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />}></Route>
        </Route>
        <Route path={path.LOGIN} element={<Login />}></Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}/>
    </div>
  );
}

export default App
