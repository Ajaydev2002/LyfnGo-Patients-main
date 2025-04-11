import React, { useState, useEffect } from "react";
import { Box, Card, Typography, SvgIcon, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import { getPatientDetails } from "../api/patientsDetails";
import { savePatientData } from "../redux/PatientsSlice";


const PatientInfo = () => {

    const [patientsDetails, setPatientsDetails] = useState([]);

    const { custUuid } = useParams();

    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.patients);

    //to provide the data to the redux
    useEffect(() => {
        const fetchAndSave = async () => {
            try {
                const response = await getPatientDetails(custUuid);
                dispatch(savePatientData(response));
                setPatientsDetails(response);

            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAndSave();
    }, [dispatch]);

    if (error) return <p>Error: {error}</p>;

    const PatientsDetails = patientsDetails?.data;

    return (
        loading ? <PageLoading /> :
            <Box sx={{ padding: 2, width: "100%" }}>
                <Box sx={{ display: "flex", width: "100%" }}>
                    <Card sx={{
                        height: "320px", flex: 1, overflow: "scroll", borderRadius: "8px", marginLeft: "16px", marginTop: "16px", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Personal & Contact Information</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Gender & Age</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custAgeWithMonths ? PatientsDetails?.custAgeWithMonths : '-'}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", paddingTop: "10px", gap: "18px" }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Mobile Number</Typography>
                                <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custMobileNo ? PatientsDetails?.custMobileNo : '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Alternative Number</Typography>
                                <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custAlternateContactNo ? PatientsDetails?.custAlternateContactNo : '-'}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Email</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custEmail ? PatientsDetails?.custEmail : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Language Preference</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.langPreference ? PatientsDetails?.langPreference : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Occupation</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custOccupation ? PatientsDetails?.custOccupation : '-'}</Typography>
                        </Box>
                    </Card>

                    <Card sx={{
                        height: "320px", overflow: "scroll", flex: 1, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Medical Information</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Patient ID</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custCustomId ? PatientsDetails?.custCustomId : '-'}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", paddingTop: "10px", gap: "18px" }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Relation Name</Typography>
                                <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custRelationName ? PatientsDetails?.custRelationName : '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Relation Type</Typography>
                                <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custRelationType ? PatientsDetails?.custRelationType : '-'}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Insurance Name</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.insuranceName ? PatientsDetails?.insuranceName : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Insurance Number</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.insuranceNumber ? PatientsDetails?.insuranceNumber : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }} >
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Blood group</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custBloodGroup ? PatientsDetails?.custBloodGroup : '-'}</Typography>
                        </Box>
                    </Card>

                    <Card sx={{
                        height: "320px", overflow: "scroll", flex: 1, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", width: "100%", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        }
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Medical History</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            {PatientsDetails?.customerMedicalHistoryList.map((item) => (
                                <Box key={item?.medicalHistoryName}>
                                    <Typography variant="body1" sx={{ color: "#000", fontWeight: "400", fontSize: "12px", backgroundColor: "#eff6fe", textAlign: "center", marginBlock: "12px", borderRadius: "8px", paddingBlock: "8px" }}>{item?.medicalHistoryName ? item?.medicalHistoryName : '-'}</Typography>
                                </Box>
                            ))
                            }
                        </Box>
                    </Card>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Card sx={{
                        height: "320px", overflow: "scroll", flex: 1, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Address Information</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Address</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.address1 ? PatientsDetails?.address1 : ''}</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500" }}>{PatientsDetails?.state?.mastState ? PatientsDetails?.state?.mastState : ''}</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500" }}>{PatientsDetails?.country.country ? PatientsDetails?.country.country : ''}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Pincode</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.postalCode ? PatientsDetails?.postalCode : '-'}</Typography>
                        </Box>
                    </Card>


                    <Card sx={{
                        height: "320px", overflow: "scroll", flex: 1, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", width: "100%", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Social Information</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>ID Type</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.proofDTO?.mastLookupValue ? PatientsDetails?.proofDTO?.mastLookupValue : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>ID Number</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.customerIdProof ? PatientsDetails?.customerIdProof : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Referred By</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.custReferredBy ? PatientsDetails?.custReferredBy : '-'}</Typography>
                        </Box>
                    </Card>



                    <Card sx={{
                        height: "320px", overflow: "scroll", flex: 1, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Groups Created</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            {PatientsDetails?.tentGroupDtoList.map((item) => (
                                <Box key={item.tentGroupName} >
                                    <Typography variant="body1" sx={{ color: "#000", fontWeight: "400", fontSize: "12px", backgroundColor: "#eff6fe", textAlign: "center", marginBlock: "12px", borderRadius: "8px", paddingBlock: "8px" }}>{item.tentGroupName}</Typography>
                                </Box>
                            ))
                            }
                        </Box>
                    </Card>

                </Box>


                <Box sx={{ display: "flex" }}>

                    <Card sx={{
                        height: "320px", overflow: "scroll", width: "100%", flex: 0.32, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Other Information</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>GCreated by</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.createdByTenantUserName ? PatientsDetails?.createdByTenantUserName : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Join Date</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.joiningDate ? PatientsDetails?.joiningDate : '-'}</Typography>
                        </Box>
                    </Card>



                    <Card sx={{
                        height: "320px", overflow: "scroll", width: "100%", flex: 0.32, borderRadius: "8px", marginLeft: "16px", marginTop: "16px", border: "1px solid rgb(255, 255, 255)", boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px", padding: "16px",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="h6" sx={{ color: "#0062DD", fontSize: "14px", fontWeight: "500" }}>Additional Information</Typography>
                            <Tooltip title="Edit" arrow >
                                <IconButton >
                                    <SvgIcon sx={{ fontSize: 22 }}>
                                        <path d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71-5.3 5.3V21h2.12l5.3-5.3z" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Food Allergy</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>-</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", paddingTop: "10px", gap: "18px" }}>
                            <Box>
                                <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Food Pattern</Typography>
                                <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.additionalInfo?.foodPattern ? PatientsDetails?.additionalInfo?.foodPattern : '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Meal Pattern</Typography>
                                <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>-</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Water In-Take Per Day</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.additionalInfo?.foodPattern ? PatientsDetails?.additionalInfo?.foodPattern : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Frequency Of Non-Veg Consumption</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.additionalInfo?.nonVegFrequency ? PatientsDetails?.additionalInfo?.nonVegFrequency : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Preferred Type Of Meal</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.additionalInfo?.prefMeatType ? PatientsDetails?.additionalInfo?.prefMeatType : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }} >
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Daily Routine Type</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.additionalInfo?.dailyRoutineType ? PatientsDetails?.additionalInfo?.dailyRoutineType : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Daily Routine Time</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>{PatientsDetails?.additionalInfo?.dailyRoutineHours ? PatientsDetails?.additionalInfo?.dailyRoutineHours : '-'}</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Purpose Of Joining</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>-</Typography>
                        </Box>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Typography variant="body1" sx={{ color: "#727272", fontWeight: "400", fontSize: "12px" }}>Mode Of Training</Typography>
                            <Typography variant="body1" sx={{ color: "000", fontSize: "12px", fontWeight: "500", paddingTop: "3px" }}>-</Typography>
                        </Box>
                    </Card>
                </Box>
            </Box>
    )
}

export default PatientInfo;