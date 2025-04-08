import React, { useState, useEffect } from "react";
import { Box, Card, Typography, SvgIcon, IconButton, Tooltip } from "@mui/material";


const PageLoading = () => {
    return (
        <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100vh",backgroundColor:"rgba(0, 0, 0, 0.5)",position:"absolute",top:"0",left:"0",zIndex:"1000"}}>
            <Box sx={{display:"flex",alignItems:"center",flexDirection:"column",width:"400px",height:"150px",boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.25)",justifyContent:"center",backgroundColor:"#fff",borderRadius:"5px"}}>
                <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Main_menu_icons/LYFnGO_logo.svg"/>
                <Typography variant="body 1" sx={{mt:1,fontSize:"13px"}}>Loading please wait...</Typography>
            </Box>
        </Box>
    )
}

export default PageLoading;