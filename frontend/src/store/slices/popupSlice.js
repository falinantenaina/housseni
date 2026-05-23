import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAuthPopupOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
    isProfileOpen: false,
  },
  reducers: {
    toggleAuthPopup: (state) => { state.isAuthPopupOpen = !state.isAuthPopupOpen; },
    openAuthPopup: (state) => { state.isAuthPopupOpen = true; },
    closeAuthPopup: (state) => { state.isAuthPopupOpen = false; },
    toggleSidebar: (state) => { state.isSidebarOpen = !state.isSidebarOpen; },
    closeSidebar: (state) => { state.isSidebarOpen = false; },
    toggleSearchBar: (state) => { state.isSearchBarOpen = !state.isSearchBarOpen; },
    closeSearchBar: (state) => { state.isSearchBarOpen = false; },
    toggleCart: (state) => { state.isCartOpen = !state.isCartOpen; },
    closeCart: (state) => { state.isCartOpen = false; },
    toggleAIModal: (state) => { state.isAIPopupOpen = !state.isAIPopupOpen; },
    closeAIModal: (state) => { state.isAIPopupOpen = false; },
    toggleProfile: (state) => { state.isProfileOpen = !state.isProfileOpen; },
    closeProfile: (state) => { state.isProfileOpen = false; },
  },
});

export const {
  toggleAuthPopup, openAuthPopup, closeAuthPopup,
  toggleSidebar, closeSidebar,
  toggleSearchBar, closeSearchBar,
  toggleCart, closeCart,
  toggleAIModal, closeAIModal,
  toggleProfile, closeProfile,
} = popupSlice.actions;

export default popupSlice.reducer;
