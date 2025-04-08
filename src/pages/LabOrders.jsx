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



const LabOrder = () => {

    const [testList, setTestList] = useState([]);
    const [selctTestName, setSelectTestName] = useState(null);
    const [discountType, setDiscountType] = useState([]);
    const [taxName, setTaxName] = useState([]);
    const [selectedTax, setSelectedTax] = useState([]);
    const [tabelLabOrder, setTabelLabOrder] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);
    const [labOrderformValues, setLabOrderFormValues] = useState({
        unit: "1",
        price: "",
        Discount: "",
        DiscountType: "%",
        tax_info: [],
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [appointmentData, setAppointmentData] = useState([]);

    const dispatch = useDispatch();


    //To get appointment details
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

    const handleClickPost = async () => {

        try {
            const formattedPrescriptions = tabelLabOrder.map((item) => ({
                discount: item?.discount || null,
                discount_type: item?.discount_type || null,
                feed_lab_order_uuid: null,
                lab_order_name: item?.lab_order_name || null,
                lab_order_price: item?.lab_order_price || null,
                lab_order_unit: item?.lab_order_unit || null,
                notes: null,
                taxUuidList: ["eqz7s63h"],
                tent_lab_order_uuid: "tdcuc04h",
                total_price: item?.total_price || null,
            }))

            const payload = {
                data: formattedPrescriptions,
            };

            const response = await axios.post(
                `https://flash.lyf.yoga/files/communication/patient/laborder/save/jzxph5ql/rkpcdske?appointmentUuid=${appointmentUuid}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                    },
                }

            );
            alert("Lab Order updated successfully!");

        } catch (error) {
            console.error("API Error:", error);
            alert("Faild to update Lab order");
        }
        setIsDisabled(true);
    }

    //To update the price to the form - from the selected input
    useEffect(() => {
        if (selctTestName) {
            setLabOrderFormValues((prevValues) => ({
                ...prevValues,
                price: selctTestName.lab_order_price || "",
            }));
        }
    }, [selctTestName]);

    //This is to update the tax to the form from the input 
    const handleTaxUpdate = (selectedTaxes) => {
        setLabOrderFormValues((prevValues) => ({
            ...prevValues,
            tax_info: selectedTaxes.map((tax) => ({
                tax_name: tax.taxName,
                tax_percent: tax.taxPercent,
            })),
        }));
    };

    //To delete the tax
    const handleDeleteTax = (taxUuid) => {
        const updatedTaxes = selectedTax.filter((tax) => tax.taxUuid !== taxUuid);
        setSelectedTax(updatedTaxes);
        handleTaxUpdate(updatedTaxes);
    };

    //To delete the selected row from the tabel
    const handleDelete = (indexToRemove) => {
        setTabelLabOrder(tabelLabOrder.filter((_, index) => index !== indexToRemove));
    };

    //To ADD details to the tabel from the input field
    const handleAddDetail = () => {

        if (!selctTestName || !labOrderformValues.unit || !labOrderformValues.price) {
            alert("please fill the details");
            return;
        }

        const { unit, price, Discount, DiscountType, tax_info = [] } = labOrderformValues;

        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(Discount) || 0;

        if (DiscountType === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = tax_info.reduce((acc, tax) => {
            let taxAmount = (finalPrice * parseFloat(tax.tax_percent || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax;

        const newEntry = {
            lab_order_name: selctTestName?.lab_order_name,
            lab_order_unit: labOrderformValues?.unit,
            lab_order_price: labOrderformValues?.price,
            discount: labOrderformValues?.Discount,
            discount_type: labOrderformValues?.DiscountType,
            tax_info: labOrderformValues?.tax_info?.map((tax) => ({
                tax_name: tax.tax_name,
                tax_percent: tax.tax_percent,
            })) || [],
            total_price: priceWithTax.toFixed(2),
        }

        setTabelLabOrder((prev) => {
            const alreadyExists = prev.some(item => item.lab_order_name === newEntry.lab_order_name);
            if (alreadyExists) return prev;
            return [...prev, newEntry];
        });
    };

    //The get the values to update the form value to tabel
    const handleChange = (event) => {
        const { name, value } = event.target;
        setLabOrderFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    //API to get the test name
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/communication/lab/oreder/get/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setTestList(response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching data lab order test", error.message)
            })
    }, [])

    //API to get Discount type
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/charting/BillingOrder/get/tentCurrency/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                }
            }
        )
            .then((response) => {
                setDiscountType(response.data.data.tentMasterCurrency)
            })
            .catch((error) => {
                console.error("Error fetching data discountType", error.message)
            })
    }, [])

    //API to get tax
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
                setTaxName(response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching data discountType", error.message)
            })
    }, [])


    //API to get the lab order details to display in tabel 
    useEffect(() => {
        axios.get(`https://flash.lyf.yoga/files/communication/patient/laborder/get/${appointmentUuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                }
            }
        )
            .then((response) => {
                setTabelLabOrder(response.data.data)
            })
            .catch((error) => {
                console.error("Error fetching data discountType", error.message)
            })
    }, [appointmentUuid]);

    //To calculate the total Price
    useEffect(() => {
        const { unit, price, Discount, DiscountType, tax_info = [] } = labOrderformValues;

        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(Discount) || 0;

        if (DiscountType === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = tax_info.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.tax_percent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        setTotalPrice(priceWithTax.toFixed(2));

    }, [labOrderformValues]);


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
                        options={testList}
                        getOptionLabel={(option) => option.lab_order_name}
                        value={selctTestName || null}
                        onChange={(event, newValue) => {
                            setSelectTestName(newValue);
                        }}
                        renderOption={(props, option) => (
                            <li {...props} style={{ fontSize: "13px", padding: "8px 12px", color: "black" }}>
                                {option.lab_order_name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder={"search Lab Orders"}
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

            <Box sx={{ display: selctTestName ? "block" : "none" }}>
                <Box sx={{ display: "flex", width: "100%" }}>

                    <Box sx={{ flexBasis: "16.6667%", flexGrow: "0", maxWidth: "16.6667%", display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "14px" }}>Lab Test</Typography>
                        <Typography variant="span" sx={{ fontWeight: "400", fontSize: "14px" }} >{selctTestName ? selctTestName.lab_order_name : ""}</Typography>
                    </Box>

                    <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                        <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Unit</Typography>
                        <Box sx={{ marginTop: "8px" }}>
                            <TextField
                                id="unit"
                                name="unit"
                                type="number"
                                value={labOrderformValues.unit}
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
                                value={labOrderformValues.price}
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
                                value={labOrderformValues.Discount}
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
                                id="Discount type"
                                name="DiscountType"
                                select
                                value={labOrderformValues.DiscountType}
                                onChange={handleChange}
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
                                                        handleDeleteTax(tax.taxUuid);
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
                                        width: "170px",
                                        "& .MuiSelect-select": {
                                            padding: "6px 8px",
                                        },
                                        "& .MuiInputBase-root": {
                                            height: "auto",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "13px",
                                        },
                                    }}
                                >
                                    {taxName.map((option) => (
                                        <MenuItem key={option.taxUuid} value={option} sx={{ fontSize: "13px" }}>
                                            {option.taxName} - {option.taxPercent}%
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "20px", paddingTop: "35px" }}>
                        <Typography variant="body 1" sx={{ fontSize: "13px", fontWeight: "400" }}>Total(INR)</Typography>
                        <Typography variant="body 1" sx={{ fontSize: "13px", fontWeight: "400", paddingTop: "10px" }}>₹ {totalPrice}</Typography>
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
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Lab Order</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>unit</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Price</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Discount</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Tax</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    {tabelLabOrder?.length > 0 ? (
                        <TableBody>
                            {tabelLabOrder.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.lab_order_name ? item?.lab_order_name : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.lab_order_unit ? item?.lab_order_unit : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.lab_order_price ? item?.lab_order_price : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.discount ? `${item.discount} ${item?.discount_type}` : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        {item?.tax_info?.map((tax) => `${tax.tax_name} (${tax.tax_percent}%)`).join(", ")}
                                    </TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{parseFloat(item?.total_price || 0).toFixed(2)}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        <IconButton sx={{ color: "rgb(244, 67, 54)" }} onClick={() => handleDelete(index)}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} rowSpan={2} sx={{ padding: "8px", textAlign: "center", border: "none" }}></TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total price</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total discount</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Total tax</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>Grand total</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}></TableCell>
                            </TableRow>

                            <TableRow sx={{ color: "#000", backgroundColor: "#f3f3f3" }}>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹ {tabelLabOrder.reduce((acc, item) => acc + (parseFloat(item.lab_order_price) || 0), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹{tabelLabOrder.reduce((acc, item) => {

                                        let basePrice = (parseFloat(item?.lab_order_unit) || 1) * (parseFloat(item.lab_order_price) || 0);
                                        let discountValue = parseFloat(item?.discount) || 0;

                                        if (item?.discount_type === "%") {
                                            discountValue = (basePrice * discountValue) / 100;
                                        }

                                        return acc + discountValue;
                                    }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>

                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    {tabelLabOrder.reduce((acc, item) => {

                                        let basePrice = (parseFloat(item?.lab_order_unit) || 1) * (parseFloat(item.lab_order_price) || 0);
                                        let discountValue = parseFloat(Discount) || 0;

                                        if (item?.discount_type === "%") {
                                            discountValue = (basePrice * discountValue) / 100;
                                        }

                                        let finalPrice = basePrice - discountValue;

                                        let totalTax = item?.tax_info?.reduce((acc, tax) => {
                                            let taxAmount = (finalPrice * parseFloat(tax.tax_percent || 0)) / 100;
                                            return acc + taxAmount;
                                        }, 0);

                                        return acc + totalTax;

                                    }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                    ₹ {tabelLabOrder.reduce((acc, item) => acc + (parseFloat(item.total_price) || 0), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}></TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} sx={{ border: "none" }}>
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


export default LabOrder;