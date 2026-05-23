import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";
import bannerReducer from "./slices/bannerSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import popupReducer from "./slices/popupSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    admin: adminReducer,
    banner: bannerReducer,
  },
});
