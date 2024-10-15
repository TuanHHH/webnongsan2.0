import { apiGetOrderDetail, apiGetOrderInfor } from '@/apis'
import { TurnBackHeader } from '@/components/admin';
import React, { useEffect ,useState} from 'react'

function OrderDetail() {
  const [orderDetail, setOrderDetail] = useState(null)
  const [orderInfor, setOrderInfor] = useState(null)
  const fetchOrderDetail = async(oid)=>{
    const res = await apiGetOrderDetail(oid);
    const res2 = await apiGetOrderInfor(oid);
    setOrderDetail(res)
    setOrderInfor(res2)
  }
  const path = window.location.pathname;
  const oid = path.split('/').pop();
  console.log(oid)
  useEffect(()=>{
    fetchOrderDetail(oid);
  },[])
  console.log(orderDetail)
  console.log(orderInfor)

  return (
    
    <div>OrderDetail
      <TurnBackHeader turnBackPage="/admin/user" header="Quay về trang người dùng"/>

    </div>
  )
}

export default OrderDetail