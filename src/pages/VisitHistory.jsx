import React from "react";
import { Box, Typography, SvgIcon, IconButton } from "@mui/material";



const VisitHistory = () => {

    
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: "50px"}} >
                <Box >
                    <Typography variant="body1" sx={{ fontWeight: "600", fontSize: "15px" }}>Visit History</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box>
                        <IconButton sx={{ color: "rgb(0, 98, 221)", fontSize: "16px" }}>
                            <SvgIcon sx={{ paddingLeft: "5px" }}>
                                <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z" />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton sx={{ color: "rgb(0, 98, 221)", fontSize: "16px" }}>
                            <SvgIcon sx={{ paddingLeft: "5px" }}>
                                <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 18H4V10h16zm0-13H4V5h16z" />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "14px" }}>23 Mar 25  to 29 Mar 25</Typography>
                    </Box>
                    <Box>
                        <IconButton sx={{ color: "rgb(0, 98, 221)", fontSize: "16px" }}>
                            <SvgIcon sx={{ paddingLeft: "5px" }}>
                                <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z" />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                </Box>
                <Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%",paddingTop:"150px" }}>
                <img src="https://d1cdqhtb2bf9h4.cloudfront.net/Attendance/No_visits_found.svg" alt="vist history" />
            </Box>
        </Box>
    )
}


export default VisitHistory;