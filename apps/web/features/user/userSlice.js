import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const API = '/api/v1/users';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/profile`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch profile');
      // data.data is null when the user is not authenticated (guest) — treat as no profile
      return data.data ?? null;
    } catch {
      return rejectWithValue('Network error while fetching profile');
    }
  }
);


export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      // formData can be FormData (for avatar upload) or plain object
      const isFormData = formData instanceof FormData;
      const fetchOptions = {
        method: 'PATCH',
        credentials: 'include',
        body: isFormData ? formData : JSON.stringify(formData),
      };
      if (!isFormData) {
        fetchOptions.headers = { 'Content-Type': 'application/json' };
      }
      const res = await fetch(`${API}/profile`, fetchOptions);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to update profile');
      return data.data;
    } catch {
      return rejectWithValue('Network error while updating profile');
    }
  }
);

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/addresses`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to add address');
      return data.data; // returns full addresses array
    } catch {
      return rejectWithValue('Network error while adding address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ addressId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/addresses/${addressId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to update address');
      return data.data; // returns full addresses array
    } catch {
      return rejectWithValue('Network error while updating address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to delete address');
      return data.data; // returns full addresses array
    } catch {
      return rejectWithValue('Network error while deleting address');
    }
  }
);

export const requestAccountDeletion = createAsyncThunk(
  'user/requestAccountDeletion',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/request-delete`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to request deletion OTP');
      return data.data;
    } catch {
      return rejectWithValue('Network error while requesting deletion');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (otp, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/account`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to delete account');
      return data.data;
    } catch {
      return rejectWithValue('Network error while deleting account');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Swallow error — clear state regardless
    }
    return null;
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    updating: false,
    error: null,
    deleteRequested: false,
    deletionLoading: false,
    deletionError: null,
    isLogoutConfirmOpen: false,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.deleteRequested = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLogoutConfirmOpen: (state, action) => {
      state.isLogoutConfirmOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchProfile
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => { state.updating = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload;
        // Sync localStorage for Navbar
        try { localStorage.setItem('user', JSON.stringify(action.payload)); } catch {}
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // addAddress
    builder
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.profile) state.profile.addresses = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => { state.error = action.payload; });

    // updateAddress
    builder
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (state.profile) state.profile.addresses = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => { state.error = action.payload; });

    // deleteAddress
    builder
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.profile) state.profile.addresses = action.payload;
      })
      .addCase(deleteAddress.rejected, (state, action) => { state.error = action.payload; });

    // requestAccountDeletion
    builder
      .addCase(requestAccountDeletion.pending, (state) => { state.deletionLoading = true; state.deletionError = null; })
      .addCase(requestAccountDeletion.fulfilled, (state) => {
        state.deletionLoading = false;
        state.deleteRequested = true;
      })
      .addCase(requestAccountDeletion.rejected, (state, action) => {
        state.deletionLoading = false;
        state.deletionError = action.payload;
      });

    // deleteAccount
    builder
      .addCase(deleteAccount.pending, (state) => { state.deletionLoading = true; state.deletionError = null; })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.deletionLoading = false;
        state.profile = null;
        state.deleteRequested = false;
        try { localStorage.removeItem('user'); } catch {}
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deletionLoading = false;
        state.deletionError = action.payload;
      });

    // logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.profile = null;
      state.deleteRequested = false;
      try { localStorage.removeItem('user'); } catch {}
    });
  },
});

export const { setProfile, clearProfile, clearError, setLogoutConfirmOpen } = userSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserUpdating = (state) => state.user.updating;
export const selectUserError = (state) => state.user.error;
export const selectDeleteRequested = (state) => state.user.deleteRequested;
export const selectDeletionLoading = (state) => state.user.deletionLoading;
export const selectDeletionError = (state) => state.user.deletionError;
const EMPTY_ADDRESSES = [];
export const selectAddresses = createSelector(
  [selectUser],
  (profile) => profile?.addresses ?? EMPTY_ADDRESSES
);
export const selectIsLogoutConfirmOpen = (state) => state.user.isLogoutConfirmOpen;

export default userSlice.reducer;
