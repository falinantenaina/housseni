import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchTopRated = createAsyncThunk(
  "product/fetchTopRated",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: { sort: "rating", limit: 10 },
      });
      return res.data.products;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const fetchNewProducts = createAsyncThunk(
  "product/fetchNew",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: { sort: "newest", limit: 10 },
      });
      return res.data.products;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const postReview = createAsyncThunk(
  "product/postReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/products/post-new/review/${id}`,
        data,
      );
      toast.success("Avis publié !");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchFeaturedProducts = createAsyncThunk(
  "product/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: { featured: "true", limit: 10 },
      });
      return res.data.products;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const fetchSimilarProducts = createAsyncThunk(
  "product/fetchSimilar",
  async (categoryId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: {
          category_id: categoryId,
          limit: 8,
        },
      });
      return res.data.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async ({ id, reviewId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/delete/review/${id}`);
      toast.success("Avis supprimé");
      return reviewId;
    } catch (err) {
      toast.error("Erreur lors de la suppression");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const aiSearch = createAsyncThunk(
  "product/aiSearch",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/products/ai-search", { query });
      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    similarProducts: [],
    featuredProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload || [];
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload || [];
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetails = action.payload;
        state.productReviews = action.payload?.reviews || [];
      })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.topRatedProducts = action.payload || [];
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.newProducts = action.payload || [];
      })
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        if (action.payload?.reviews)
          state.productReviews = action.payload.reviews;
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(
          (r) => r._id !== action.payload,
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })
      .addCase(aiSearch.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(aiSearch.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload || [];
      })
      .addCase(aiSearch.rejected, (state) => {
        state.aiSearching = false;
      });
  },
});

export default productSlice.reducer;
