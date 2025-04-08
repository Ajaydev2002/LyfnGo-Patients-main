import React from "react";
import { Box, Typography} from "@mui/material";

const HealthBoard = () => {
    return (
        <Box sx={{ padding: "50px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: "600", fontSize: "15px" }}>HealthBoard</Typography>
                </Box>
                <Box>

                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", paddingTop: "100px" }}>
                <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/No_data_images/No_chathistory_found.svg" alt="Appointment" />
            </Box>
        </Box>
    )
}

export default HealthBoard;