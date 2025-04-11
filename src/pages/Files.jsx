import React, { useState, useEffect } from "react";
import { Box, Typography, SvgIcon, IconButton, Button, TextField, MenuItem } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from "axios";
import { FilesName } from "../consts/FilesNav";
import { useDropzone } from 'react-dropzone';
import { getAppointmentDetails } from "../api/Appointment";
import { useDispatch } from "react-redux";
import { savePatientData } from "../redux/PatientsSlice";

const Files = () => {

    const [fileType, setFileType] = useState("Prescription");
    const [preview, setPreview] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAndSave = async () => {
            try {
                const response = await getAppointmentDetails();
                dispatch(savePatientData(response));

                setAppointmentData(response?.data?.data);

            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAndSave();
    }, [dispatch]);

    const appointmentUuid = appointmentData[0]?.appointmentUuid

    //API to get the data to display the image
    useEffect(() => {
        axios.get(`https://flash.lyf.yoga/files/charting/api/files/${appointmentUuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setPreview(response?.data?.data?.chartingFilesList)
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, [appointmentUuid]);

    //API to save files which are uploaded
    const handleSaveFile = async () => {
        try {

            const payload = preview.map((item) => ({
                supDocUuid: item.uuid,
            }));


            const response = await axios.post(
                `https://flash.lyf.yoga/files/charting/api/files/${appointmentUuid}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                    },
                }
            )
            alert("saved successfilly")
        }
        catch (error) {
            console.error("API Error:", error?.response?.data || error.message);

            alert("Something went wrong: " + (error?.response?.data?.message || error.message));

        }
    }

    //To upload file from folder
    const handleUpload = async (file) => {

        const formData = new FormData();
        formData.append("FILE", file);

        try {
            const response = await axios.post(`https://flash.lyf.yoga/files/file/application/uploadMultiple/jzxph5ql/6f22fe5v/0vcxil1g?fileType=${fileType}`,
                formData,
                {
                    headers: {
                        Internal: "LYFnGO"
                    },
                }
            );
            alert("File uploaded succesfully")

            const data = response?.data?.data?.fileMetaDataList || [];

            if (response.data.status === "SUCCESS") {
                setPreview((prev) => [...prev, ...data]);
            }

        } catch (error) {
            console.error("Upload failed:", error);

            // Log server response (if any)
            if (error.response) {
                console.error("Server responded with:", error.response.data);
                alert("Can't upload this file: " + (error.response.data.message || "Unknown server error"));
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("Can't upload this file: No response from server");
            } else {
                alert("Can't upload this file: " + error.message);
            }
        }
    }

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            handleUpload(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });


    return (
        <Box sx={{ padding: "20px" }}>
            {appointmentData?.map((item) => (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px", boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.25)" }}>
                    <Box>
                        <IconButton sx={{ color: "#000", backgroundColor: "#ebf8ff", }}>
                            <SvgIcon sx={{ paddingLeft: "5px" }}>
                                <path d="M11.67 3.87 9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: "500" }}>{new Date(item.scheduledOn).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit"
                        })}</Typography>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>{item?.appointmentStartTime.split(" ")[1].split(":").slice(0, 2).join(":")} pm - {item?.appointmentEndTime.split(" ")[1].split(":").slice(0, 2).join(":")} pm <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>({item?.scheduledPeriod}{item?.scheduledPeriodType})</span></Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>Specialist <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>{item?.tentUserSalutation} {item?.tentUserFirstName} </span></Typography>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>Mode <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>{item?.appointmentTypeMode}</span></Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px", display: "flex", alignItems: "center", color: "rgb(136, 124, 227)", fontWeight: "600" }}><FiberManualRecordIcon sx={{ fontSize: "16px", color: "rgb(136, 124, 227)" }} /> {item?.appointmentModeStatus?.charAt(0).toUpperCase() + item?.appointmentModeStatus?.slice(1)}</Typography>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>Appointment No  <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>{item?.appointmentNumber}</span></Typography>
                    </Box>
                </Box>
            ))}


            <Box>
                <Box sx={{ mt: 5 }}>
                    <TextField
                        id="File Name"
                        select
                        label="File Name"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        defaultValue="Prescription"
                        sx={{
                            width: "600px",
                            "& .MuiInputBase-root": {
                                height: "35px",
                            },
                            "& .MuiOutlinedInput-input": {
                                fontSize: "13px",
                            },
                        }}
                    >
                        {FilesName.map((Add) => (
                            <MenuItem key={Add.option} value={Add.option} sx={{ fontSize: "13px" }}>
                                {Add.option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ mt: 5, display: "flex", gap: "10px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {preview && preview.map((item) => (
                            <Box sx={{display:"flex",flexDirection:"column",gap:"1px"}}>
                                <img src={item.filePath} alt="preview" width="100px" style={{ borderRadius: "5px" }} />
                                <Typography variant="body1" sx={{ fontSize: "9px", width: "100px", color: "#fff", padding: "4px", borderRadius: "4px", backgroundColor: "#323232" }}>{item?.documentName}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box>
                        <Box sx={{ width: "182px", height: "174px", boxShadow: "0 4px 8px 0 rgb(0 0 0 / 6%), 0px 1px 20px 0 rgb(255 255 255 /12%)", backgroundColor: "#fff" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", height: "100%" }}>
                                <Box>
                                    <IconButton sx={{ color: "#C40707" }}>
                                        <SvgIcon sx={{ fontSize: "38px", color: "#767676" }}>
                                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3M8 13h2.55v3h2.9v-3H16l-4-4z" />
                                        </SvgIcon>
                                    </IconButton>
                                </Box>
                                <Box {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Button sx={{ color: "#636669", border: "1px solid #636669", borderRadius: "25px", fontSize: "13px", textTransform: "none", paddingInline: "20px" }} >
                                        Upload
                                    </Button>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                                    <Typography variant="body1" sx={{ color: "#808080", fontSize: "11px" }}>File types: PNG, JPG, JPEG, PDF</Typography>
                                    <Typography variant="body1" sx={{ color: "#808080", fontSize: "11px" }}>Maximum file size: 2 MB</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ marginTop: "20px" }}>
                            <Typography variant="body1" sx={{ color: "gray", fontSize: "14px", }}>Up to 30 files can be attached.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "end" }}>
                <Button sx={{ color: "black", background: "#EFEFEF", paddingBlock: "4px", paddingInline: "20px", borderRadius: "25px", textTransform: "none" }}>
                    Back
                </Button>
                <Button onClick={handleSaveFile} sx={{ color: "#fff", background: "#0062DD", paddingBlock: "4px", paddingInline: "20px", borderRadius: "25px", textTransform: "none" }}>
                    Save files
                </Button>
            </Box>

        </Box>
    )
}

export default Files;