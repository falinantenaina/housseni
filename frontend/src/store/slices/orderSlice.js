import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";
import { clearCart } from "./cartSlice";

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data.myOrders;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      // orderData contient delivery_zone (string | null) transmis depuis Payment.jsx
      const res = await axiosInstance.post("/order/new", orderData);
      toast.success("Commande confirmée avec succès !");
      dispatch(clearCart());
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la commande");
      return rejectWithValue(err.response?.data);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    orderSuccess: false,
    // Données de la dernière commande passée (pour affichage post-confirmation)
    lastOrder: null,
  },
  reducers: {
    resetOrderSuccess: (state) => {
      state.orderSuccess = false;
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload || [];
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.fetchingOrders = false;
      })
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.orderSuccess = false;
        state.lastOrder = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        if (action.payload?.success) {
          state.orderSuccess = true;
          // Conserve les infos retournées (total, shipping_price, delivery_zone, orderId)
          state.lastOrder = {
            orderId: action.payload.orderId,
            total_price: action.payload.total_price,
            shipping_price: action.payload.shipping_price,
            delivery_zone: action.payload.delivery_zone,
          };
        }
      })
      .addCase(placeOrder.rejected, (state) => {
        state.placingOrder = false;
        state.orderSuccess = false;
      });
  },
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
