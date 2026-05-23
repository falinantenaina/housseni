import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.user;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Compte créé avec succès !");
      return res.data.user;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'inscription",
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Connexion réussie !");
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Identifiants invalides");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosInstance.get("/auth/logout");
    localStorage.removeItem("token");
    toast.success("Déconnecté avec succès");
  } catch {
    return;
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", data);
      toast.success("Profil mis à jour !");
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de mise à jour");
      return rejectWithValue(err.response?.data);
    }
  },
);

/**
 * Sauvegarde les informations de livraison du client connecté.
 * Met à jour authUser dans le store pour que le formulaire Payment
 * reflète immédiatement les nouvelles données sauvegardées.
 *
 * payload : { phone?, address?, city?, state?, country?, pincode? }
 */
export const saveShippingInfo = createAsyncThunk(
  "auth/saveShippingInfo",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/shipping-info", data);
      toast.success("Adresse de livraison sauvegardée !");
      return res.data.user; // authController retourne l'utilisateur complet
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la sauvegarde",
      );
      return rejectWithValue(err.response?.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isSavingShippingInfo: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })
      // signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      })
      // login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })
      // saveShippingInfo — met à jour authUser pour que hasUnsavedChanges repasse à false
      .addCase(saveShippingInfo.pending, (state) => {
        state.isSavingShippingInfo = true;
      })
      .addCase(saveShippingInfo.fulfilled, (state, action) => {
        state.isSavingShippingInfo = false;
        if (action.payload) {
          state.authUser = action.payload;
        }
      })
      .addCase(saveShippingInfo.rejected, (state) => {
        state.isSavingShippingInfo = false;
      });
  },
});

export default authSlice.reducer;
