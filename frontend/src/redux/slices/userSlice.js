import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitKYC = createAsyncThunk(
  'user/submitKYC',
  async (kycData, { rejectWithValue }) => {
    try {
      const response = await authService.submitKYC(kycData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    kycStatus: 'PENDING',
    documents: [],
    bankAccounts: [],
    preferences: {
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      riskUpdates: true,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addBankAccount: (state, action) => {
      state.bankAccounts.push(action.payload);
    },
    removeBankAccount: (state, action) => {
      state.bankAccounts = state.bankAccounts.filter(
        account => account.id !== action.payload
      );
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitKYC.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.kycStatus = action.payload.status;
        state.documents = action.payload.documents;
      })
      .addCase(submitKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setProfile,
  updatePreferences,
  addBankAccount,
  removeBankAccount,
  clearUserError,
} = userSlice.actions;
export default userSlice.reducer;