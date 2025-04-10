import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Typography, SvgIcon, Card } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const Patientss = () => {

    const [patientList, setPatientsList] = useState([]);

    useEffect(() => {
        axios.get(
            "https://flash.lyf.yoga/api/customer/getPatientListByTenant/jzxph5ql?page=0&size=25",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        )
            .then((response) => {
                setPatientsList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
            });
    }, []);

    const patientItems = patientList?.data?.customerList || [];

    return (
        <Box style={{ marginLeft: "101px", marginTop: "60px" }}>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0062DD", paddingBlock: "10px" }}>
                <Box>
                    <Typography style={{ fontSize: "16px", fontWeight: "500", color: "#fff", letterSpacing: "p", marginLeft: "18px" }}>Patientss</Typography>
                </Box>

                <Box style={{ cursor: "pointer", display: "flex", alignItems: "center", paddingInline: "40px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#fff",
                            borderRadius: "25px",
                            px: 1.5,
                            py: 0.5,
                            cursor: "pointer",
                        }}>
                        <img
                            src="https://flash.lyf.yoga/static/media/Google_logo.25d3028b.svg"
                            alt="Google Logo"
                            style={{ width: "30px" }}
                        />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, pl: 0.5 }}>
                            Import contacts
                        </Typography>
                    </Box>

                    <Box style={{ paddingLeft: "20px" }}>
                        <Tooltip title="sync" arrow>
                            <IconButton sx={{ backgroundColor: "#fff", borderRadius: "5px", padding: "4px" }}>
                                <SvgIcon sx={{ fontSize: 22, color: "grey" }}>
                                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8m0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4z" />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", paddingInline: "10px", paddingBlock: "8px", borderRadius: "5px", marginLeft: "20px", width: "330px" }}>
                        <input type="text" placeholder="search" style={{ paddingLeft: "5px", border: "none", outline: "none", fontSize: "14px" }} />
                        <svg width="22" height="22" viewBox="0 0 23 23" fill="rgb(0, 98, 221)">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" />
                        </svg>
                    </Box>

                    <Box
                        sx={{
                            cursor: "pointer",
                            padding: "5px",
                            backgroundColor: "#8CC63F",
                            marginLeft: "15px",
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                        }}>
                        <IconButton sx={{ padding: 0 }}>
                            <SvgIcon sx={{ fontSize: 22, color: "#fff" }}>
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 8h-6V5h6zm-8-6v6H5V5zm-6 8h6v6H5zm8 6v-6h6v6z" />
                            </SvgIcon>
                        </IconButton>

                        <IconButton sx={{ padding: 0, paddingLeft: "2px" }}>
                            <SvgIcon sx={{ fontSize: 22, color: "#fff" }}>
                                <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </SvgIcon>
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            padding: "5px",
                            ml: "30px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                        }}>
                        <SvgIcon sx={{ fontSize: 22, color: "rgb(46, 178, 255)" }}>
                            <path d="M7 6h10l-5.01 6.3zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61" />
                        </SvgIcon>
                    </Box>

                </Box>
            </Box>

            <Box sx={{display:"flex",flexWrap:"wrap"}}>
                {patientItems.map((details, index) => (
                    <Card sx={{minWidth:"200px",
                        maxWidth: "340px", borderRadius: "8px", marginLeft: "16px", marginTop: "16px", width: "100%", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&:hover": {
                            border: "1px solid rgb(46,178,255)",
                            backgroundColor: "rgb(241,250,251)"
                        }
                    }} key={index} >
                        
                        <Link to={`/patientsDetails/${details.custUuid}`}>
                        
                            <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <Box style={{ fontSize: "18px", color: "#fff", backgroundColor: "rgb(46, 178, 255)", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", marginRight: "16px", position: "relative" }}>
                                        {details.custName?.charAt(0)}<span style={{ position: "absolute", right: "0px", top: "29px", minHeight: "12px", minWidth: "12px", borderRadius: "50px", border: "2px solid #fff", background: "rgb(34, 187, 51)" }}></span>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontSize: 14, fontWeight: 600,color:"black" }}>
                                            {details.custName}
                                        </Typography>

                                        <Typography variant="body2" sx={{ fontSize: 12, color: "#727272", fontWeight: 400, pt: 0.5 }}>
                                            <Typography component="span" sx={{ color: "#000", fontSize: 12, fontWeight: 400 }}>
                                                ID
                                            </Typography> {details.custCustomId}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Tooltip title="Quick add" arrow>
                                        <IconButton sx={{ backgroundColor: "#fff", "&:hover": { backgroundColor: "#f0f0f0" } }}>
                                            <SvgIcon sx={{ fontSize: 23, color: "rgb(0, 98, 221)" }}>
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
                                            </SvgIcon>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Quick info" arrow placement="bottom">
                                        <IconButton sx={{ backgroundColor: "#fff", "&:hover": { backgroundColor: "#f0f0f0" } }}>
                                            <SvgIcon sx={{ fontSize: 22 }}>
                                                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8" />
                                            </SvgIcon>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box style={{ paddingTop: "16px" }}>
                                <Box variant="body2" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#000" }}>
                                    <Box sx={{ display: "flex", gap: "8px" }}>
                                        <SvgIcon sx={{ fontSize: 22, color: "rgb(0, 98, 221)" }}>
                                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99" />
                                        </SvgIcon>

                                        <SvgIcon sx={{ fontSize: 22, color: "rgb(37, 211, 102)" }}>
                                            <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                                        </SvgIcon>
                                    </Box>
                                    {details.custCountryCode} {details.custMobileNo}
                                </Box>
                            </Box>
                        </Link>
                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default Patientss;