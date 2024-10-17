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
  CHECKOUT: "checkout",

  // Member path
  MEMBER: "member",
  PERSONAL:"personal",
  HISTORY: "buy-history",
  WISHLIST: "wishlist",

  //Admin path
  ADMIN: "admin",
  DASHBOARD: "dashboard",
  FEEDBACK: "feedback"
};

export default path;