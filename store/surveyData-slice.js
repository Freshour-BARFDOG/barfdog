import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  surveyData: '',
};

const surveyDataSlice = createSlice({
  name: 'surveyData',
  initialState,
  reducers: {
    saveSurveyData(state, action) {
      state.surveyData = action.payload.surveyData;
    },
  },
});

export default surveyDataSlice;
export const surveyDataAction = surveyDataSlice.actions;
