import React,{ useState ,useEffect} from "react";
import { apiGetProduct } from "./../../apis";
import { apiGetProducts } from './../../apis';
import {EditProductForm, TurnBackHeader} from "./../../components/admin/index"
function EditProduct() {
    const [product, setProduct] = useState(null);
    const fetchProduct = async(pid)=>{
        const res = await apiGetProduct(pid);
        // console.log(res)
        setProduct(res.data)
        // const res = await apiGetProducts({id:pid,page:1,size:1})
        // setProduct(res.data)
    }
    const path = window.location.pathname;
    const pid = path.split('/').pop();
      useEffect(() => {
        const checkAuth = async () => {
            fetchProduct(pid);
        };
        checkAuth();
    }, [pid, ]);
    
    if (!product) {
      return <div>Loading...</div>;
    }
  return (
    <div className="w-full">
     <div>
     <TurnBackHeader turnBackPage="/admin/product" header="Quay về trang sản phẩm" />
     </div>
     <div>
     <EditProductForm initialProductData={product}/>  
     </div>
    </div>
  );
}

export default EditProduct;
