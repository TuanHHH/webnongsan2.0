const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  PRODUCTS: "products/:category",
  PRODUCTS_BASE: 'products',
  FOR_YOU: "foryou",

  PRODUCT_DETAIL: "/products/:category/:pid/:productname",
  RESET_PASSWORD: "reset-password",
  CART: "cart",

  // Member path
  MEMBER: "member",
  PERSONAL: "personal",
  HISTORY: "buy-history",
  WISHLIST: "wishlist",

  //Admin path
  ADMIN: "admin",
  DASHBOARD: "dashboard",
  
  ADMIN_LAYOUT: "/admin/*",
  ADMIN_OVERVIEW: "overview",
  ADMIN_PRODUCT: "product",
  // ADMIN_FEEDBACK:"product/edit/:productId",
  ADMIN_CATEGORY: "category",
  ADMIN_USER: "user",
  ADMIN_ORDER: "order",

  ADMIN_USER_DETAIL: "",
  ADMIN_EDIT_PRODUCT: "product/edit/:productId",
  ADMIN_EDIT_USER: "",
  ADMIN_EDIT_CATEGORY: "category/edit/:categoryId",

  ADMIN_ORDER_DETAIL: "order/:orderId",

  ADMIN_FEEDBACK: "feedback",
  ADMIN_FEEDBACK_DETAIL: "",

  // ADMIN_
};

export default path;