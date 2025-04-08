import React, { useState, useEffect } from "react";
import { Box, Typography, SvgIcon, IconButton, TextField, InputAdornment, OutlinedInput, MenuItem, Button } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from 'formik';
import { encryption } from "../utils";
import { getAppointmentDetails } from "../api/Appointment";
import { useDispatch } from "react-redux";
import { savePatientData } from "../redux/PatientsSlice";
import { Temperature } from "../consts/VitalsignNav";
import { unit } from "../consts/VitalsignNav";
import { BPunit } from "../consts/VitalsignNav";
import { TemperatureArea } from "../consts/VitalsignNav";
import { decryption } from "../utils";



dayjs.extend(utc);

const validationScheme = Yup.object({
    weight: Yup.number().required("weight is required*").min(1, "weight must be greater than 0").max(700, "weight can't be greater than 700"),
    Height: Yup.number().max(350, "Height cannot be greater than 350"),
    Systolic: Yup.number().min(50, "Systolic blood pressure cannot be less than 50").max(300, "Systolic blood pressure cannot be greater than 300"),
    Diastolic: Yup.number().min(25, "Diastolic blood pressure cannot be less than 25").max(200, "Diastolic blood pressure cannot be greater than 200"),
})

const VitalSign = () => {

    const [appointmentData, setAppointmentData] = useState([]);
    const [saveVitalSigns, setSaveVitalSigns] = useState([]);

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


    useEffect(() => {
        axios.get(
            `https://flash.lyf.yoga/files/charting/api/vitalSign/5kp6mpx8`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        )
            .then((response) => {
                const Descript = decryption(response);
                setSaveVitalSigns(Descript?.data)
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
            });
    }, []);


    const formik = useFormik({
        initialValues: {
            assignedOn: dayjs(),
            weight: saveVitalSigns?.weight ? Number(saveVitalSigns.weight) : "",
            weightUnit: "",
            bmi: "",
            bmiStatus: "",
            height: saveVitalSigns?.height ? Number(saveVitalSigns.height) : "",
            heightUnit: "",
            bpSys: "",
            bpDystole: "",
            bpUnit: "sitting",
            pulse: "",
            pulseUnit: "",
            respiratory: "",
            respiratoryUnit: "",
            temperature: "",
            temperatureUnit: "C",
            custUuid: "",
            leanBodyMass: "",
            fat: "",
            fatUnit: "",
            visceralFat: "",
            rateMetabolism: "",
            rateMetabolismUnit: "",
            neck: "",
            neckUnit: "inch",
            upperArmUnit: "inch",
            upperArm: "",
            chest: "",
            chestUnit: "inch",
            hip: "",
            hipUnit: "inch",
            waist: "",
            waistUnit: "inch",
            thigh: "",
            thighUnit: "inch",
            bodyFat: "",
            bodyAge: "",
        },
        validationSchema: validationScheme,
        onSubmit: async (values, { setSubmitting, setValues }) => {

            let decryptKey = encryption({
                bp: [
                    {
                        bpSys: values.bpSys ? Number(values.bpSys) : null,
                        bpDystole: values.bpDystole ? Number(values.bpDystole) : null,
                        bpUnit: "Sitting"
                    }
                ],
                pulse: values.pulse ? Number(values.pulse) : null,
                pulseUnit: "BPM",
                respiratory: values.respiratory ? Number(values.respiratory) : null,
                respiratoryUnit: "Breaths/min",
                temperature: values.temperature ? Number(values.temperature) : null,
                temperatureUnit: null,
                weight: values.weight ? Number(values.weight) : null,
                weightUnit: "kg",
                height: values.height ? Number(values.height) : null,
                heightUnit: "cm",
                bmi: values.bmi ? Number(values.bmi) : null,
                bmiStatus: values.bmiStatus ? values.bmiStatus : null,
                custUuid: "rkpcdske",
                leanBodyMass: values.leanBodyMass ? Number(values.leanBodyMass) : null,
                fat: values.fat ? Number(values.fat) : null,
                fatUnit: "%",
                visceralFat: values.visceralFat ? Number(values.visceralFat) : null,
                rateMetabolism: values.rateMetabolism ? Number(values.rateMetabolism) : null,
                rateMetabolismUnit: null,
                neck: values.neck ? Number(values.neck) : null,
                neckUnit: values.neckUnit ? values.neckUnit : null,
                upperArmUnit: values.upperArmUnit ? values.upperArmUnit : null,
                upperArm: values.upperArm ? Number(values.upperArm) : null,
                chest: values.chest ? Number(values.chest) : null,
                chestUnit: values.chestUnit ? values.chestUnit : null,
                hip: values.hip ? Number(values.hip) : null,
                hipUnit: values.hipUnit ? values.hipUnit : null,
                waist: values.waist ? Number(values.waist) : null,
                waistUnit: values.waistUnit ? values.waistUnit : null,
                thigh: values.thigh ? Number(values.thigh) : null,
                thighUnit: values.thighUnit ? values.thighUnit : null,
                bodyFat: values.bodyFat ? Number(values.bodyFat) : null,
                bodyAge: values.bodyAge ? Number(values.bodyAge) : null,
                tentUserUuid: "6f22fe5v",
                hipWaistRatio: null,
                fastingSugar: null,
                postPrandialSugar: null,
                cholestrol: null,
                thyroidHarmones: null,
                assignedOn: "2025-03-24 15:46:00"
            })
            try {
                const response = await axios.put(
                    "https://flash.lyf.yoga/files/charting/api/vitalSign/vvuyhq0v",
                    { data: decryptKey?.plainText },
                    {
                        headers: {
                            Internal: "LYFnGO",
                            "Accept": "application/json",
                            key: decryptKey?.publicKey,
                        }
                    }
                );
                alert("vital signs updated successfully!");
                setValues(values);
            } catch (error) {
                console.error("Error", error.response?.data || error.message);
                alert("Faild to update vital signs");
            } finally {
                setSubmitting(false);
            }
        }
    },
    )

    useEffect(() => {
        if (formik.values.weight && formik.values.height) {
            const heightInMeters = formik.values.height / 100;
            const bmi = formik.values.weight / (heightInMeters * heightInMeters);
            formik.setFieldValue("bmi", bmi.toFixed(3));
        }
    }, [formik.values.weight, formik.values.height]);

    //To calculate the BMI status
    useEffect(() => {
        if (formik.values.bmi) {
            let status = "";

            if (bmi < 18.5) {
                status = "Underweight";
            } else if (bmi < 25) {
                status = "Normal Weight";
            } else if (bmi < 30) {
                status = "Overweight";
            } else {
                status = "Obese";
            }

            formik.setFieldValue("bmiStatus", status);

        }
    }, [formik.values.bmi])

    return (

        <Box sx={{ padding: "15px" }}>

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
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>Mode <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>{item?.appointmentTypeMode?.charAt(0).toUpperCase() + item?.appointmentTypeMode?.slice(1)}</span></Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px", display: "flex", alignItems: "center", color: "rgb(136, 124, 227)", fontWeight: "600" }}><FiberManualRecordIcon sx={{ fontSize: "16px", color: "rgb(136, 124, 227)" }} /> {item?.appointmentModeStatus?.charAt(0).toUpperCase() + item?.appointmentModeStatus?.slice(1)}</Typography>
                        <Typography variant="h6" sx={{ color: "#727272", fontSize: "14px" }}>Appointment No  <span style={{ color: "#000", fontWeight: "500", marginLeft: "8px" }}>{item?.appointmentNumber}</span></Typography>
                    </Box>
                </Box>
            ))}

            <Box sx={{ padding: "20px" }}>
                <Box>
                    <form onSubmit={formik.handleSubmit}>
                        <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    id="assignedOn"
                                    name="assignedOn"
                                    value={formik.values.assignedOn}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    size="small"
                                    sx={{
                                        width: "220px", fontSize: "15px",
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            fullWidth
                                            size="small"
                                            sx={{ width: "100px" }}
                                        />}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Weight *</Typography>
                                <Box>
                                    <OutlinedInput
                                        id="outlined-adornment-weight"
                                        name="weight"
                                        value={formik.values.weight}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <span style={{ fontSize: "13px", color: "gray" }}>kg</span>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                        size="small"
                                        inputProps={{
                                            'aria-label': 'weight',
                                            placeholder: 'weight(kg)',
                                            maxLength: 5
                                        }}
                                        sx={{
                                            width: "150px",
                                            height: "35px",
                                            "& input::placeholder": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                    {formik.touched.weight && formik.errors.weight && (
                                        <Box sx={{ color: "red", fontSize: "12px" }}>
                                            {formik.errors.weight}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Height</Typography>
                                <Box>
                                    <OutlinedInput
                                        id="height"
                                        name="height"
                                        value={formik.values.height}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <span style={{ fontSize: "13px", color: "gray" }}>cm</span>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                        size="small"
                                        inputProps={{
                                            placeholder: 'Height',
                                            maxLength: 5
                                        }}
                                        sx={{
                                            width: "150px",
                                            height: "35px",
                                            "& input::placeholder": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                    {formik.touched.height && formik.errors.height && (
                                        <Box sx={{ color: "red", fontSize: "12px" }}>
                                            {formik.errors.height}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>BMI</Typography>
                                <Box>
                                    <OutlinedInput
                                        id="bmi"
                                        name="bmi"
                                        value={formik.values.bmi}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-describedby="outlined-weight-helper-text"
                                        size="small"
                                        inputProps={{
                                            'aria-label': 'weight',
                                            placeholder: 'BMI',
                                            readOnly: true,
                                        }}
                                        sx={{
                                            width: "150px",
                                            height: "35px",
                                            "& input::placeholder": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>BMI status</Typography>
                                <Box>
                                    <OutlinedInput
                                        id="bmiStatus"
                                        name="bmiStatus"
                                        value={formik.values.bmiStatus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-describedby="outlined-weight-helper-text"
                                        size="small"
                                        sx={{
                                            width: "150px",
                                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                            boxShadow: "none",
                                            backgroundColor: "transparent",
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                        inputProps={{
                                            'aria-label': 'weight',
                                            readOnly: true,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Blood Pressure</Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "8px" }}>
                                <Box>
                                    <OutlinedInput
                                        id="bpSys"
                                        name="bpSys"
                                        value={formik.values.bpSys}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <span style={{ fontSize: "13px", color: "gray" }}>mmHg</span>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                        size="small"
                                        inputProps={{
                                            'aria-label': 'weight',
                                            placeholder: 'Systolic',
                                            maxLength: 10
                                        }}
                                        sx={{
                                            width: "190px",
                                            height: "35px",
                                            "& input::placeholder": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                    {formik.touched.bpSys && formik.errors.bpSys && (
                                        <Box sx={{ color: "red", fontSize: "12px" }}>
                                            {formik.errors.bpSys}
                                        </Box>
                                    )}
                                </Box>
                                <Box>
                                    <OutlinedInput
                                        id="bpDystole"
                                        name="bpDystole"
                                        value={formik.values.bpDystole}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <span style={{ fontSize: "13px", color: "gray" }}>mmHg</span>
                                            </InputAdornment>
                                        }
                                        aria-describedby="outlined-weight-helper-text"
                                        size="small"
                                        inputProps={{
                                            'aria-label': 'weight',
                                            placeholder: 'Distolic',
                                            maxLength: 10
                                        }}
                                        sx={{
                                            width: "190px",
                                            height: "35px",
                                            "& input::placeholder": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                    {formik.touched.bpDystole && formik.errors.bpDystole && (
                                        <Box sx={{ color: "red", fontSize: "12px" }}>
                                            {formik.errors.bpDystole}
                                        </Box>
                                    )}
                                </Box>
                                <Box>
                                    <TextField
                                        id="bpUnit"
                                        name="bpUnit"
                                        value={formik.values.bpUnit}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        select
                                        label="BPunit"
                                        sx={{
                                            width: "190px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    >
                                        {BPunit.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </Box>

                            <Box>
                                <Button sx={{ color: "#fff", padding: "4px 20px", backgroundColor: "#0062DD", borderRadius: "25px", marginTop: "18px", textTransform: "none" }}>
                                    <SvgIcon sx={{ fontSize: 22, marginRight: "5px" }}>
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
                                    </SvgIcon>
                                    <span>Add</span>
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: "18px" }}>
                            <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Pulse</Typography>
                            <Box>
                                <OutlinedInput
                                    id="pulse"
                                    name="pulse"
                                    value={formik.values.pulse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <span style={{ fontSize: "13px", color: "gray" }}>Heart beats/min</span>
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    size="small"
                                    inputProps={{
                                        'aria-label': 'weight',
                                        placeholder: 'Pulse(Heart beats/min)',
                                        maxLength: 5
                                    }}
                                    sx={{
                                        width: "400px",
                                        height: "35px",
                                        "& input::placeholder": {
                                            fontSize: "13px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Temperature</Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: "8px" }}>
                                <Box>
                                    <TextField
                                        id="temperature"
                                        name="temperature"
                                        value={formik.values.temperature}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Temp"
                                        sx={{
                                            width: "110px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "13px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                paddingLeft: "20px"
                                            },
                                        }}
                                        inputProps={{ maxLength: 5 }}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        id="temperatureUnit"
                                        name="temperatureUnit"
                                        value={formik.values.temperatureUnit}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        select
                                        label="Temp unit"
                                        sx={{
                                            width: "80px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                fontSize: "13px",
                                            },
                                            fontSize: "10px"
                                        }}
                                    >
                                        {Temperature.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Temperature area"
                                        defaultValue="Axillary(Armpit)"
                                        sx={{
                                            width: "220px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    >
                                        {TemperatureArea.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: "18px" }}>
                            <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Respiration rate </Typography>
                            <Box>
                                <OutlinedInput
                                    id="outlined-adornment-respiratory"
                                    name="respiratory"
                                    value={formik.values.respiratory}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <span style={{ fontSize: "13px", color: "gray" }}>Breaths/min</span>
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    size="small"
                                    inputProps={{
                                        'aria-label': 'weight',
                                        placeholder: 'Respiration rate',
                                        maxLength: 5
                                    }}
                                    sx={{
                                        width: "400px",
                                        height: "35px",
                                        "& input::placeholder": {
                                            fontSize: "13px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Fat</Typography>
                                <Box>
                                    <TextField
                                        id="fat"
                                        name="fat"
                                        value={formik.values.fat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        placeholder="Enter fat"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <OutlinedInput
                                    name="fatUnit"
                                    value={formik.values.fatUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="%"
                                    readOnly
                                    sx={{
                                        width: "170px",
                                        height: "35px",
                                        "& .MuiInputBase-input::placeholder": {
                                            fontSize: "13px",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ marginTop: "18px" }}>
                            <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Visceral Fat </Typography>
                            <Box>
                                <TextField
                                    id="visceralFat"
                                    name="visceralFat"
                                    value={formik.values.visceralFat}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    placeholder="Enter fat"
                                    variant="outlined"
                                    slotProps={{
                                        inputLabel: {
                                            shrink: false,
                                        },
                                    }}
                                    sx={{
                                        width: "200px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "14px",
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            fontSize: "13px",
                                        },
                                    }}
                                />
                            </Box>
                        </Box>


                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Metabolic rate</Typography>
                                <Box>
                                    <TextField
                                        id="rateMetabolismr"
                                        name="rateMetabolism"
                                        value={formik.values.rateMetabolism}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        placeholder="Enter Metabolic rate"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <OutlinedInput
                                    placeholder="Enter unit"
                                    name="rateMetabolismUnit"
                                    value={formik.values.rateMetabolismUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        width: "170px",
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
                        </Box>


                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Neck</Typography>
                                <Box>
                                    <TextField
                                        name="neck"
                                        value={formik.values.neck}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="outlined-number"
                                        type="number"
                                        placeholder="Enter neck"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <TextField
                                    id="neckUnit"
                                    name="neckUnit"
                                    value={formik.values.neckUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    select
                                    defaultValue="inch"
                                    sx={{
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>


                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>upper arm</Typography>
                                <Box>
                                    <TextField
                                        name="upperArm"
                                        value={formik.values.upperArm}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="upperArm"
                                        type="number"
                                        placeholder="Enter upper arm"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <TextField
                                    name="upperArmUnit"
                                    value={formik.values.upperArmUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="upperArmUnit"
                                    select
                                    defaultValue="inch"
                                    sx={{
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>


                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>chest</Typography>
                                <Box>
                                    <TextField
                                        name="chest"
                                        value={formik.values.chest}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        id="chest"
                                        type="number"
                                        placeholder="Enter chest"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <TextField
                                    name="chestUnit"
                                    value={formik.values.chestUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="chestUnit"
                                    select
                                    defaultValue="inch"
                                    sx={{
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Hip</Typography>
                                <Box>
                                    <TextField
                                        id="hip"
                                        name="hip"
                                        value={formik.values.hip}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        placeholder="Enter Hip"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <TextField
                                    id="hipUnit"
                                    name="hipUnit"
                                    value={formik.values.hipUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    select
                                    defaultValue="inch"
                                    sx={{
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>


                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>waist</Typography>
                                <Box>
                                    <TextField
                                        id="waist"
                                        name="waist"
                                        value={formik.values.waist}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        placeholder="Enter waist"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <TextField
                                    id="waistUnit"
                                    name="waistUnit"
                                    value={formik.values.waistUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    select
                                    defaultValue="inch"
                                    sx={{
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>


                        <Box sx={{ display: "flex", gap: "14px", marginTop: "18px" }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Thigh</Typography>
                                <Box>
                                    <TextField
                                        id="thigh"
                                        name="thigh"
                                        value={formik.values.thigh}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        placeholder="Enter Thigh"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false,
                                            },
                                        }}
                                        sx={{
                                            width: "260px",
                                            "& .MuiInputBase-root": {
                                                height: "35px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                fontSize: "13px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Unit</Typography>
                                <TextField
                                    id="thighUnit"
                                    name="thighUnit"
                                    value={formik.values.thighUnit}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    select
                                    defaultValue="inch"
                                    sx={{
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "35px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {unit.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>


                        <Box sx={{ marginTop: "18px" }}>
                            <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Body fat</Typography>
                            <OutlinedInput
                                name="bodyFat"
                                value={formik.values.bodyFat}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter body fat"
                                sx={{
                                    width: "260px",
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

                        <Box sx={{ marginTop: "18px" }}>
                            <Typography variant="body2" sx={{ fontWeight: "400", paddingBottom: "8px", fontSize: "13px" }}>Body age</Typography>
                            <OutlinedInput
                                name="bodyAge"
                                value={formik.values.bodyAge}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter body age"
                                sx={{
                                    width: "260px",
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

                        <Box sx={{ width: "100%", display: "flex", justifyContent: "end", paddingBlock: "8px" }}>
                            <Button type="submit" sx={{ color: "#fff", padding: "4px 20px", boxShadow: "none", borderRadius: "25px", textTransform: "none", backgroundColor: "#0062DD" }}>
                                Save Vital signs
                                <SvgIcon >
                                    <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </SvgIcon>
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box >
    )
}



export default VitalSign;