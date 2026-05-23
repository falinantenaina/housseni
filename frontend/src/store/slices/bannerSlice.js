import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

export const fetchActiveBanner = createAsyncThunk(
  "banner/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/banners/active");
      return res.data.banners;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchAdminBanners = createAsyncThunk(
  "banner/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/banners/admin/all");
      return res.data.banners;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const createAdminBanner = createAsyncThunk(
  "banner/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/banners/admin/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Bannière créée !");
      return res.data.banner;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const toggleAdminBanner = createAsyncThunk(
  "banner/toggle",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/banners/admin/toggle/${id}`);
      toast.success(res.data.message);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteAdminBanner = createAsyncThunk(
  "banner/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/banners/admin/delete/${id}`);
      toast.success("Bannière supprimée");
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: { activeBanners: [], banners: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveBanner.fulfilled, (s, a) => {
        s.activeBanners = a.payload ?? [];
      })

      .addCase(fetchAdminBanners.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAdminBanners.fulfilled, (s, a) => {
        s.loading = false;
        s.banners = a.payload;
      })
      .addCase(fetchAdminBanners.rejected, (s) => {
        s.loading = false;
      })

      .addCase(createAdminBanner.fulfilled, (s, a) => {
        s.banners.unshift(a.payload);
      })

      // Chaque bannière est indépendante — on bascule uniquement celle ciblée
      .addCase(toggleAdminBanner.fulfilled, (s, a) => {
        s.banners = s.banners.map((b) =>
          b.id === a.payload ? { ...b, is_active: b.is_active ? 0 : 1 } : b,
        );
      })

      .addCase(deleteAdminBanner.fulfilled, (s, a) => {
        s.banners = s.banners.filter((b) => b.id !== a.payload);
      });
  },
});

export default bannerSlice.reducer;
