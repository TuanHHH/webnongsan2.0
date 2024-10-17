import path from "./path";
import icons from "./icons";
import { AiOutlineInfo } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
export const navigation = [
  {
    id: 1,
    value: "Trang chủ",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "Sản phẩm",
    path: `/${path.PRODUCTS_BASE}`,
  },
  {
    id: 3,
    value: "Dành cho bạn",
    path: `/${path.FOR_YOU}`,
  }
];
const { FaTruck, GiReturnArrow, SiAdguard, FaPhone } = icons

export const productExtraInfo = [{
  id: 1,
  title: 'Sản phẩm sạch',
  sub: 'Cam kết không chất bảo quản',
  icon: <SiAdguard />
},
{
  id: 2,
  title: 'Vận chuyển siêu tốc',
  sub: 'Đảm bảo nhận hàng trong 1 giờ với bán kính < 10km',
  icon: <FaTruck />
},
{
  id: 3,
  title: 'Hoàn trả miễn phí',
  sub: 'Trả hàng miễn phí khi có vấn đề phát sinh',
  icon: < GiReturnArrow />
},
{
  id: 4,
  title: 'Hỗ trợ 24/7',
  sub: 'Hoạt động liên tục kể cả thứ 7, CN',
  icon: <FaPhone />
}
]

export const voteOption = [
  {
    id: 1,
    text: "Rất tệ"
  },
  {
    id: 2,
    text: "Tệ"
  },
  {
    id: 3,
    text: "Bình thường"
  },
  {
    id: 4,
    text: "Tốt"
  },
  {
    id: 5,
    text: "Rất tốt"
  }
]

export const sortProductOption = [
  { value: 'productName-asc', label: 'Tên A-Z' },
  { value: 'productName-desc', label: 'Tên Z-A' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'rating-asc', label: 'Rating thấp' },
  { value: 'rating-desc', label: 'Rating cao' },
  { value: 'sold-desc', label: 'Bán chạy' },
  { value: 'createdAt-desc', label: 'Mới nhất' }
];

export const memberSidebar = [
  {
    id: 4,
    type: 'SINGLE',
    text: 'Home',
    path: `/`,
    icon: <FaHome size={20} />
  },
  {
    id: 1,
    type: 'SINGLE',
    text: 'Personal',
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <AiOutlineInfo size={20} />
  },

  {
    id: 2,
    type: 'SINGLE',
    text: 'Buy Histories',
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <MdHistory size={20} />
  },
  {
    id: 3,
    type: 'SINGLE',
    text: 'Wishlist',
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <FaHeart size={20} />
  },

]

export const statusOrder = [  
  {
    label: "Default",
    value: "default"
  },
  {
    label: 'Pending',
    value: 0
  },
  {
    label: "Succeed",
    value: 1
  },
  {
    label: "Cancelled",
    value: 2
  }
]
export const statusHideOrder = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: 'Unhide',
    value: 0
  },
  {
    label: "Hide",
    value: 1
  }
]
export const sortFeedbackOrder = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: "Product",
    value: "product_name"
  },
  {
    label: "Rating Star",
    value: "ratingStar"
  },
  {
    label: "Updated Time",
    value: "updatedAt"
  }
]