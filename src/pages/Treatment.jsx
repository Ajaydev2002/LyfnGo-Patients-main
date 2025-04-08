import React, { useState, useEffect } from "react";
import { Box, Typography, SvgIcon, IconButton, Button, TextField, MenuItem, Autocomplete, FormControl, InputLabel, OutlinedInput, TableHead, TableRow, TableCell, Table, TableBody } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from "axios";
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getAppointmentDetails } from "../api/Appointment";
import { useDispatch } from "react-redux";
import { savePatientData } from "../redux/PatientsSlice";


const Treatment = () => {

    const [treatmentList, setTreatmentList] = useState([]);
    const [discountType, setDiscountType] = useState([]);
    const [tabelTreatment, setTabelTreatment] = useState([]);
    const [treatmentTax, setTreatmentTax] = useState([]);
    const [selectedTax, setSelectedTax] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);
    const [selectedTreatmentName, setSelectedTreatmentName] = useState(null);
    const [treatmentformValues, setTreatmentFormValues] = useState({
        unit: "1",
        price: "",
        Discount: "",
        discountUnit: { currency: "%" },
        taxInfo: [],
    });
    const [appointmentData, setAppointmentData] = useState([]);

    const dispatch = useDispatch();

    const appointmentUuid = appointmentData[0]?.appointmentUuid

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


    const handleClickPost = async () => {

        try {
            const formattedPrescriptions = tabelTreatment.map((item) => ({
                cost: item?.cost || null,
                discount: item?.discount || null,
                discountUnit: item?.discountUnit?.currency || null,
                mastTentUuid: "jzxph5ql",
                notes: "",
                qty: item?.qty || null,
                removed: false,
                tax: item?.tax || 0,
                taxInfoList: item?.taxInfo?.length
                    ? item.taxInfo.map((tax) => ({
                        taxName: tax.taxName,
                        taxPercent: tax.taxPercent,
                        taxUuid: tax.taxUuid || 0,
                    }))
                    : [],
                total: item?.total || 0,
                treatmentCatalogUuid: item?.uuid || null,
                treatmentName: item?.treatmentName || null,
                treatmentUuid: item?.uuid || null,
            }))


            const payload = formattedPrescriptions;

            const response = await axios.put(
                `https://flash.lyf.yoga/files/charting/api/treatmentPlan/${appointmentUuid}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                    },
                }
            );
            alert("Treatment updated successfully!");

        } catch (error) {
            console.error("API Error:", error);
            alert("Faild to update Treatment");
        }
    }

    //To add details to the tabel from the input field
    const handleAddDetail = () => {

        if (!selectedTreatmentName || !treatmentformValues.unit || !treatmentformValues.price) {
            alert("please fill the details");
            return;
        }

        const { unit, price, Discount, discountUnit, taxInfo = [] } = treatmentformValues;


        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(Discount) || 0;

        if (discountUnit.currency === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = taxInfo.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        console.log("taxinfo", taxInfo);

        const newEntry = {
            treatmentName: selectedTreatmentName.tentProcedureCatalogName,
            qty: treatmentformValues?.unit,
            cost: treatmentformValues?.price,
            discount: treatmentformValues?.Discount,
            discountUnit: { currency: treatmentformValues?.discountUnit.currency },
            taxInfo: treatmentformValues?.taxInfo?.map((tax) => ({
                taxName: tax.taxName,
                taxPercent: tax.taxPercent,
            })) || [],
            total: priceWithTax,
        }

        setTabelTreatment((prev) => {
            const alreadyExists = prev.some(item => item.treatmentName === newEntry.treatmentName);
            if (alreadyExists) return prev;
            return [...prev, newEntry];
        });
    };

    //To update the price to the form - from the selected input
    useEffect(() => {
        if (selectedTreatmentName) {
            setTreatmentFormValues((prevValues) => ({
                ...prevValues,
                price: selectedTreatmentName.tentProcedureCatalogPrice || "",
            }));
        }
    }, [selectedTreatmentName]);


    //to update the tax from input to formvalues
    const handleTaxUpdate = (selectedTaxes) => {
        setTreatmentFormValues((prevValues) => ({
            ...prevValues,
            taxInfo: selectedTaxes.map((tax) => ({
                taxName: tax.taxName,
                taxPercent: tax.taxPercent,
            })),
        }));
    };

    //To update the formvalue when input changes 
    const handleChange = (event) => {
        const { name, value } = event.target;
        setTreatmentFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    //To update the discountunit to the formvalue
    const handleDiscountChange = (newDiscountType) => {
        setTreatmentFormValues((prevValues) => ({
            ...prevValues,
            discountUnit: {
                ...prevValues.discountUnit,
                currency: newDiscountType,
            },
        }));
    };

    //API to get the tretmentlist to display
    useEffect(() => {
        axios.get(`https://flash.lyf.yoga/files/settings/api/treatmentCatalog/findTreatmentPlan/${appointmentUuid}/jzxph5ql`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setTreatmentList(response?.data?.data?.getTreatmentCatalogList)
            })
            .catch((error) => {
                console.error("Error fetching data lab order test", error.message)
            })
    }, [appointmentUuid])

    //APi to get discount type
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/charting/BillingOrder/get/tentCurrency/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setDiscountType(response?.data?.data?.tentMasterCurrency)
            })
            .catch((error) => {
                console.error("Error fetching data lab order test", error.message)
            })
    }, [])

    //API to get the details of Treatment to display in tabel
    useEffect(() => {
        axios.get(`https://flash.lyf.yoga/files/charting/api/treatmentPlan/${appointmentUuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setTabelTreatment(response?.data?.data?.getTreatmentPlanDtoList)
            })
            .catch((error) => {
                console.error("Error fetching data lab order test", error.message)
            })
    }, [appointmentUuid]);

    //API to get treatment tax
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/settings/taxManagementByTentId/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                }
            }
        )
            .then((response) => {
                setTreatmentTax(response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching data discountType", error.message)
            })
    }, [])

    //To delete the selected row from the tabel
    const handleDelete = (indexToRemove) => {
        setTabelTreatment(tabelTreatment.filter((_, index) => index !== indexToRemove));
    };

    //To calculate the total Price
    useEffect(() => {
        const { unit, price, Discount, discountUnit, taxInfo = [] } = treatmentformValues;

        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(Discount) || 0;

        if (discountUnit.currency === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = taxInfo.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        setTotalPrice(priceWithTax.toFixed(2));
    }, [treatmentformValues]);


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

            <Box sx={{ mt: 3, width: "100%" }}>
                <FormControl sx={{ width: "100%" }}>
                    <Autocomplete
                        options={treatmentList}
                        getOptionLabel={(option) => option.tentProcedureCatalogName}
                        value={selectedTreatmentName || null}
                        onChange={(event, newValue) => {
                            setSelectedTreatmentName(newValue);
                        }}
                        renderOption={(props, option) => (
                            <li {...props} style={{ fontSize: "13px", padding: "8px 12px", color: "black" }}>
                                {option.tentProcedureCatalogName}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder={"search Treatment Name"}
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

            <Box sx={{ display: selectedTreatmentName ? "block" : "none" }}>
                <Box sx={{ display: "flex", width: "100%" }}>
                    <Box sx={{ flexBasis: "16.6667%", flexGrow: "0", maxWidth: "16.6667%", display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "14px" }}>Procedure</Typography>
                        <Typography variant="span" sx={{ fontWeight: "400", fontSize: "14px" }} >{selectedTreatmentName ? selectedTreatmentName.tentProcedureCatalogName : ""}</Typography>
                    </Box>

                    <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Unit</Typography>
                        <Box sx={{ marginTop: "8px" }}>
                            <TextField
                                id="unit"
                                name="unit"
                                type="number"
                                value={treatmentformValues.unit}
                                onChange={handleChange}
                                placeholder="Qty"
                                variant="outlined"
                                slotProps={{
                                    inputLabel: {
                                        shrink: false,
                                    },
                                }}
                                sx={{
                                    width: "70px",
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

                    <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }} >
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Price(INR)</Typography>
                        <Box sx={{ marginTop: "8px" }}>
                            <TextField
                                id="price"
                                name="price"
                                type="number"
                                value={treatmentformValues.price}
                                onChange={handleChange}
                                placeholder="Price"
                                variant="outlined"
                                slotProps={{
                                    inputLabel: {
                                        shrink: false,
                                    },
                                }}
                                sx={{
                                    width: "90px",
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

                    <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Discount</Typography>
                        <Box sx={{ marginTop: "8px" }}>
                            <TextField
                                id="Discount"
                                name="Discount"
                                type="number"
                                value={treatmentformValues.Discount}
                                onChange={handleChange}
                                placeholder="Discount"
                                variant="outlined"
                                slotProps={{
                                    inputLabel: {
                                        shrink: false,
                                    },
                                }}
                                sx={{
                                    width: "100px",
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

                    <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Discount type</Typography>
                        <Box sx={{ marginTop: "8px" }}>
                            <TextField
                                id="discountUnit"
                                name="discountUnit"
                                value={treatmentformValues.discountUnit.currency}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                select
                                defaultValue="%"
                                sx={{
                                    width: "130px",
                                    "& .MuiInputBase-root": {
                                        height: "35px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        fontSize: "13px",
                                    },
                                }}
                            >
                                {discountType.map((option, index) => (
                                    <MenuItem key={index} value={option.currency}>
                                        {option.currency}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>

                    <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Tax</Typography>
                        <Box sx={{ marginTop: "8px" }}>
                            <FormControl sx={{ width: 170 }}>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={selectedTax}
                                    onChange={(event) => {
                                        const selectedValues = event.target.value;
                                        setSelectedTax(selectedValues);
                                        handleTaxUpdate(selectedValues);
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, fontSize: "3px" }}>
                                            {selected.map((tax) => (
                                                <Chip
                                                    sx={{ fontSize: "10px" }}
                                                    key={tax.taxUuid}
                                                    label={`${tax.taxName} (${tax.taxPercent}%)`}
                                                    onDelete={() => {
                                                        handleDelete(tax.taxUuid);
                                                    }}
                                                    deleteIcon={
                                                        <CancelIcon
                                                            sx={{ width: 20, height: 20, cursor: "pointer" }}
                                                        />
                                                    }
                                                />

                                            ))}
                                        </Box>
                                    )}
                                    sx={{
                                        "& .MuiSelect-select": {
                                            padding: "6px 8px",
                                        },
                                        width: "170px",
                                        "& .MuiInputBase-root": {
                                            height: "auto",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {treatmentTax.map((option, index) => (
                                        <MenuItem key={index} value={option} sx={{ fontSize: "13px" }}>
                                            {option.taxName} - {option.taxPercent}%
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "20px", paddingTop: "35px" }}>
                        <Typography variant="body 1" sx={{ fontSize: "13px", fontWeight: "400" }}>Total(INR)</Typography>
                        <Typography variant="body 1" sx={{ fontSize: "13px", fontWeight: "400", paddingTop: "10px" }}>{totalPrice}</Typography>
                    </Box>

                    <Box sx={{ paddingLeft: "30px", paddingTop: "50px" }}>
                        <Button onClick={handleAddDetail} sx={{ color: "#fff", padding: "4px 20px", backgroundColor: "#0062DD", borderRadius: "25px", textTransform: "none" }}>
                            <SvgIcon sx={{ color: "#fff" }}>
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
                            </SvgIcon>
                            Add
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <OutlinedInput
                        name="Add Notes"
                        placeholder="Add Notes"
                        sx={{
                            width: "100%",
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

            <Box sx={{ mt: 4 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                        <TableRow sx={{ color: "#000" }}>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>S.No</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Procedure</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>unit</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Price</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Discount</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Tax</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    {tabelTreatment?.length > 0 ? (
                        <TableBody>
                            {tabelTreatment.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.treatmentName ? item?.treatmentName : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.qty ? item?.qty : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}> ₹{item?.cost ? parseFloat(item?.cost || 0).toFixed(2) : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.discount ? `${item?.discount} ${item?.discountUnit?.currency}` : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        {item?.taxInfo?.map((tax) => `${tax.taxName} (${tax.taxPercent}%)`).join(", ")}
                                    </TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}> ₹{item?.total ? parseFloat(item?.total || 0).toFixed(2) : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        <IconButton sx={{ color: "rgb(244, 67, 54)" }} onClick={() => handleDelete(index)}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} rowSpan={2} sx={{ border: "none", padding: "8px", textAlign: "center" }}></TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total price</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total discount</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total tax</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Grand total</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}></TableCell>
                            </TableRow>
                            <TableRow sx={{ color: "#000", backgroundColor: "#f3f3f3" }}>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹ {(tabelTreatment ?? []).reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹{(tabelTreatment ?? []).reduce((acc, item) => {

                                        let basePrice = (parseFloat(item?.qty) || 1) * (parseFloat(item?.cost) || 0);
                                        let discountValue = parseFloat(item?.discount) || 0;

                                        if (item?.discountUnit?.currency === "%") {
                                            discountValue = (basePrice * discountValue) / 100;
                                        }

                                        return acc + discountValue;
                                    }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹ {(tabelTreatment ?? []).reduce((acc, item) => {
                                        let basePrice = (parseFloat(item?.qty) || 1) * (parseFloat(item?.cost) || 0);
                                        let discountValue = parseFloat(item?.discount) || 0;

                                        if (item?.discountUnit?.currency === "%") {
                                            discountValue = (basePrice * discountValue) / 100;
                                        }

                                        let finalPrice = basePrice - discountValue;

                                        let totalTax = (item?.taxInfo ?? []).reduce((acc, tax) => {
                                            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
                                            return acc + taxAmount;
                                        }, 0);

                                        return acc + totalTax;
                                    }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>

                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹ {(tabelTreatment ?? []).reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}></TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ border: "none" }}>
                                    <Typography variant="h6" sx={{ fontSize: "18px", textAlign: "center", paddingBlock: "10px" }}>
                                        No data found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}

                </Table>
            </Box>


            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "8px", mt: 4 }}>
                <Button sx={{ color: "black", background: "#efefef", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }}>
                    Back
                </Button >
                <Button onClick={handleClickPost} sx={{ color: "#fff", background: "#0062DD", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }} >
                    save Lab Order
                </Button>
            </Box>



        </Box>
    )
}

export default Treatment;
