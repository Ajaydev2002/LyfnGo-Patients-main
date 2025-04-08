import React from "react";
import { Box, Typography, SvgIcon, IconButton } from "@mui/material";

const Appointment = () => {
    return (
        <Box sx={{padding:"50px"}}>
            <Box sx={{display:"flex",justifyContent:"space-between"}}>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: "600", fontSize: "15px" }}>Appointment</Typography>
                </Box>
                <Box>

                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", paddingTop: "100px" }}>
                <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Icons/No_appointment_yet.svg" alt="Appointment" width="300px" />
            </Box>
        </Box>
    )
}

export default Appointment;