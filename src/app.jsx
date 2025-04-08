import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Patientss from "./components/Patientss";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import PatientsDeatails from "./components/PatientsDeatils";
import { Provider } from "react-redux";
import store from "./redux/store";
import ViewHistory from "./components/ViewHistory";


const Applayout = () => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Box className="app">
                    <DashboardLayout />
                    <Outlet />
                </Box>
            </ThemeProvider>
        </Provider>
    )
};

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Applayout />,
        children: [
            {
                path: "/",
                element: <Patientss />
            },
            {
                path: "/patientss",
                element: <Patientss />
            },
            {
                path: "/patientsDetails/:custUuid",
                element: <PatientsDeatails />
            },
            {
                path: "/viewHistory",
                element: <ViewHistory />
            },
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);