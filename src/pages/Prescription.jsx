import React, { useState, useEffect } from "react";
import { Box, Typography, SvgIcon, IconButton, Button, TextField, MenuItem, Table, TableCell, TableHead, TableRow, InputAdornment, Autocomplete, TableBody } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from "axios";
import { Intake, PrescriptionOption, Type } from "../consts/PrescriptionNav";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { getAppointmentDetails } from "../api/Appointment";
import { useDispatch } from "react-redux";
import { savePatientData } from "../redux/PatientsSlice";



const Prescription = () => {

    const [selectedValue, setSelectedValue] = useState(null);
    const [optionType, setOptionType] = useState(null);
    const [showDetails, setShowDetails] = useState(null);

    const [dietList, setDietList] = useState([]);
    const [dietLifeStyle, setDietLifeStyle] = useState(null);

    const [drugName, setDrugName] = useState([]);
    const [drugSelected, setDrugSelected] = useState(null);
    const [templateSelected, setTemplateSelected] = useState(null);

    const [formValues, setFormValues] = useState({
        morn: "",
        noon: "",
        night: "",
        duration: "",
        ManufacturerName: "",
        Type: "Days",
        Addintake: "After food",
    });
    const [appointmentData, setAppointmentData] = useState([]);

    const appointmentUuid = appointmentData[0]?.appointmentUuid

    const dispatch = useDispatch();

    console.log("dietList",dietList)
    
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


    //To get the value and Add the values to formvalues
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    //To add details to the tabel
    const handleAddDetail = () => {
        if (!drugSelected || !formValues.morn || !formValues.noon || !formValues.night || !formValues.duration) {
            alert("please fill the details");
            return;
        }

        const newEntry = {
            drugName: drugSelected.drugName,
            manufactureName: drugSelected?.inventoryItems?.[0]?.manufactureName || "-",
            morning: formValues.morn,
            noon: formValues.noon,
            night: formValues.night,
            beforeFood: formValues.Addintake,
            duration: formValues.duration,
            durationUnit: formValues.Type,
        }

        setShowDetails((prev) => [
            ...(prev || []),
            newEntry
        ]);


        setDrugSelected(null);
        setFormValues({ morn: "", noon: "", night: "", duration: "" });
    };

    //To remove the selected diet lifestyle
    const handleDelete = (indexToRemove) => {
        setDietList(dietList.filter((_, index) => index !== indexToRemove));
    };

    //To remove the selected prescription
    const handleDeletePre = (indexToRemove) => {
        setShowDetails(showDetails.filter((_, index) => index !== indexToRemove));
    };

    //API to get diet life style
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/charting/api/ePrescribe/ayurvedic/getLifeStyleDropdown/jzxph5ql?search=",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setDietLifeStyle(response?.data?.data?.ayurvedicDropdownInstructions);
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, []);


    //API to get the Drug and Template names
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/charting/api/ePrescribe/getTemplateInventory/dropdown/for/jzxph5ql/6f22fe5v?searchKey=",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setDrugName(response?.data?.data);
            })
            .catch((error) => {
                console.error("Error fetching data drugname :", error.message);
            });
    }, []);
    const Template = drugName?.templatesDropdownResponse;
    const Drugs = drugName?.inventoryDropdownResponse;


    //API to get the details of the prescription to show in the tabel
    useEffect(() => {
        axios.get(`https://flash.lyf.yoga/files/charting/api/ePrescribe/${appointmentUuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setShowDetails(response?.data?.data?.getPrescriptionDtoList);
                setDietList(response?.data?.data?.globalInstruction)
            })
            .catch((error) => {
                console.error("Error fetching data drugname :", error.message);
            });
    }, [appointmentUuid]);


    //this is to save the updated changes in the prescription
    const handleClickPost = async () => {

        try {
            const formattedPrescriptions = showDetails.map((item) => ({
                customDosage: null,
                dosageFour: item?.dosageFour || null,
                drugName: item?.drugName || "",
                duration: item?.duration || "",
                durationUnit: item?.Type || "Days",
                eprescribeUuid: "zix5z5ns",
                frequency: "1",
                instruction: item?.instruction || "",
                isDefault: false,
                itemUuid: item?.itemUuid || "",
                manufactureName: item?.manufactureName || "-",
                morning: item?.morning || "0",
                noon: item?.noon || "0",
                night: item?.night || "0",
                removed: false,
                strength: item?.strength || "",
                strengthUnit: item?.strengthUnit || "",
            }))


            const payload = {
                globalInstruction: dietList.map(item => item) || "",
                isDraft: false,
                isMailSend: true,
                isNotifiedPrescription: true,
                updatePrescriptionDtoList: formattedPrescriptions,
            };

            const response = await axios.put(
                `https://flash.lyf.yoga/files/charting/api/ePrescribe/${appointmentUuid}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                    },
                }

            );
            alert("Prescription updated successfully!");
        } catch (error) {
            console.error("API Error:", error);
            alert("Faild to update Prescription");
        }
    }


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
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px", display: "flex", alignItems: "center", color: "rgb(136, 124, 227)", fontWeight: "600" }}><FiberManualRecordIcon sx={{ fontSize: "16px", color: "rgb(136, 124, 227)" }} />{item?.appointmentModeStatus?.charAt(0).toUpperCase() + item?.appointmentModeStatus?.slice(1)}</Typography>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>Appointment No  <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>{item?.appointmentNumber}</span></Typography>
                    </Box>
                </Box>
            ))}

            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "30px" }}>
                    <Box>
                        <FormControl sx={{ width: "100%" }}>
                            <Autocomplete
                                options={PrescriptionOption}
                                getOptionLabel={(option) => option.option}
                                value={optionType ? PrescriptionOption.find(opt => opt.option === optionType) || null : null}
                                onChange={(event, newValue) => setOptionType(newValue ? newValue.option : "")}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ fontSize: "13px", padding: "8px 12px", color: "black" }}>
                                        {option.option}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder={!selectedValue ? "Option Type" : ""}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                height: "38px",
                                                width: "300px",
                                                fontSize: "14px",
                                            },
                                            "& input::placeholder": { fontSize: "13px", color: "gray" },
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                    </Box>

                    <Button sx={{ color: "#fff", backgroundColor: "#0062DD", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }}>
                        Load prescription details
                    </Button>
                </Box>



                <Box sx={{ marginTop: "20px" }}>
                    <Box>
                        <Box sx={{ display: optionType === "Template" ? "block" : "none" }}>
                            <FormControl sx={{ width: "100%" }}>
                                <Autocomplete
                                    options={Template}
                                    getOptionLabel={(option) => option.drugName}
                                    value={templateSelected}
                                    onChange={(event, newValue) => {
                                        setTemplateSelected(newValue);
                                    }}
                                    renderOption={(props, option) => (
                                        <li {...props} style={{ fontSize: "13px", padding: "8px 12px" }}>
                                            {option.instructionsName}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="search Template"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    height: "40px",
                                                    width: "300px",
                                                    fontSize: "14px",
                                                },
                                                "& input::placeholder": { fontSize: "13px", color: "gray" },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Box>

                        <Box sx={{ display: optionType === "Drug" ? "block" : "none" }}>
                            <FormControl sx={{ width: "100%" }}>
                                <Autocomplete
                                    options={Drugs}
                                    getOptionLabel={(option) => option.drugName}
                                    value={drugSelected}
                                    onChange={(event, newValue) => {
                                        setDrugSelected(newValue);
                                    }}
                                    renderOption={(props, option) => (
                                        <li {...props} style={{ fontSize: "12px", padding: "8px 12px" }}>
                                            {option.drugName}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder={"search & add Drug"}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    height: "40px",
                                                    width: "300px",
                                                    fontSize: "14px",
                                                },
                                                "& input::placeholder": { fontSize: "13px", color: "gray" },
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ display: drugSelected ? "block" : "none" }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "50px", paddingInline: "30px" }}>
                            <Box>
                                <Typography variant="body1" sx={{ fontSize: "13px" }}>Drug</Typography>
                                <span style={{ fontSize: "13px" }}>{drugSelected ? drugSelected.drugName : ""}</span>
                            </Box>
                            <Box>
                                <Box sx={{ display: "flex", gap: "10px" }}>
                                    <Typography variant="body2" sx={{ fontSize: "13px" }}>Dosage & Frequency</Typography>
                                    <Button sx={{ color: "#29BDD6", textDecoration: "underline", textTransform: "none", padding: "0px" }}>Default</Button>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Box>
                                        <OutlinedInput
                                            name="morn"
                                            placeholder="Morn"
                                            value={formValues.morn}
                                            onChange={handleChange}
                                            sx={{
                                                width: "70px",
                                                height: "35px",
                                                "& .MuiOutlinedInput-input": {
                                                    fontSize: "14px",
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    fontSize: "13px",
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <OutlinedInput
                                            name="noon"
                                            placeholder="Noon"
                                            value={formValues.noon}
                                            onChange={handleChange}
                                            sx={{
                                                width: "70px",
                                                height: "35px",
                                                "& .MuiOutlinedInput-input": {
                                                    fontSize: "14px",
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    fontSize: "13px",
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <OutlinedInput
                                            name="night"
                                            placeholder="Night"
                                            value={formValues.night}
                                            onChange={handleChange}
                                            sx={{
                                                width: "70px",
                                                height: "35px",
                                                "& .MuiOutlinedInput-input": {
                                                    fontSize: "14px",
                                                },
                                                "& .MuiInputBase-input::placeholder": {
                                                    fontSize: "13px",
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="boday2" sx={{ fontSize: "13px" }}>Tablet(s)</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: "10px" }}>
                                <Box sx={{ marginTop: "-15PX" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                        <Typography variant="body2" sx={{ fontSize: "13px" }}>InTake</Typography>
                                        <Button sx={{ color: "#29BDD6", textDecoration: "underline", textTransform: "none" }}>Add Instructions</Button>
                                    </Box>
                                    <Box>
                                        <TextField
                                            id="Addintake"
                                            name="Addintake"
                                            select
                                            label="Add intake"
                                            value={formValues.Addintake}
                                            onChange={handleChange}
                                            sx={{
                                                width: "200px",
                                                "& .MuiInputBase-root": {
                                                    height: "35px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                    fontSize: "13px",
                                                },
                                            }}
                                        >
                                            {Intake.map((Add) => (
                                                <MenuItem key={Add.option} value={Add.option} sx={{ fontSize: "13px" }}>
                                                    {Add.option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Duration *</Typography>
                                    <OutlinedInput
                                        name="duration"
                                        value={formValues.duration}
                                        onChange={handleChange}
                                        sx={{
                                            width: "70px",
                                            height: "35px",
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ marginTop: "25px" }}>
                                    <TextField
                                        id="Type"
                                        name="Type"
                                        select
                                        label="Type"
                                        defaultValue="Days"
                                        value={formValues.Type || "Days"}
                                        onChange={handleChange}
                                        sx={{
                                            width: "100px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    >
                                        {Type.map((Add) => (
                                            <MenuItem key={Add.option} value={Add.option} sx={{ fontSize: "13px" }}>
                                                {Add.option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <Box sx={{ marginTop: "5px" }}>
                                    <Button onClick={handleAddDetail} sx={{ color: "#fff", padding: "4px 20px", backgroundColor: "#0062DD", borderRadius: "25px", marginTop: "18px", textTransform: "none" }}>
                                        <SvgIcon sx={{ fontSize: 22, marginRight: "5px" }}>
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
                                        </SvgIcon>
                                        <span>Add</span>
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ marginTop: "10px", marginLeft: "200px" }}>
                            <TextField
                                name="ManufacturerName"
                                label="Manufacturer Name"
                                value={drugSelected?.inventoryItems?.[0]?.manufactureName || "-"}
                                onChange={handleChange}
                                sx={{
                                    width: "250px",
                                    "& .MuiInputBase-root": {
                                        height: "35px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        fontSize: "13px",
                                    },
                                    "& .MuiInputLabel-root": {
                                        fontSize: "12px",
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>


                <Box sx={{ marginTop: "60px" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                            <TableRow sx={{ color: "#000" }}>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Drug</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Manufacturer name</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Dosage & Frequency</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Intake</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Duration</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {showDetails?.length > 0 ? (
                                showDetails.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.drugName}</TableCell>
                                        <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.manufactureName ? item?.manufactureName : "-"}</TableCell>
                                        <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                            {item?.morning ? item?.morning : 0} -
                                            {item?.noon ? item?.noon : 0} -
                                            {item?.night ? item?.night : 0}
                                        </TableCell>
                                        <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.beforeFood === true ? "Before food" : "-" || flase ? "After food" : "-"}</TableCell>
                                        <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.duration} {item?.durationUnit}</TableCell>
                                        <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                            <IconButton>
                                                <EditIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                            </IconButton>
                                            <IconButton sx={{ color: "rgb(244, 67, 54)" }} onClick={() => handleDeletePre(index)}>
                                                <HighlightOffIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="h6" sx={{ fontSize: "18px", textAlign: "center", paddingBlock: "10px" }}>No data found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "100px" }}>
                <Box>
                    <FormControlLabel control={<Checkbox />} label="Prescription Mail notifications"
                        sx={{
                            "& .MuiFormControlLabel-label": {
                                fontSize: "13px",
                            },
                        }} />
                </Box>
                <Box>
                    <FormControlLabel control={<Checkbox />} label="Send to pharmacist"
                        sx={{
                            "& .MuiFormControlLabel-label": {
                                fontSize: "13px",
                            },
                        }} />
                </Box>
            </Box>

            <Box sx={{ marginTop: "30px" }}>
                <FormControl sx={{ width: "100%" }}>
                    <Autocomplete
                        options={dietLifeStyle}
                        getOptionLabel={(option) => option.instructionsName}
                        value={selectedValue}
                        onChange={(event, newValue) => {
                            setSelectedValue(newValue);
                            if (newValue && !dietList.some(item => item.instructionsName === newValue)) {
                                setDietList((prevDiet) => [...prevDiet, newValue.instructionsName])
                            }
                        }}
                        renderOption={(props, option) => (
                            <li {...props} style={{ fontSize: "13px", padding: "8px 12px" }}>
                                {option.instructionsName}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder={!selectedValue ? "Diet/Lifestyle instruction" : ""}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: "40px",
                                        fontSize: "14px",
                                    },
                                    "& input::placeholder": { fontSize: "13px", color: "gray" },
                                }}
                            />
                        )}
                    />
                </FormControl>
            </Box>

            <Box sx={{ marginTop: "40px" }}>
                <Box sx={{ border: "1px solid #ccc", padding: "12px", borderRadius: "4px" }}>
                    <span style={{ color: "#00000061", fontWeight: "400", fontSize: "13px" }}>
                        Diet/Lifestyle instruction
                    </span>
                    <Box sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}>
                        <Box>
                            <ul>
                                {dietList.map((item, index) => (
                                    <li key={item.uuid} style={{ fontSize: "13px" }}>{item} <Button sx={{ color: "rgb(244, 67, 54)" }} onClick={() => handleDelete(index)}> <HighlightOffIcon /> </Button></li>
                                ))}
                            </ul>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "8px", mt: 4 }}>
                <Button sx={{ color: "black", background: "#efefef", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }}>
                    Back
                </Button >
                <Button sx={{ color: "#fff", background: "#0062DD", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }}>
                    save
                </Button>
                <Button sx={{ color: "#fff", background: "#0062DD", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }} onClick={handleClickPost}>
                    save and send
                </Button>
            </Box>
        </Box>
    )
}


export default Prescription;