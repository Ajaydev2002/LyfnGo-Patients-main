import { configureStore } from "@reduxjs/toolkit";
import { patientsReducer } from "./PatientsSlice";

const store = configureStore({
    reducer: {
        patients: patientsReducer,
    },
});

export default store;

