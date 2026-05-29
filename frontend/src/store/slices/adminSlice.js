import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

// STATS
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/fetch/dashboard-stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// USERS
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/getallusers?page=${page}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteAdminUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/delete/${id}`);
      toast.success("Utilisateur supprimé");
      return id;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la suppression",
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/admin/update-role/${id}`, { role });
      toast.success(`Rôle mis à jour : ${role}`);
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur mise à jour du rôle");
      return rejectWithValue(err.response?.data);
    }
  },
);

// ORDERS
export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/order/admin/getall");
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/order/admin/update/${id}`, {
        status,
      });
      toast.success("Statut mis à jour");
      return res.data.updatedOrder;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur mise à jour");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const markOrderAsPaid = createAsyncThunk(
  "admin/markOrderAsPaid",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/order/admin/mark-paid/${id}`);
      toast.success("Commande marquée comme payée");
      return res.data.order;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteAdminOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/order/admin/delete/${id}`);
      toast.success("Commande supprimée");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur suppression");
      return rejectWithValue(err.response?.data);
    }
  },
);

//  LIVRAISON

/**
 * Récupère les tarifs de livraison actuels depuis le backend.
 */
export const fetchShippingRates = createAsyncThunk(
  "admin/fetchShippingRates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/shipping-rates");
      return res.data.shipping_rates;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/**
 * Met à jour les tarifs globaux de livraison.
 * payload : { ville?: number, sud?: number, nord?: number, petite_terre?: number }
 */
export const updateShippingRates = createAsyncThunk(
  "admin/updateShippingRates",
  async (rates, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/admin/shipping-rates", rates);
      toast.success("Tarifs de livraison mis à jour");
      return res.data.shipping_rates;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur mise à jour des tarifs",
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

/**
 * Change la zone de livraison d'une commande (recalcule shipping_price côté backend).
 * payload : { id: string, delivery_zone: string | null }
 */
export const updateOrderDeliveryZone = createAsyncThunk(
  "admin/updateOrderDeliveryZone",
  async ({ id, delivery_zone }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/admin/orders/${id}/delivery-zone`,
        { delivery_zone },
      );
      toast.success("Zone de livraison mise à jour");
      return res.data.order;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur mise à jour de la zone",
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

/**
 * Écrase manuellement le prix de livraison d'une commande.
 * payload : { id: string, shipping_price: number }
 */
export const updateOrderShippingPrice = createAsyncThunk(
  "admin/updateOrderShippingPrice",
  async ({ id, shipping_price }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/admin/orders/${id}/shipping-price`,
        { shipping_price },
      );
      toast.success("Prix de livraison mis à jour");
      return res.data.order;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur mise à jour du prix");
      return rejectWithValue(err.response?.data);
    }
  },
);

// PRODUCTS
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const createAdminProduct = createAsyncThunk(
  "admin/createProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/products/admin/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Produit créé !");
      return res.data.product;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur création");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateAdminProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/products/admin/update/${id}`, data);
      toast.success("Produit mis à jour !");
      return res.data.updatedProduct;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur mise à jour");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteAdminProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/admin/delete/${id}`);
      toast.success("Produit supprimé");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur suppression");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const toggleAdminFeatured = createAsyncThunk(
  "admin/toggleFeatured",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/products/admin/featured/${id}`);
      toast.success(res.data.message);
      return res.data.product;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur mise en avant");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const toggleAdminSale = createAsyncThunk(
  "admin/toggleSale",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/products/admin/sale/${id}`);
      toast.success(res.data.message);
      return res.data.product;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur promotion");
      return rejectWithValue(err.response?.data);
    }
  },
);

