import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leadsService } from '../services/leadsService';
import type { Lead } from '../types/lead.model';

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leadsService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת לידים');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת לידים');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload || [];
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = leadsSlice.actions;
export default leadsSlice.reducer;
