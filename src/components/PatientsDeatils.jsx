import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Typography, SvgIcon } from "@mui/material";
import { useParams } from "react-router-dom";
import PatientsDeatailsNav from "../consts/PatientsDetailsNav";
import { useDispatch, useSelector } from "react-redux";
import ViewHistory from "./ViewHistory";
import { getPatientDetails } from "../api/patientsDetails";
import { savePatientData } from "../redux/PatientsSlice";
import { useNavigate } from "react-router-dom";

const PatientsDeatails = () => {

    const { custUuid } = useParams();
    const dispatch = useDispatch();
    const { data, error, loading } = useSelector((state) => state.patients);

    const DefaultComponent = PatientsDeatailsNav.find(item => item.title === "Patient details")?.component;
    const [patientsSidebar, setPatientsSidebar] = useState(true);
    const [activeButton, setActiveButton] = useState("Patient details");
    const [selectedComponent, setSelectedComponent] = useState(DefaultComponent ? <DefaultComponent /> : null);
    const [showViewHistory, setShowViewHistory] = useState(false);
    const [patientInformatiom, setPatientInformation] = useState([])

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };


    const toogleOpenViewHistory = () => {
        setShowViewHistory(!showViewHistory);
    };

    const handleButtonClick = (title) => {
        setActiveButton(title);
        const selectedItem = PatientsDeatailsNav.find((item) => item.title === title);
        setSelectedComponent(selectedItem ? <selectedItem.component /> : null);
    };

    //To open the side bar
    const handleOpen = () => {
        setPatientsSidebar(!patientsSidebar);
    }

    //To fetch data from redux store
    useEffect(() => {
        const fetchAndSave = async () => {
            try {
                const response = await getPatientDetails(custUuid);
                dispatch(savePatientData(response));

                setPatientInformation(response);

                console.log("Dispatched patient data:", response);

            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAndSave();
    }, [dispatch]);


    if (error) return <p>Error: {error}</p>;

    const patientInfo = patientInformatiom?.data;

    //console.log("patientInfo",patientInfo)



    return (
        <Box sx={{ marginLeft: "101px", marginTop: "62px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#E5F6FF", position: "fixed", width: "calc(100% - 101px)", zIndex: "100" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <Box sx={{ backgroundColor: "#2EB2FF", height: "100%", borderRadius: "0%" }}>
                        <IconButton  onClick={handleGoBack}>
                            <SvgIcon sx={{ color: "#fff", paddingLeft: "4px", }}>
                                <path d="M11.67 3.87 9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
                            </SvgIcon>
                        </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>

                        <Box sx={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgb(46,178,255)", borderRadius: "50%", color: "#fff", fontSize: "20px",fontWeight:"500" }}>{patientInfo?.custName.charAt(0).toUpperCase()}</Box>

                        <Box>
                            <Typography variant="h5" sx={{ color: "#0062DD", fontSize: "16px", marginTop: "6px", fontWeight: "600" }}>
                                {patientInfo?.custName}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body1" sx={{ color: "rgb(144,144,144)", fontSize: "12px", fontWeight: "500" }}>
                                    {patientInfo?.custCustomId}
                                </Typography>
                                <Tooltip title="chat via whatsApp" arrow placement="bottom">
                                    <SvgIcon sx={{ color: "#25D366", marginLeft: "6px" }}>
                                        <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                                    </SvgIcon>
                                </Tooltip>

                                <Typography variant="body1" sx={{ marginInlineStart: "6px", fontSize: "13px", fontWeight: "500" }}>
                                    {patientInfo?.custCountryCode} {patientInfo?.custMobileNo}
                                </Typography>
                                <SvgIcon sx={{ color: "#2EB2FF", fontSize: "16px", marginLeft: "4px" }}>
                                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
                                </SvgIcon>

                                <Tooltip title={patientInfo?.custEmail} arrow placement="bottom">
                                    <SvgIcon sx={{ color: "#0062DD", marginLeft: "6px" }}>
                                        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0-8 4.99L4 6zm0 12H4V8l8 5 8-5z" />
                                    </SvgIcon>
                                </Tooltip>

                                <Box sx={{ marginLeft: "16px" }}>
                                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "600", gap: "6px" }}>
                                        <SvgIcon sx={{ color: "rgb(34, 187, 51)", width: "14px", height: "14px" }}>
                                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2" />
                                        </SvgIcon>
                                        Active
                                        <SvgIcon sx={{}}>
                                            <path d="m7 10 5 5 5-5z" />
                                        </SvgIcon>
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "6px" }}>
                                <Typography variant="h6" sx={{ color: "#727272", fontSize: "13px", fontWeight: "500" }}>Medical History</Typography>
                                <Box sx={{ display: "flex" }}>
                                    {patientInfo?.customerMedicalHistoryList.map((item, index) => (
                                        <Typography key={index} variant="h6" sx={{ color: "#0062DD", fontSize: "13px" }}>{item?.medicalHistoryName} ,</Typography>
                                    ))
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "18px", padding: "14px " }}>

                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px", paddingBottom: "8px" }}>
                                <Tooltip title="Blood group" arrow placement="bottom">
                                    <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/Blood_group.svg" />
                                </Tooltip>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>
                                    {patientInfo?.custBloodGroup}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Tooltip title="Weight" arrow placement="bottom">
                                    <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/Weight.svg" />
                                </Tooltip>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>{patientInfo?.weight}</Typography>
                            </Box>
                        </Box>

                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px", paddingBottom: "8px" }}>
                                <Tooltip title="Gender" arrow placement="bottom">
                                    <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/Gender.svg" />
                                </Tooltip>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>
                                    {patientInfo?.custGender === "M" ? "Male" : patientInfo?.custGender === "F" ? "Female" : "Others"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Tooltip title="Height" arrow placement="bottom">
                                    <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/Height_icon.svg" />
                                </Tooltip>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>{patientInfo?.height}</Typography>
                            </Box>
                        </Box>

                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px", paddingBottom: "8px" }}>
                                <Tooltip title="Age" arrow placement="bottom">
                                    <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Patient_Client_Icons/Icons/Age.svg" />
                                </Tooltip>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>{patientInfo?.custAge} Years Old</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <Tooltip title="Body Mass Index" arrow placement="bottom">
                                    <Box sx={{ width: "26px", height: "24px", borderRadius: "50%", backgroundColor: "rgb(106,180,75)", color: "rgb(255,255,255)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ fontSize: "10px", fontWeight: "400" }}>BMI</span>
                                    </Box>
                                </Tooltip>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600", color: "rgb(106,180,75)" }}>{patientInfo?.bmi}</Typography>
                                <Typography variant="h6" sx={{ fontSize: "14px", fontWeight: "600" }}>{patientInfo?.bmiStatus}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ backgroundColor: "#0062DD", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px", paddingBlock: "12px" }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "400", fontSize: "15px", color: "#fff" }}>Total vist</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "700", fontSize: "14px", color: "#fff", paddingTop: "6px" }}>{patientInfo?.visitCount}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", marginTop: "12px", cursor: "pointer", gap: "8px", paddingInline: "15px" }} onClick={toogleOpenViewHistory}>
                            <SvgIcon sx={{ color: "#fff" }}>
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </SvgIcon>
                            <Typography variant="body1" sx={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>View History</Typography>
                        </Box>
                    </Box>

                </Box>
            </Box>

            <Box sx={{ display: showViewHistory ? "none" : "block" }}>
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ position: "fixed", marginTop: "111px", width: patientsSidebar ? "14%" : "4.5%", borderRight: "1px solid #eeeeee" }}>
                        <Box sx={{
                            height: "77vh", overflowY: "scroll",
                            "&::-webkit-scrollbar": {
                                width: "5px",
                                height: '5px',
                                display: patientsSidebar ? "block" : "none",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgb(207, 207, 207)",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#grey",
                            },
                        }}>
                            <ul style={{ margin: "4px", cursor: "pointer" }}>
                                {PatientsDeatailsNav.map((item, index) => (
                                    <Tooltip title={patientsSidebar ? "" : item.title} arrow placement="right"
                                        key={index}>
                                        <Box
                                            key={item.id}
                                            onClick={() => handleButtonClick(item.title)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "8px",
                                                color: activeButton === item.title ? "#2EB2FF" : "#606060",
                                                backgroundColor: activeButton === item.title ? "#E5F6FF" : "transparent",
                                                borderRadius: "10px"
                                            }} >
                                            <Box sx={{ paddingLeft: "12px", paddingTop: "3px" }}><img src={item.img} /></Box>
                                            <Box sx={{ fontSize: "13px", paddingLeft: "10px", marginBlock: "4px", display: patientsSidebar ? "Block" : "none" }}>{item.title}</Box>
                                        </Box>
                                    </Tooltip>

                                ))}
                            </ul>
                        </Box>

                        <Box onClick={handleOpen} sx={{ position: "absolute", top: "0px", right: "-16px" }} >
                            <IconButton sx={{ backgroundColor: "#fff", ":hover": { backgroundColor: "#fff" } }}>
                                <SvgIcon sx={{ fontSize: "22px" }} >
                                    <path d="M3 18h13v-2H3zm0-5h10v-2H3zm0-7v2h13V6zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5z" />
                                </SvgIcon>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box style={{ marginTop: "113px", marginLeft: patientsSidebar ? "215px" : "4.3%", width: "100%", }}>
                        {selectedComponent || <Box>No Component Selected</Box>}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: showViewHistory ? "block" : "none", paddingTop: "110px" }}>
                <ViewHistory setShowViewHistory={setShowViewHistory} />
            </Box>
        </Box>
    )
}

export default PatientsDeatails;