// CATEGORIES
export const fetchAdminCategories = createAsyncThunk(
  "admin/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/categories");
      return res.data.categories;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const createAdminCategory = createAsyncThunk(
  "admin/createCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/categories/admin/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success("Catégorie créée avec succès !");
      return res.data.category;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateAdminCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/categories/admin/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      toast.success("Catégorie mise à jour avec succès !");
      return res.data.category;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour",
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteAdminCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/categories/admin/delete/${id}`);
      toast.success("Catégorie supprimée");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur suppression");
      return rejectWithValue(err.response?.data);
    }
  },
);

//  Slice

// Tarifs par défaut affichés côté client avant chargement depuis le backend
export const DEFAULT_SHIPPING_RATES = {
  ville: 50,
  sud: 100,
  nord: 100,
  petite_terre: 250,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    users: [],
    totalUsers: 0,
    orders: [],
    products: [],
    totalProducts: 0,
    categories: [],
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    totalUsersCount: 0,
    monthlySales: [],
    orderStatusCounts: {},
    topSellingProducts: [],
    lowStockProducts: [],
    revenueGrowth: "",
    newUsersThisMonth: 0,
    currentMonthSales: 0,
    // Tarifs de livraison chargés depuis le backend
    shippingRates: { ...DEFAULT_SHIPPING_RATES },
    isCreateModalOpen: false,
    isUpdateModalOpen: false,
    isViewModalOpen: false,
    isCategoryModalOpen: false,
    isUpdateCategoryModalOpen: false,
    selectedProduct: null,
    selectedCategory: null,
    unreadCount: 0,
  },
  reducers: {
    toggleCreateModal: (state) => {
      state.isCreateModalOpen = !state.isCreateModalOpen;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    toggleUpdateModal: (state, action) => {
      state.isUpdateModalOpen = !state.isUpdateModalOpen;
      state.selectedProduct = action.payload ?? null;
    },
    toggleViewModal: (state, action) => {
      state.isViewModalOpen = !state.isViewModalOpen;
      state.selectedProduct = action.payload ?? null;
    },
    toggleCategoryModal: (state) => {
      state.isCategoryModalOpen = !state.isCategoryModalOpen;
    },
    closeCategoryModal: (state) => {
      state.isCategoryModalOpen = false;
    },
    toggleUpdateCategoryModal: (state, action) => {
      state.isUpdateCategoryModalOpen = !state.isUpdateCategoryModalOpen;
      state.selectedCategory = action.payload ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        const d = action.payload;
        state.totalRevenueAllTime = d.totalRevenueAllTime ?? 0;
        state.todayRevenue = d.todayRevenue ?? 0;
        state.yesterdayRevenue = d.yesterdayRevenue ?? 0;
        state.totalUsersCount = d.totalUsersCount ?? 0;
        state.monthlySales = d.monthlySales ?? [];
        state.orderStatusCounts = d.orderStatusCounts ?? {};
        state.topSellingProducts = d.topSellingProducts ?? [];
        state.lowStockProducts = d.lowStockProducts ?? [];
        state.revenueGrowth = d.revenueGrowth ?? "";
        state.newUsersThisMonth = d.newUsersThisMonth ?? 0;
        state.currentMonthSales = d.currentMonthSales ?? 0;
      })
      .addCase(fetchAdminStats.rejected, (state) => {
        state.loading = false;
      })
      // Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users ?? [];
        state.totalUsers = action.payload.totalUsers ?? 0;
      })
      .addCase(fetchAdminUsers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.totalUsers = Math.max(0, state.totalUsers - 1);
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1)
          state.users[idx] = { ...state.users[idx], ...action.payload };
      })
      .addCase(updateUserRole.rejected, (state) => {
        state.loading = false;
      })
      // Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload ?? [];
      })
      .addCase(fetchAdminOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1)
          state.orders[idx] = { ...state.orders[idx], ...action.payload };
      })
      .addCase(markOrderAsPaid.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1)
          state.orders[idx] = { ...state.orders[idx], ...action.payload };
      })
      .addCase(deleteAdminOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      })
      // Livraison — tarifs globaux
      .addCase(fetchShippingRates.fulfilled, (state, action) => {
        if (action.payload) state.shippingRates = action.payload;
      })
      .addCase(updateShippingRates.fulfilled, (state, action) => {
        if (action.payload) state.shippingRates = action.payload;
      })
      // Livraison — par commande
      .addCase(updateOrderDeliveryZone.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1)
          state.orders[idx] = { ...state.orders[idx], ...action.payload };
      })
      .addCase(updateOrderShippingPrice.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1)
          state.orders[idx] = { ...state.orders[idx], ...action.payload };
      })
      // Products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products ?? [];
        state.totalProducts = action.payload.totalProducts ?? 0;
      })
      .addCase(fetchAdminProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.products.unshift(action.payload);
        state.isCreateModalOpen = false;
      })
      .addCase(createAdminProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
        state.isUpdateModalOpen = false;
        state.selectedProduct = null;
      })
      .addCase(updateAdminProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteAdminProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(toggleAdminFeatured.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(toggleAdminSale.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      // Categories
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categories = action.payload ?? [];
      })
      .addCase(createAdminCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.categories.push(action.payload);
        state.isCategoryModalOpen = false;
      })
      .addCase(createAdminCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateAdminCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;
        const idx = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (idx !== -1) state.categories[idx] = action.payload;
        state.isUpdateCategoryModalOpen = false;
        state.selectedCategory = null;
      })
      .addCase(updateAdminCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteAdminCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      })
      .addCase(deleteAdminCategory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  toggleCreateModal,
  closeCreateModal,
  toggleUpdateModal,
  toggleViewModal,
  toggleCategoryModal,
  closeCategoryModal,
  toggleUpdateCategoryModal,
} = adminSlice.actions;

export default adminSlice.reducer;
