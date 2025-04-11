import React, { useState, useEffect } from "react";
import { Box, Card, Typography, SvgIcon, IconButton, Button, TextField, MenuItem, Autocomplete } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { encryption } from "../utils";
import { decryption } from "../utils";
import { getAppointmentDetails } from "../api/Appointment";
import { useDispatch } from "react-redux";
import { savePatientData } from "../redux/PatientsSlice";

const ClinicalNotes = () => {

    const [expanded, setExpanded] = useState(false);
    const [clients, setClients] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [obsInputValue, setObsInputValue] = useState("")
    const [diaInputValue, setDiaInputValue] = useState("")
    const [noteInputValue, setNoteInputValue] = useState("")
    const [isFocused, setIsFocused] = useState(false);

    const [manualEntries, setManualEntries] = useState({});
    const [obsManualEntries, setObsManualEntries] = useState({});
    const [diaManualEntries, setDiaManualEntries] = useState({});
    const [noteManualEntries, setNoteManualEntries] = useState({});

    const [selectedValue, setSelectedValue] = useState([]);
    const [obsSelectedValues, setObsSelectedValues] = useState([]);
    const [diaSelectedValues, setDiaSelectedValues] = useState([]);
    const [noteSelectedValues, setNoteSelectedValues] = useState([]);
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


    const handleSelectChange = (event, newValue) => {
        if (newValue && !selectedValue.includes(newValue)) {
            setSelectedValue([...selectedValue, newValue]);

            const availableOptions = Clinicalnotes?.Compliants?.map((option) => option.description) || [];

            setManualEntries((prev) => ({
                ...prev,
                [newValue]: !availableOptions.includes(newValue),
            }));
        }
        setInputValue("");
    };

    const handleSelectObs = (event, newValue) => {
        if (newValue && !obsSelectedValues.includes(newValue)) {
            setObsSelectedValues([...obsSelectedValues, newValue]);

            const availableOptions = Clinicalnotes?.Observations?.map(option => option.description.toLowerCase()) || [];
            const isManualEntry = !availableOptions.includes(newValue.toLowerCase());

            setObsManualEntries((prev) => ({
                ...prev,
                [newValue]: isManualEntry,
            }));
        }
        setObsInputValue("");
    };

    const handleSelectdia = (event, newValue) => {
        if (newValue && !diaSelectedValues.includes(newValue)) {
            setDiaSelectedValues([...diaSelectedValues, newValue]);

            const availableOptions = Clinicalnotes?.Diagnosis?.map(option => option.description.trim().toLowerCase()) || [];
            const isManualEntry = !availableOptions.includes(newValue.toLowerCase());

            setDiaManualEntries((prev) => ({
                ...prev,
                [newValue]: isManualEntry,
            }));
        }
        setDiaInputValue("");
    };

    const handleSelectNote = (event, newValue) => {
        if (newValue && !noteSelectedValues.includes(newValue)) {
            setNoteSelectedValues([...noteSelectedValues, newValue]);

            const availableOptions = Clinicalnotes?.Notes?.map(option => option.description.trim().toLowerCase()) || [];
            const isManualEntry = !availableOptions.includes(newValue.toLowerCase());

            setNoteManualEntries((prev) => ({
                ...prev,
                [newValue]: isManualEntry,
            }));
        }
        setNoteInputValue("");
    }


    const handleDelete = (indexToRemove) => {
        setSelectedValue(selectedValue.filter((_, index) => index !== indexToRemove));
    };
    const handleDeleteObs = (indexToRemove) => {
        setObsSelectedValues(obsSelectedValues.filter((_, index) => index !== indexToRemove));
    };
    const handleDeleteDia = (indexToRemove) => {
        setDiaSelectedValues(diaSelectedValues.filter((_, index) => index !== indexToRemove));
    };
    const handleDeleteNote = (indexToRemove) => {
        setNoteSelectedValues(noteSelectedValues.filter((_, index) => index !== indexToRemove));
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    const appointmentUuid = appointmentData[0]?.appointmentUuid

    //Put API to save the clinical notes
    const handleSaveClinical = async () => {
        try {
            let decryptKey = encryption(
                [
                    {
                        categoryId: 1,
                        description: selectedValue.map(item => item),
                        fileMetaDataList: [],
                        notesCatalogUuid: "bb4xq7c7"
                    },
                    {
                        categoryId: 2,
                        description: obsSelectedValues.map(item => item),
                        fileMetaDataList: [],
                        notesCatalogUuid: "ij7uhwca"
                    },
                    {
                        categoryId: 3,
                        description: diaSelectedValues.map(item => item),
                        fileMetaDataList: [],
                        notesCatalogUuid: "tasid1h7"
                    },
                    {
                        categoryId: 4,
                        description: noteSelectedValues.map(item => item),
                        fileMetaDataList: [],
                        notesCatalogUuid: "5t0p23ll"
                    }
                ])

            const response = await axios.put(
                `https://flash.lyf.yoga/files/charting/api/clinicalNotes/${appointmentUuid}?tentUserUuid=6f22fe5v`,
                { data: decryptKey?.plainText },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                        key: decryptKey?.publicKey,
                    }
                }
            );
            alert("clinical notes updated successfully!");
        } catch (error) {
            console.error("clinical notes Error", error.response?.data || error.message);
            alert("Faild to update clinical notes");
        }
    };

    //Post API to add new item to the array
    const handleClickPost = async (value, notesCategoryUuid, manulEntry) => {


        try {
            const payload = {
                description: value,
                notesCategoryUuid: notesCategoryUuid,
            }

            const response = await axios.post(
                `https://flash.lyf.yoga/files/settings/api/mastClinicalNotes/jzxph5ql`,
                payload,
                {
                    headers: {
                        Accept: "application/json",
                        Internal: "LYFnGO",
                    },
                }
            );

            if (response.data.status === "success") {

                manulEntry((prev) => ({
                    ...prev,
                    [value]: false,
                }));
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    }

    //API to get the saved clincal notes to display in the table
    useEffect(() => {
        axios.get(
            `https://flash.lyf.yoga/files/charting/api/clinicalNotes/${appointmentUuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        )
            .then((response) => {
                const Descript = decryption(response);
                if (Descript?.data?.clinicalNotesGetDtoList?.length) {
                    setSelectedValue(Descript.data.clinicalNotesGetDtoList[0]?.description || []);
                    setObsSelectedValues(Descript.data.clinicalNotesGetDtoList[1]?.description || []);
                    setDiaSelectedValues(Descript.data.clinicalNotesGetDtoList[2]?.description || []);
                    setNoteSelectedValues(Descript.data.clinicalNotesGetDtoList[3]?.description || []);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
            });
    }, [appointmentUuid]);


    //Get API to Details of clinical notes
    useEffect(() => {
        axios.get(
            "https://flash.lyf.yoga/files/settings/api/mastClinicalNotes/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        )
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
            });
    }, []);
    const Clinicalnotes = clients?.data




    return (
        <Box sx={{ padding: "15px" }}>
            <Box>
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
            </Box>


            <Box sx={{ paddingTop: "20px" }}>
                <Box>
                    <Button sx={{ color: "#fff", padding: "4px 20px", boxShadow: "none", borderRadius: "25px", textTransform: "none", backgroundColor: "#0062DD" }}>
                        Load previous data
                    </Button>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "end", paddingBlock: "8px" }}>
                    <IconButton sx={{ color: "#C40707" }}>
                        <SvgIcon >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" />
                        </SvgIcon>
                    </IconButton>
                </Box>


                <Box>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ marginBottom: "15px" }}>

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography component="span" sx={{ width: '33%', flexShrink: 0, fontSize: "14px" }}>
                                Complaints
                            </Typography>
                        </AccordionSummary>


                        <AccordionDetails>
                            <ul>
                                {selectedValue.map((value, index) => (
                                    <li key={index} style={{ listStyleType: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontSize: "13px" }} >- {value}</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton>
                                                <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                            </IconButton>
                                            {manualEntries[value] &&
                                                <IconButton onClick={() => handleClickPost(value, "avtb7ycn", setManualEntries)} >
                                                    <CheckCircleOutlineIcon />
                                                </IconButton>
                                            }
                                            <IconButton onClick={() => handleDelete(index)}>
                                                <HighlightOffIcon sx={{ color: "rgb(244, 67, 54)", fontSize: "25px" }} />
                                            </IconButton>
                                        </Box>
                                    </li>
                                ))}
                            </ul>

                            <Autocomplete
                                freeSolo
                                options={Clinicalnotes?.Compliants
                                    ?.map((option) => option.description)
                                    .filter((desc) => !selectedValue.includes(desc)) || []}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ fontSize: "13px", color: "#333" }}>
                                        {option}
                                    </li>
                                )}
                                onChange={handleSelectChange}
                                inputValue={inputValue}
                                onInputChange={(event, newValue) => {
                                    if (event && event.type === "change") {
                                        setInputValue(newValue);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={isFocused ? "" : "+ Type and hit enter to add"}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        sx={{
                                            width: "100%",
                                            "& input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                        InputLabelProps={{ sx: { fontSize: "13px" } }}
                                    />
                                )}
                            />
                        </AccordionDetails>
                    </Accordion>


                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ marginBottom: "15px" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography component="span" sx={{ width: '33%', flexShrink: 0, fontSize: "14px" }}>
                                Observations
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <ul>
                                {obsSelectedValues.map((value, index) => (
                                    <li key={index} style={{ listStyleType: "none", display: "flex", justifyContent: "space-between", alignItems: "center", listStyleType: "none" }}>

                                        <Box>
                                            <Typography variant="body1" sx={{ fontSize: "13px" }} >- {value}</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton>
                                                <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                            </IconButton>
                                            {obsManualEntries[value] === true &&
                                                <IconButton onClick={() => handleClickPost(value, "g6z4j32r", setObsManualEntries)} >
                                                    <CheckCircleOutlineIcon />
                                                </IconButton>
                                            }
                                            <IconButton onClick={() => handleDeleteObs(index)}>
                                                <HighlightOffIcon sx={{ color: "rgb(244, 67, 54)", fontSize: "25px" }} />
                                            </IconButton>
                                        </Box>
                                    </li>
                                ))}
                            </ul>

                            <Autocomplete
                                freeSolo
                                options={Clinicalnotes?.Observations
                                    ?.map((option) => option.description)
                                    .filter((desc) => !obsSelectedValues.includes(desc)) || []}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ fontSize: "13px", color: "#333" }}>
                                        {option}
                                    </li>
                                )}
                                onChange={handleSelectObs}
                                inputValue={obsInputValue}
                                onInputChange={(event, newValue) => {
                                    if (event && event.type === "change") {
                                        setObsInputValue(newValue);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={isFocused ? "" : "+ Type and hit enter to add"}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        sx={{
                                            width: "100%",
                                            "& input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                        InputLabelProps={{ sx: { fontSize: "13px" } }}
                                    />
                                )}
                            />
                        </AccordionDetails>
                    </Accordion>


                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ marginBottom: "15px" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography component="span" sx={{ width: '33%', flexShrink: 0, fontSize: "14px" }}>
                                Diagnoses
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <ul>
                                {diaSelectedValues.map((value, index) => (
                                    <li key={index} style={{ listStyleType: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontSize: "13px" }} >- {value}</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton>
                                                <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                            </IconButton>
                                            {diaManualEntries[value] === true &&
                                                <IconButton onClick={() => handleClickPost(value, "lpmyaw3v", setDiaManualEntries)}>
                                                    <CheckCircleOutlineIcon />
                                                </IconButton>
                                            }
                                            <IconButton onClick={() => handleDeleteDia(index)}>
                                                <HighlightOffIcon sx={{ color: "rgb(244, 67, 54)", fontSize: "25px" }} />
                                            </IconButton>
                                        </Box>
                                    </li>
                                ))}
                            </ul>

                            <Autocomplete
                                freeSolo
                                options={Clinicalnotes?.Diagnosis
                                    ?.map((option) => option.description)
                                    .filter((desc) => !diaSelectedValues.includes(desc)) || []}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ fontSize: "13px", color: "#333" }}>
                                        {option}
                                    </li>
                                )}
                                onChange={handleSelectdia}
                                inputValue={diaInputValue}
                                onInputChange={(event, newValue) => {
                                    if (event && event.type === "change") {
                                        setDiaInputValue(newValue);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={isFocused ? "" : "+ Type and hit enter to add"}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        sx={{
                                            width: "100%",
                                            "& input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                        InputLabelProps={{ sx: { fontSize: "13px" } }}
                                    />
                                )}
                            />
                        </AccordionDetails>
                    </Accordion>


                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ marginBottom: "15px" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography component="span" sx={{ width: '33%', flexShrink: 0, fontSize: "14px" }}>
                                Notes
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <ul>
                                {noteSelectedValues.map((value, index) => (
                                    <li key={index} style={{ listStyleType: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box>
                                            <Typography variant="body1" sx={{ fontSize: "13px" }} >- {value}</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton>
                                                <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                            </IconButton>
                                            {noteManualEntries[value] === true &&
                                                <IconButton onClick={() => handleClickPost(value, "am23biqb", setNoteManualEntries)}>
                                                    <CheckCircleOutlineIcon />
                                                </IconButton>
                                            }
                                            <IconButton onClick={() => handleDeleteNote(index)}>
                                                <HighlightOffIcon sx={{ color: "rgb(244, 67, 54)", fontSize: "25px" }} />
                                            </IconButton>
                                        </Box>
                                    </li>
                                ))}
                            </ul>

                            <Autocomplete
                                freeSolo
                                options={Clinicalnotes?.Notes
                                    ?.map((option) => option.description)
                                    .filter((desc) => !diaSelectedValues.includes(desc)) || []}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ fontSize: "13px" }}>
                                        {option}
                                    </li>
                                )}
                                onChange={handleSelectNote}
                                inputValue={noteInputValue}
                                onInputChange={(event, newValue) => {
                                    if (event && event.type === "change") {
                                        setNoteInputValue(newValue);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={isFocused ? "" : "+ Type and hit enter to add"}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        sx={{
                                            width: "100%",
                                            "& input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                        InputLabelProps={{ sx: { fontSize: "13px" } }}
                                    />
                                )}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Box sx={{ display: "flex", justifyContent: "end", gap: "15px" }}>
                        <Button sx={{ color: "black", backgroundColor: "#efefef", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }}>
                            Back
                        </Button>

                        <Button type="submit" onClick={handleSaveClinical} sx={{ color: "#fff", backgroundColor: "#0062DD", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }}>
                            Save clinical notes
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ClinicalNotes;