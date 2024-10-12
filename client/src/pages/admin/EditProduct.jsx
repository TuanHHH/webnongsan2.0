import React,{ useState ,useEffect} from "react";
import { apiGetProduct } from "./../../apis";
import {EditProductForm, TurnBackHeader} from "./../../components/admin/index"
function EditProduct() {
    const [product, setProduct] = useState(null);
    const fetchProduct = async(pid)=>{
        const res = await apiGetProduct(pid);
        setProduct(res.data)
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
