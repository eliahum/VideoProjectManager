import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectStatusService, milestoneStatusService } from '../services/statusesService';
import { leadStatusService } from '../services/leadsService';
import type { ProjectStatus, MilestoneStatus } from '../types/project.model';
import type { LeadStatus } from '../types/lead.model';

interface StatusesState {
  projectStatuses: ProjectStatus[];
  milestoneStatuses: MilestoneStatus[];
  leadStatuses: LeadStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: StatusesState = {
  projectStatuses: [],
  milestoneStatuses: [],
  leadStatuses: [],
  loading: false,
  error: null,
};

export const fetchProjectStatuses = createAsyncThunk(
  'statuses/fetchProjectStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectStatusService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת סטטוסי פרויקט');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת סטטוסי פרויקט');
    }
  }
);

export const fetchMilestoneStatuses = createAsyncThunk(
  'statuses/fetchMilestoneStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await milestoneStatusService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת סטטוסי milestone');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת סטטוסי milestone');
    }
  }
);

export const fetchLeadStatuses = createAsyncThunk(
  'statuses/fetchLeadStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leadStatusService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת סטטוסי ליד');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת סטטוסי ליד');
    }
  }
);

const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Project Statuses
      .addCase(fetchProjectStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.projectStatuses = action.payload || [];
      })
      .addCase(fetchProjectStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Milestone Statuses
      .addCase(fetchMilestoneStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestoneStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.milestoneStatuses = action.payload || [];
      })
      .addCase(fetchMilestoneStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Lead Statuses
      .addCase(fetchLeadStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.leadStatuses = action.payload || [];
      })
      .addCase(fetchLeadStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = statusesSlice.actions;
export default statusesSlice.reducer;
