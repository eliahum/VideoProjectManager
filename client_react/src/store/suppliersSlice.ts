import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import suppliersService from '../services/suppliersService';
import type { Supplier } from '../types/supplier.model';

interface SuppliersState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
}

const initialState: SuppliersState = {
  suppliers: [],
  selectedSupplier: null,
  loading: false,
  error: null,
};

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await suppliersService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת ספקים');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת ספקים');
    }
  }
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload || [];
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = suppliersSlice.actions;
export default suppliersSlice.reducer;
