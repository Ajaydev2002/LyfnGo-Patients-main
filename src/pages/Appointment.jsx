import React from "react";
import { Box, Typography, SvgIcon, IconButton, Button } from "@mui/material";

const Appointment = () => {
    return (
        <Box sx={{ padding: "50px" }}>
            <Box>
                <Box>
                    <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <Box>
                            <Button sx={{ textTransform: "none", backgroundColor: "#8CC63F", color: "#fff", borderRadius: "4px", padding: "10px", maxWidth: "100px" }}>Upcoming</Button>
                            <Button sx={{ textTransform: "none", padding: "10px" }}>Past</Button> 
                        </Box>
                        <Box sx={{display:"flex",alignItems:"center",gap:"10px"}}>
                            <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/View_Files_History.svg?" alt="view files" style={{border:"1px solid #0062DD",padding:"8px",backgroundColor:"#0062DD",borderRadius:"6px"}}/>
                            <img src="	https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/View_Billing_history.svg" alt="view Billing" style={{border:"1px solid #8CC63F",padding:"8px",backgroundColor:"#8CC63F",borderRadius:"6px"}}/>
                            <Button sx={{textTransform:"none",backgroundColor:"rgb(46, 178, 255)",color:"#fff",padding:"8px 20px",borderRadius:"20px"}}>Add appointment</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Appointment;