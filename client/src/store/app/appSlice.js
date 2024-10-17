import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
    isShowModal: false,
    modalChildren: null,
    errorCode: null
  },
  // Code logic xử lý sync action
  reducers: {
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal
      state.modalChildren = action.payload.modalChildren
    },
    setErrorCode: (state, action) => {
      state.errorCode = action.payload.errorCode
      console.log(state.errorCode)
    }
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action (Promise pending)
    builder.addCase(actions.getCategories.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });

    // Khi thực hiện action thành công (Promise fulfilled)
    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      //console.log(action);
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false;
      state.categories = action.payload;
    });

    // Khi thực hiện action thất bại (Promise rejected)
    builder.addCase(actions.getCategories.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.errorMessage = action.error.message;
    });
  },
});

export const { showModal, setErrorCode } = appSlice.actions
//export reducer = reducer(s) = extrareducers
export default appSlice.reducer;
