import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionService } from '../../services/transactions';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionService.getAllTransactions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const purchaseFund = createAsyncThunk(
  'transactions/purchase',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await transactionService.purchaseFund(purchaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    sips: [],
    summary: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {
      type: '',
      status: '',
      startDate: '',
      endDate: '',
    },
  },
  reducers: {
    setTransactionFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTransactionFilters: (state) => {
      state.filters = {
        type: '',
        status: '',
        startDate: '',
        endDate: '',
      };
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    updateTransactionStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        state.transactions[index].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(purchaseFund.pending, (state) => {
        state.loading = true;
      })
      .addCase(purchaseFund.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(purchaseFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setTransactionFilters,
  clearTransactionFilters,
  addTransaction,
  updateTransactionStatus,
} = transactionSlice.actions;
export default transactionSlice.reducer;