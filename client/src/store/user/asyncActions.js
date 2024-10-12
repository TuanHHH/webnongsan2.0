import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import * as apis from "@/apis";

//https://techmaster.vn/posts/36779/huong-dan-su-dung-createasyncthunk-trong-redux-toolkit
export const getCurrentUser = createAsyncThunk("user/current", async () => {
  const response = await apis.apiGetCurrentUser()
  // console.log(response);

  if (response.statusCode !== 200) {
    return isRejectedWithValue(response);
  }

  return response.data.user;
});
