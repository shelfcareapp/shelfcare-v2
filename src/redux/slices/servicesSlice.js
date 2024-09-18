import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItems: [],
  selectedServices: {},
  orderCount: 0,
  additionalNotes: '',
  uploadedFiles: []
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    toggleService: (state, action) => {
      const { item, service } = action.payload;
      const currentServices = state.selectedServices[item] || [];
      if (currentServices.includes(service)) {
        state.selectedServices[item] = currentServices.filter(
          (s) => s !== service
        );
      } else {
        state.selectedServices[item] = [...currentServices, service];
      }
      state.orderCount = Object.values(state.selectedServices).reduce(
        (total, services) => total + services.length,
        0
      );
    },
    setSelectedServices: (state, action) => {
      state.selectedServices = action.payload;
      state.orderCount = Object.values(state.selectedServices).reduce(
        (total, services) => total + services.length,
        0
      );
    },
    setAdditionalNotes: (state, action) => {
      state.additionalNotes = action.payload;
    },
    addUploadedFiles: (state, action) => {
      state.uploadedFiles = [...state.uploadedFiles, ...action.payload];
    },
    removeUploadedFile: (state, action) => {
      state.uploadedFiles = state.uploadedFiles.filter(
        (file) => file.name !== action.payload
      );
    }
  }
});

export const {
  setSelectedItems,
  toggleService,
  setSelectedServices,
  setAdditionalNotes,
  addUploadedFiles,
  removeUploadedFile
} = serviceSlice.actions;
export default serviceSlice.reducer;
