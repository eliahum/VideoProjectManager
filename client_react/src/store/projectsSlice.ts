import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectsService from '../services/projectsService';
import type { Project } from '../types/project.model';

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsService.getAll();
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת פרויקטים');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת פרויקטים');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await projectsService.getById(id);
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בטעינת פרויקט');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בטעינת פרויקט');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (project: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await projectsService.create(project);
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה ביצירת פרויקט');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה ביצירת פרויקט');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, project }: { id: string; project: Partial<Project> }, { rejectWithValue }) => {
    try {
      const response = await projectsService.update(id, project);
      if (!response.isSuccess) {
        return rejectWithValue(response.errorText || 'שגיאה בעדכון פרויקט');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה בעדכון פרויקט');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectsService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errorText || 'שגיאה במחיקת פרויקט');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload || null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createProject.fulfilled, (state, action) => {
        if (action.payload) {
          state.projects.push(action.payload);
        }
      })
      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.projects.findIndex(p => p.id === action.payload!.id);
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
          if (state.selectedProject?.id === action.payload.id) {
            state.selectedProject = action.payload;
          }
        }
      })
      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearSelectedProject, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
