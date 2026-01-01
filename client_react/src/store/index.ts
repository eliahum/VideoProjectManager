import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectsReducer from './projectsSlice';
import customersReducer from './customersSlice';
import leadsReducer from './leadsSlice';
import suppliersReducer from './suppliersSlice';
import statusesReducer from './statusesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    customers: customersReducer,
    leads: leadsReducer,
    suppliers: suppliersReducer,
    statuses: statusesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
