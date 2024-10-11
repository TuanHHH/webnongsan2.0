const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  PRODUCTS: "products/:category",
  PRODUCTS_BASE: 'products',
  FOR_YOU: "foryou",
  PRODUCT_DETAIL: ":category/:pid/:productname",
  RESET_PASSWORD: "reset-password",
  CART: "cart",

  // Member path
  MEMBER: "member",
  PERSONAL:"personal",
  MY_CART: "my-cart",
  HISTORY: "buy-history",
  WISHLIST: "wishlist",

  //Admin path
  ADMIN: "admin",
  DASHBOARD: "dashboard"
};

export default path;