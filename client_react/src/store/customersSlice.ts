import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customersService from '../services/customersService';
import type { Customer } from '../types/customer.model';

interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customersService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת לקוחות');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת לקוחות');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload || [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = customersSlice.actions;
export default customersSlice.reducer;
