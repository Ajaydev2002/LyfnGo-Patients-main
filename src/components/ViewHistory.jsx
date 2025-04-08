import React, { useState, useEffect } from "react";
import { Box, Typography, SvgIcon, IconButton, Table, TableCell, TableHead, TableRow, TableBody, TablePagination } from "@mui/material";
import axios from "axios";
import { Divider } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { decryption } from "../utils";
import LeanBody from "../pages/ChartSection/LeanBody";
import WeightChart from "../pages/ChartSection/WeightChart";
import BodyFat from "../pages/ChartSection/BodyFat";
import BmiChart from "../pages/ChartSection/BmiChart";


const ViewHistory = ({setShowViewHistory}) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tabelVitalSigns, setTabelVitalSigns] = useState([]);
    const [appointmentDetails, setAppointmentDetails] = useState([]);


    const exitViewHistory = () => {
        setShowViewHistory(false);
    };


    //To get the vital signs to display in the tabel
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/charting/api/vitalSign/getByVitalSign/rkpcdske",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                const decryptData = decryption(response);
                setTabelVitalSigns(decryptData.data);
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, []);


    //To get the Appointment details to display in the AccordionSummary
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/charting/api/appointment/getCustomerAppDetails/jzxph5ql/rkpcdske",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setAppointmentDetails(response?.data?.data);
            })
            .catch((error) => {
                console.error("Error fetching data Appointment details:", error.message);
            });
    }, []);


    //for pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    //for pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <Box sx={{ backgroundColor: "rgb(233, 240, 254)", marginTop: "5px" }}>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "8px", backgroundColor: "#0062DD", position: "sticky", top: "0", }}>
                    <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "500", color: "#fff" }}>Total Number of Visits: 30</Typography>

                    <IconButton onClick={exitViewHistory}>
                        <SvgIcon sx={{ color: "#fff", fontSize: "24px" }}>
                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z" />
                        </SvgIcon>
                    </IconButton>
                </Box>

                <Box sx={{ marginInline: "28px", marginBlock: "10px" }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDownwardIcon sx={{ color: "#fff" }} />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{ backgroundColor: "#0062DD" }}
                        >
                            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "500", color: "#fff" }}>Health Reports</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ textAlign: "center", backgroundColor: "#EBF4FF" }}>
                            <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/No_data_images/no_records_history.svg" alt="health report" style={{ marginBlock: "50px" }} />
                        </AccordionDetails>
                    </Accordion>
                </Box>

                <Box sx={{ marginInline: "28px", marginBlock: "20px" }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ArrowDownwardIcon sx={{ color: "#fff" }} />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={{ backgroundColor: "#0062DD" }}
                        >
                            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "500", color: "#fff" }}>Vital signs</Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ backgroundColor: "#EBF4FF" }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                                <Box>
                                    <Accordion sx={{ border: "1px solid rgb(58, 182, 255)", minWidth: "280px", boxShadow: "0px 3.46px 17.31px 0px #4FA1FB4D" }}>
                                        <AccordionSummary
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 20px" }}
                                        >
                                            <Box>
                                                <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "600", }}>Weight</Typography>
                                            </Box>
                                            <Box sx={{ ml: "auto" }}>
                                                <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "12px" }}><span style={{ fontSize: "16px", color: "rgb(58, 182, 255)" }}>{tabelVitalSigns.find(item => item.weight)?.weight || "N/A"}</span> kg</Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <WeightChart tabelVitalSigns={tabelVitalSigns} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>

                                <Box>
                                    <Accordion sx={{ border: "1px solid rgb(255, 69, 96)", minWidth: "280px", boxShadow: "0px 3.46px 17.31px 0px #4FA1FB4D" }}>
                                        <AccordionSummary
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 20px" }}
                                        >
                                            <Box>
                                                <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "600", }}>BMI</Typography>
                                            </Box>
                                            <Box sx={{ ml: "auto" }}>
                                                <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "12px" }}><span style={{ fontSize: "16px", color: "rgb(255, 69, 96)" }}>{tabelVitalSigns.find(item => item.bmi)?.bmi || "N/A"}</span></Typography>
                                            </Box>
                                        </AccordionSummary>

                                        <AccordionDetails>
                                            <BmiChart tabelVitalSigns={tabelVitalSigns} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>

                                <Box>
                                    <Accordion sx={{ border: "1px solid rgb(0, 143, 251)", minWidth: "280px", boxShadow: "0px 3.46px 17.31px 0px #4FA1FB4D" }}>
                                        <AccordionSummary
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 20px" }}
                                        >
                                            <Box>
                                                <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "600", }}>Lean Body Mass</Typography>
                                            </Box>
                                            <Box sx={{ ml: "auto" }}>
                                                <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "12px" }}><span style={{ fontSize: "16px", color: "rgb(58, 182, 255)" }}>{tabelVitalSigns.find(item => item.leanBodyMass)?.leanBodyMass || "N/A"}</span></Typography>
                                            </Box>
                                        </AccordionSummary>


                                        <AccordionDetails>
                                            <LeanBody tabelVitalSigns={tabelVitalSigns} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>

                                <Box>
                                    <Accordion sx={{ border: "1px solid rgb(255, 69, 96)", minWidth: "280px", boxShadow: "0px 3.46px 17.31px 0px #4FA1FB4D" }}>
                                        <AccordionSummary
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 20px" }}
                                        >
                                            <Box>
                                                <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "600", }}>Body Fat</Typography>
                                            </Box>
                                            <Box sx={{ ml: "auto" }}>
                                                <Typography variant="body1" sx={{ fontWeight: "500", fontSize: "12px" }}><span style={{ fontSize: "16px", color: "rgb(255, 69, 96)" }}>{tabelVitalSigns.find(item => item.bodyFat)?.bodyFat || "N/A"}</span> %</Typography>
                                            </Box>
                                        </AccordionSummary>

                                        <AccordionDetails>
                                            <BodyFat tabelVitalSigns={tabelVitalSigns} />
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>

                <Box sx={{
                    marginInline: "28px", marginTop: "20px", overflowX: "auto",
                    "&::-webkit-scrollbar": {
                        width: "5px",
                        height: '5px',
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgb(189, 186, 186)",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "#grey",
                    },
                }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#C3EAFF" }}>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Date</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Weight</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Height</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>BMI</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>BMI status</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Blood Pressure (mmHg)</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Temperature</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>pulse</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Respiration Rate</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Fasting Sugar</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Cholestrol</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Thyroid hormones</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Fat</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Lean Body Mass</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Visceral Fat</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Metabolic Rate</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Neck</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Upper arm</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Chest</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Thigh</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Hip</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Waist</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Waist to hip ratio</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Body Fat</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Body Age</TableCell>
                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Recorded By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tabelVitalSigns
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((detail, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ backgroundColor: index % 2 === 0 ? "#EBF4FF" : "#ffffff" }}
                                    >
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail.assignedOn ? new Date(detail.assignedOn).toISOString().split("T")[0].split("-").reverse().join("-") : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.weight ? `${detail?.weight} ${detail?.weightUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.height ? `${detail?.height} ${detail?.heightUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.bmi ? detail.bmi : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.bmiStatus ? detail.bmiStatus : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.bp?.map((item) => item.bpSys ? `${item.bpSys}/ ${item.bpDystole} ${item.bpUnit}` : "-")}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.temperature ? `${detail?.temperature} ${detail?.temperatureUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.pulse ? detail.pulse : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.respiratory ? `${detail?.respiratory} ${detail?.respiratoryUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.fastingSugar ? detail.fastingSugar : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.cholestrol ? detail.cholestrol : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.thyroidHarmones ? detail.thyroidHarmones : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.fat ? `${detail?.fat} ${detail?.fatUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.leanBodyMass ? detail.leanBodyMass : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.visceralFat ? detail.visceralFat : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.rateMetabolism ? detail.rateMetabolism : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.neck ? detail.neck : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.upperArm ? detail.upperArm : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.chest ? detail.chest : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.thigh ? detail.thigh : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.hip ? `${detail?.hip} ${detail?.hipUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.waist ? `${detail?.waist} ${detail?.waistUnit}` : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.hipWaistRatio ? detail.hipWaistRatio : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.bodyFat ? detail.bodyFat : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.bodyAge ? detail.bodyAge : "-"}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }} >{detail?.generatedByUser?.tentUserName ? `${detail?.generatedByUser?.tentUserSalutation}.${detail?.generatedByUser?.tentUserName} (${detail?.generatedByUser?.tentUserRole})` : "-"}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end", backgroundColor: "#fff", marginInline: "30px" }}>
                    <TablePagination
                        sx={{ paddingInline: "20px", width: "100%", border: "none" }}
                        count={tabelVitalSigns.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15]}
                    />
                </Box>


                <Box sx={{ marginInline: "28px", marginBlock: "50px", display: appointmentDetails?.viewHistoryResponse?.length > 0 ? "block" : "none" }}>
                    {appointmentDetails?.viewHistoryResponse?.map((item, index) => (

                        <Box sx={{ borderRadius: "10px", display: "flex", gap: "10px" }}
                            key={index}>

                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 1 0%" }}>
                                <span style={{ width: "2px", backgroundColor: "rgb(0, 98, 221)", flexGrow: "1" }}></span>
                                <SvgIcon sx={{ color: "rgb(0, 98, 221)", fontSize: "20px" }}>
                                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2" />
                                </SvgIcon>
                                <span style={{ width: "2px", backgroundColor: "rgb(0, 98, 221)", flexGrow: "1" }}></span>
                            </Box>

                            <Box sx={{ width: "100%", paddingBlock: "20px", }}>
                                <Accordion sx={{ borderRadius: "10px", width: "100%" }}>
                                    <AccordionSummary
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        sx={{ backgroundColor: "#0062DD", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderRadius: "10px" }} >

                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" sx={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{item?.appointmentDate
                                                ? new Date(item?.appointmentDate).toLocaleDateString("en-GB").split("/").join("-")
                                                : "invalid date"}
                                            </Typography>

                                            <Typography variant="body1" sx={{ fontSize: "13px", fontWeight: "400", color: "#fff" }}>
                                                {item?.appointmentTime ? `(
                                            ${item.appointmentStartTime
                                                        ? new Date(item.appointmentStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
                                                        : "invalid date"} ${item?.appointmentTime > 12 ? "PM" : "AM"} -
                                            ${item.appointmentEndTime
                                                        ? new Date(item.appointmentEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
                                                        : "invalid date"} ${item?.appointmentTime > 12 ? "PM" : "AM"}
                                            )` : "(invalid date - invalid date)"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                                            <Typography variant="body1" sx={{ fontSize: "13px", color: "#fff" }}>Appointment with</Typography>
                                            <Typography component="span" sx={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{item?.specialistName}</Typography>
                                            <Typography variant="body1" sx={{ fontSize: "13px", fontWeight: "400", color: "#fff", display: "flex" }}>({item?.appointmentNumber})</Typography>
                                        </Box>

                                    </AccordionSummary>





                                    <AccordionDetails sx={{ borderRadius: "10px" }}>
                                        <Box>
                                            <Box>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Box>
                                                            <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/dot.svg" alt="icon" />
                                                        </Box>
                                                        CLINICAL NOTES
                                                    </Typography>
                                                </Box>

                                                <Box>
                                                    <Box sx={{ display: "flex", gap: "40px", marginTop: "20px" }}>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "13px", paddingLeft: "30px" }}>Complaints</Typography>
                                                        </Box>
                                                        <Box >
                                                            <Typography variant="body1" sx={{ display: "flex", flexDirection: "column", fontSize: "13px", marginTop: "-5px" }}>
                                                                {item?.clinicalNotesWrapper?.clinicalNotesGetDtoList[0]?.description?.map((desc, index) => (
                                                                    <span key={index} style={{ paddingTop: "8px" }}>- {desc}</span>
                                                                ))}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "30px", marginTop: "20px" }}>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "13px", paddingLeft: "30px" }}>Observations</Typography>
                                                        </Box>
                                                        <Box >
                                                            <Typography variant="body1" sx={{ display: "flex", flexDirection: "column", fontSize: "13px", marginTop: "-5px" }}>
                                                                {item?.clinicalNotesWrapper?.clinicalNotesGetDtoList[1]?.description?.map((desc, index) => (
                                                                    <span key={index} style={{ paddingTop: "8px" }}>- {desc}</span>
                                                                ))}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "40px", marginTop: "20px" }}>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "13px", paddingLeft: "30px" }}>Diagnoses</Typography>
                                                        </Box>
                                                        <Box >
                                                            <Typography variant="body1" sx={{ display: "flex", flexDirection: "column", fontSize: "13px", marginTop: "-5px" }}>
                                                                {item?.clinicalNotesWrapper?.clinicalNotesGetDtoList[2]?.description?.map((desc, index) => (
                                                                    <span key={index} style={{ paddingTop: "8px" }}>- {desc}</span>
                                                                ))}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "40px", marginTop: "30px" }}>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: "400", fontSize: "13px", paddingLeft: "30px" }}>Notes</Typography>
                                                        </Box>
                                                        <Box >
                                                            <Typography variant="body1" sx={{ display: "flex", flexDirection: "column", fontSize: "13px", marginTop: "-5px" }}>
                                                                {item?.clinicalNotesWrapper?.clinicalNotesGetDtoList[3]?.description?.map((desc, index) => (
                                                                    <span key={index} style={{ paddingTop: "8px" }}> - {desc}</span>
                                                                ))}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ marginBlock: "30px" }} />

                                            <Box sx={{ marginTop: "30px" }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Box>
                                                            <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/dot.svg" alt="icon" />
                                                        </Box>
                                                        PRESCRIPTION
                                                    </Typography>
                                                </Box>

                                                <Box sx={{
                                                    marginTop: "10px",
                                                    overflowX: "auto",
                                                    "&::-webkit-scrollbar": {
                                                        width: "5px",
                                                        height: '5px',
                                                    },
                                                    "&::-webkit-scrollbar-thumb": {
                                                        backgroundColor: "rgb(189, 186, 186)",
                                                        borderRadius: "4px",
                                                    },
                                                    "&::-webkit-scrollbar-track": {
                                                        backgroundColor: "#grey",
                                                    },
                                                }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: "#C3EAFF" }}>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>S.NO</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>DRUG</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>MANUFACTURER NAME</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Dosage & Frequency</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Intake</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Duration</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {item?.prescriptionWrapper?.getPrescriptionDtoList.map((desc, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    sx={{ backgroundColor: index % 2 === 0 ? "#EBF4FF" : "#ffffff" }}>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{index + 1}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.drugName ? desc?.drugName : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.manufactureName ? desc?.manufactureName : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.morning || desc?.noon || desc?.night ? `${desc?.morning ? desc?.morning : 0} - ${desc?.noon ? desc?.noon : 0} - ${desc?.night ? desc?.night : 0}` : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.beforeFood ? desc?.beforeFood : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.duration ? `${desc?.duration} ${desc?.durationUnit}` : "-"} </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>

                                                <Box>
                                                    <Box sx={{ marginTop: "20px" }}>
                                                        <Typography variant="body1" sx={{ fontSize: "15px", fontWeight: "500" }}>Diet Instructions</Typography>
                                                    </Box>
                                                    <Box sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
                                                        {item?.prescriptionWrapper?.globalInstruction.map((desc, index) => (
                                                            <Typography variant="body1" sx={{ fontSize: "13px" }}
                                                                key={index}
                                                            >
                                                                {index + 1}. {desc}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ marginBlock: "30px" }} />

                                            <Box sx={{ marginTop: "20px" }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Box>
                                                            <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/dot.svg" alt="icon" />
                                                        </Box>
                                                        PROCEDURE
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        marginTop: "10px",
                                                        overflowX: "auto",
                                                        "&::-webkit-scrollbar": {
                                                            width: "5px",
                                                            height: '5px',
                                                        },
                                                        "&::-webkit-scrollbar-thumb": {
                                                            backgroundColor: "rgb(189, 186, 186)",
                                                            borderRadius: "4px",
                                                        },
                                                        "&::-webkit-scrollbar-track": {
                                                            backgroundColor: "#grey",
                                                        },
                                                    }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: "#C3EAFF" }}>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Procedure</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Unit</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Price</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Discount</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Total</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {item?.completedProcedureWrapper?.getCompletedProceduresDtoList.map((desc, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    sx={{ backgroundColor: index % 2 === 0 ? "#EBF4FF" : "#ffffff" }}
                                                                >
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.procedureName ? desc?.procedureName : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.qty ? desc?.qty : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.cost ? desc?.cost : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}>{desc?.discount > 0 ? `${desc?.discount} ${desc?.discountUnit?.currency}` : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none" }}> ₹ {desc?.total ? Number(desc.total).toFixed(2) : "-"}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontSize: "15px", fontWeight: "500", padding: "12px", backgroundColor: "rgb(241, 231, 255)", textAlign: "right" }}>
                                                        Estimated Total :  ₹ {item?.completedProcedureWrapper?.totalCost}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ marginBlock: "30px" }} />

                                            <Box >
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Box>
                                                            <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/dot.svg" alt="icon" />
                                                        </Box>
                                                        BILLING
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        marginTop: "10px",
                                                        overflowX: "auto",
                                                        "&::-webkit-scrollbar": {
                                                            width: "5px",
                                                            height: '5px',
                                                        },
                                                        "&::-webkit-scrollbar-thumb": {
                                                            backgroundColor: "rgb(189, 186, 186)",
                                                            borderRadius: "4px",
                                                        },
                                                        "&::-webkit-scrollbar-track": {
                                                            backgroundColor: "#grey",
                                                        },
                                                    }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: "#C3EAFF" }}>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>S.NO</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Invoice no</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Name</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Price</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Status</TableCell>
                                                                <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "600" }}>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {item?.billingHistoryDetails?.custBillingInvoiceGetDtoList.map((desc, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    sx={{ backgroundColor: index % 2 === 0 ? "#EBF4FF" : "#ffffff" }}>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none", padding: "5px", paddingLeft: "15px" }}>{index + 1}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none", padding: "5px", paddingLeft: "15px" }}>{desc?.custInvoiceNo ? desc?.custInvoiceNo : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none", padding: "5px", paddingLeft: "15px" }}>{desc?.orderName[0] ? desc?.orderName[0] : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none", padding: "5px", paddingLeft: "15px" }}>{desc?.custBillingInvoiceCost ? desc?.custBillingInvoiceCost : "-"}</TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none", padding: "5px", paddingLeft: "15px" }}><span style={{ backgroundColor: "rgb(46, 125, 50)", color: "#fff", paddingInline: "15px", fontSize: "10px", paddingBlock: "5px", borderRadius: "25px" }}>{desc?.paymentStatus ? desc?.paymentStatus : "-"}</span></TableCell>
                                                                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "13px", border: "none", padding: "5px", paddingLeft: "15px" }}>
                                                                        <IconButton>
                                                                            <SvgIcon sx={{ color: "rgb(46, 178, 255)" }}>
                                                                                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3m-3 11H8v-5h8zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1-9H6v4h12z" />
                                                                            </SvgIcon>
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>

                                                </Box>
                                            </Box>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Box>
                    ))}
                </Box>

            </Box>
        </Box>
    )
}

export default ViewHistory;