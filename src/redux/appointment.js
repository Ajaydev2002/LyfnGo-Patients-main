// slices/appointmentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAppointments = createAsyncThunk(
    "appointments/fetchAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("https://flash.lyf.yoga/files/ms-calendar-appointment/appointment/appointmentDetails?tentId=jzxph5ql&custId=rkpcdske&period=upcoming",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                    },
                });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const appointmentsSlice = createSlice({
    name: "appointments",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default appointmentsSlice.reducer;
