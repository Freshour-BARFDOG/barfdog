import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  surveyDog: [],
};

const surveyDogSlice = createSlice({
  name: 'surveyDogList',
  initialState,
  reducers: {
    saveSurveyDog(state, action) {
      state.surveyDog = action.payload.surveyDog;
    },
  },
});

export default surveyDogSlice;
export const surveyDogAction = surveyDogSlice.actions;
