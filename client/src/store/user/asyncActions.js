import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import * as apis from "@/apis";
//https://techmaster.vn/posts/36779/huong-dan-su-dung-createasyncthunk-trong-redux-toolkit
export const getCurrentUser = createAsyncThunk("user/current", async () => {
  const response = await apis.apiGetCurrentUser()
  //console.log(response);
  if (response.statusCode === 403) {
    // Thực hiện logout nếu mã lỗi là 403
    window.localStorage.removeItem('persist:ogani_shop/user'); // Xóa thông tin người dùng
    return isRejectedWithValue(new Error("User is not authorized"));
  }
  if (response.statusCode !== 200) {
    return isRejectedWithValue(response);
  }

  // format tạm thời
  if (response.data && response.data.user && response.data.cartLength) { 
    response.data.user.cartLength = response.data.cartLength;
    delete response.data.cartLength;
  }

  return response.data.user;
});
