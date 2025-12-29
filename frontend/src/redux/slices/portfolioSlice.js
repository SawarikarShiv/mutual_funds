import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { portfolioService } from '../../services/portfolio';

export const fetchPortfolioSummary = createAsyncThunk(
  'portfolio/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getPortfolioSummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchHoldings = createAsyncThunk(
  'portfolio/fetchHoldings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await portfolioService.getHoldings(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    summary: null,
    holdings: [],
    performance: null,
    riskAnalysis: null,
    assetAllocation: [],
    loading: false,
    error: null,
    metrics: {
      totalValue: 0,
      totalGain: 0,
      totalGainPercentage: 0,
      dayGain: 0,
      dayGainPercentage: 0,
    },
  },
  reducers: {
    updateHolding: (state, action) => {
      const index = state.holdings.findIndex(
        h => h.id === action.payload.id
      );
      if (index !== -1) {
        state.holdings[index] = action.payload;
      }
    },
    removeHolding: (state, action) => {
      state.holdings = state.holdings.filter(
        h => h.id !== action.payload
      );
    },
    updateMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPortfolioSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchPortfolioSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHoldings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHoldings.fulfilled, (state, action) => {
        state.loading = false;
        state.holdings = action.payload.data;
      })
      .addCase(fetchHoldings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateHolding, removeHolding, updateMetrics } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;