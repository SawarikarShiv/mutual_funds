import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fundService } from '../../services/funds';

export const fetchFunds = createAsyncThunk(
  'funds/fetchFunds',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fundService.getAllFunds(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFundDetails = createAsyncThunk(
  'funds/fetchFundDetails',
  async (fundId, { rejectWithValue }) => {
    try {
      const response = await fundService.getFundById(fundId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const fundSlice = createSlice({
  name: 'funds',
  initialState: {
    funds: [],
    fundDetails: null,
    watchlist: [],
    categories: [],
    loading: false,
    error: null,
    filters: {
      category: '',
      risk: '',
      minReturn: '',
      maxReturn: '',
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        risk: '',
        minReturn: '',
        maxReturn: '',
      };
    },
    addToWatchlist: (state, action) => {
      if (!state.watchlist.find(item => item.id === action.payload.id)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(
        item => item.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFundDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFundDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.fundDetails = action.payload;
      })
      .addCase(fetchFundDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, addToWatchlist, removeFromWatchlist } =
  fundSlice.actions;
export default fundSlice.reducer;