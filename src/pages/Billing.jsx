import React, { useState, useEffect } from "react";
import { Box, Typography, SvgIcon, IconButton, FormControl, OutlinedInput, InputLabel, Button, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, TextField } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from "axios";
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { encryption } from "../utils";
import { getAppointmentDetails } from "../api/Appointment";
import { useDispatch } from "react-redux";
import { savePatientData } from "../redux/PatientsSlice";
import { decryption } from "../utils";


const Billing = () => {

    const [openServices, setOpenServices] = useState(true);
    const [openProduct, setOpenProduct] = useState(false);
    const [addServiceOption, setAddServiceOption] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [discountType, setDiscountType] = useState([]);
    const [treatmentName, setTreatmentName] = useState([]);
    const [taxType, setTaxType] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);
    const [taxSelected, setTaxSelected] = useState([]);
    const [billingTable, setBillingTable] = useState([])
    const [formInputValue, setFormInputValue] = useState({
        unit: "1",
        price: "",
        discount: "",
        discountUnit: { currency: "%" },
        taxinfo: [],
    })
    const [selectedPayment, setSelectedPayment] = useState('');
    const [productDropdown, setProductDropdown] = useState([]);
    const [selectedDropdown, setSelectedDropdown] = useState([]);
    const [productTaxSelected, setProductTaxSelected] = useState([]);
    const [productTotalPrice, setProductTotalPrice] = useState();
    const [productFormInputValue, setProductFormInputValue] = useState({
        unit: "1",
        price: "",
        discount: "",
        discountUnit: { currency: "%" },
        taxinfo: [],
    })
    const [appointmentData, setAppointmentData] = useState([]);
    const [billingTotal, setBillingTotal] = useState(0);
    const [invoiceNo, setInvoiceNo] = useState([]);
    const [reciptNo, setReciptNo] = useState([]);
    const dispatch = useDispatch();
    const appointmentUuid = appointmentData[0]?.appointmentUuid

    console.log("appointmentUuid", appointmentUuid);

    useEffect(() => {
        const fetchAndSave = async () => {
            try {
                const response = await getAppointmentDetails();
                dispatch(savePatientData(response));

                setAppointmentData(response?.data?.data);

                console.log("Dispatched patient data from appontment details", response);

            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAndSave();
    }, [dispatch]);


    const handleOpenService = () => {
        setOpenServices(true);
        setOpenProduct(false);
    }

    const handleOpenAddProduct = () => {
        setOpenServices(false);
        setOpenProduct(true);
    }

    const handleOpenAddMembership = () => {
        setOpenServices(false);
        setOpenProduct(false);
    }

    //To save the uploaded data from the table 
    const handleClickPost = async () => {

        try {
            const inventoryItems = billingTable.map((item) => ({
                custBillingCost: item?.cost || 0,
                custBillingDiscount: item?.discount || 0,
                custBillingTax: 0,
                custBillingTotal: item?.total || 0,
                custBillingUnit: item?.qty || 1,
                discountType: "₹",
                orderName: [
                    item?.treatmentName || ""
                ],
                inventoryItemUuid: [
                    "frr8kcrd"
                ],
                productUuid: "",
                taxUuid: [],
                isProduct: false
            }));


            let formattedData = encryption(
                {
                    amtPaid: billingTotal,
                    balance: "0.00",
                    balanceAmtOnRefund: 0,
                    bankName: null,
                    cardNo: null,
                    chequeNo: null,
                    isUpi: false,
                    custInvoiceNo: invoiceNo,
                    custItems: [],
                    inventoryItems: inventoryItems,
                    membershipItems: [],
                    custPaymentNo: reciptNo,
                    customInvoiceId: false,
                    customRecieptId: false,
                    modeUuid: "u3rlzscc",
                    paymentMode: "Cash",
                    paymentRefNo: null,
                    pending: false,
                    vendorFee: ""
                }
            );

            const response = await axios.post(
                `https://flash.lyf.yoga/files/charting/BillingOrder/saveBilling/${appointmentUuid}?tentUserUuid=6f22fe5v`,
                { data: formattedData?.plainText },
                {
                    headers: {
                        "Accept": "application/json",
                        Internal: "LYFnGO",
                        key: formattedData?.publicKey,
                    },
                }
            );
            console.log("success", response.data);
            alert("Prescription updated successfully!");
        } catch (error) {
            console.error("Error", error.response?.data || error.message);
            alert("Faild to update Billing");
        }
    }

    //API to get invoice number
    useEffect(() => {
        axios.get(
            `https://flash.lyf.yoga/files/charting/Invoice/getInvoiceid/jzxph5ql`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        )
            .then((response) => {
                setInvoiceNo(response?.data?.data)
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
            });
    }, []);

    //API to get recipt Number 
    useEffect(() => {
        axios.get(
            `https://flash.lyf.yoga/files/charting/Payment/getRecieptid/jzxph5ql`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        )
            .then((response) => {
                const Descript = decryption(response);
                setReciptNo(Descript?.data)
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
            });
    }, []);

    //API to get add service dropdown options
    useEffect(() => {
        axios.get(`https://flash.lyf.yoga/files/settings/api/treatmentCatalog/findBilling/${appointmentUuid}/jzxph5ql?limit=10&offset=1&search=`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setAddServiceOption(response?.data?.data?.getBillingList);
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, [appointmentUuid]);

    //API to get the payment methods
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/settings/paymentMode/tentMaster/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setPaymentMethods(response?.data?.data?.paymentModeDtoList);
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, []);

    //API to get the details of the discount type 
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
                setDiscountType(response?.data?.data?.tentMasterCurrency);
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, []);

    //API to get the Tax values 
    useEffect(() => {
        axios.get("https://flash.lyf.yoga/files/settings/taxManagementByTentId/jzxph5ql",
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO"
                },
            }
        )
            .then((response) => {
                setTaxType(response?.data?.data);
            })
            .catch((error) => {
                console.error("Error fetching data diet lifestyle:", error.message);
            });
    }, []);

    //To update the formvalues when input changes
    const handleChange = (setStateFn) => (event) => {
        const { name, value } = event.target
        setStateFn((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }

    //To update the tax from input to form 
    const handleTaxUpdate = (getTaxName) => (selectedTax) => {
        getTaxName((preValues) => ({
            ...preValues,
            taxinfo: selectedTax.map((tax) => ({
                taxName: tax.taxName,
                taxPercent: tax.taxPercent,
            }))
        }))
    }

    //to update the discount from input 
    const handleDiscountUpdate = (getFnType) => (newDiscountType) => {
        getFnType((prevValues) => ({
            ...prevValues,
            discountUnit: {
                ...prevValues.discountUnit,
                currency: newDiscountType
            }
        }))
    }

    //To delete the selected row from the tabel
    const handleDelete = (indexToRemove) => {
        setBillingTable(billingTable.filter((_, index) => index !== indexToRemove));
    };

    //To Add the input details to table for add service
    const handleAddDetail = () => {

        if (!treatmentName || !formInputValue.unit || !formInputValue.price) {
            alert("please fill the details");
            return;
        }

        const { unit, price, discount, discountUnit, taxinfo = [] } = formInputValue;


        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(discount) || 0;

        if (discountUnit.currency === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = taxinfo.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        const newEntry = {
            treatmentName: treatmentName,
            qty: formInputValue?.unit,
            cost: formInputValue?.price,
            discount: formInputValue?.discount,
            discountUnit: { currency: formInputValue?.discountUnit.currency },
            taxInfo: formInputValue?.taxinfo?.map((tax) => ({
                taxName: tax.taxName,
                taxPercent: tax.taxPercent,
            })) || [],
            total: priceWithTax,
        }

        setBillingTable((prev) => [
            ...(prev || []),
            newEntry
        ]);
    };

    //To add details from input to table for AddProduct
    const handleAddProductTable = () => {

        if (!selectedDropdown || !productFormInputValue.unit || !productFormInputValue.price) {
            alert("please fill the details");
            return;
        }

        const { unit, price, discount, discountUnit, taxinfo = [] } = productFormInputValue;


        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(discount) || 0;

        if (discountUnit?.currency === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = taxinfo.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        const newEntry = {
            treatmentName: selectedDropdown,
            qty: productFormInputValue?.unit,
            cost: productFormInputValue?.price,
            discount: productFormInputValue?.discount,
            discountUnit: { currency: productFormInputValue?.discountUnit.currency },
            taxInfo: productFormInputValue?.taxinfo?.map((tax) => ({
                taxName: tax.taxName,
                taxPercent: tax.taxPercent,
            })) || [],
            total: priceWithTax,
        }

        setBillingTable((prev) => [
            ...(prev || []),
            newEntry
        ]);
    };

    //To calculate the total price for Add service
    useEffect(() => {
        const { unit, price, discount, discountUnit, taxinfo = [] } = formInputValue;

        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(discount) || 0;

        if (discountUnit.currency === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = taxinfo.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        setTotalPrice(priceWithTax.toFixed(2));
    }, [formInputValue]);

    //To calculate the total price for Add product
    useEffect(() => {
        const { unit, price, discount, discountUnit, taxinfo = [] } = productFormInputValue;

        let basePrice = (parseFloat(unit) || 1) * (parseFloat(price) || 0);
        let discountValue = parseFloat(discount) || 0;

        if (discountUnit.currency === "%") {
            discountValue = (basePrice * discountValue) / 100;
        }

        let finalPrice = basePrice - discountValue;

        let totalTax = taxinfo.reduce((acc, tax) => {
            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;
            return acc + taxAmount;
        }, 0);

        let priceWithTax = finalPrice + totalTax

        setProductTotalPrice(priceWithTax.toFixed(2));

    }, [productFormInputValue]);

    //API to get the details of add product
    const handleAddProduct = async () => {
        try {
            const payload = {
                custUuid: "rkpcdske",
                dropdownCategory: 2,
                mastTentUuid: "jzxph5ql",
                sourceFrom: "Appointment",
                tentUserUuid: "6f22fe5v",
            }

            const response = await axios.post(
                "https://flash.lyf.yoga/files/charting/QuickSales/getDropdown?searchKey=",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Internal: "LYFnGO",
                    },
                }
            );

            if (response.data.status === "success") {
                console.log("API Success in billing:", response.data);
                setProductDropdown(response?.data?.data?.quickSaleWrapper?.inventoryAndProductsWrapper?.inventoryAndProductsDropdownList);
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    }

    //This is to get the billing total
    useEffect(() => {
        const total = billingTable.reduce(
            (acc, item) => acc + (parseFloat(item.total) || 0),
            0
        );
        setBillingTotal(total);
    }, [billingTable]);




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

            <Box sx={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <Box>
                    <Typography variant="body1" sx={{ fontSize: "13px" }}>Invoice no :</Typography>
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ fontSize: "13px", paddingLeft: "10px" }}> {invoiceNo}</Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "30px", marginTop: "30px" }}>
                <Button
                    onClick={() => {
                        handleOpenService();
                    }}
                    sx={{ color: "#fff", backgroundColor: "#1AC698", display: "flex", alignItems: "center", gap: "5px", textTransform: 'none', fontSize: "13px", paddingInline: "10px", borderRadius: "8px" }}>
                    <SvgIcon sx={{ fontSize: "18px" }}>
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2M10 4h4v2h-4zm10 16H4V8h16z" />
                    </SvgIcon>
                    Add Services
                </Button>
                <Button onClick={() => {
                    handleAddProduct();
                    handleOpenAddProduct();
                }}
                    sx={{ color: "#5D6D7E", backgroundColor: "#F2D6CC", display: "flex", alignItems: "center", gap: "5px", textTransform: 'none', fontSize: "13px", paddingInline: "10px", borderRadius: "8px" }}>
                    <SvgIcon sx={{ fontSize: "18px", color: "#E55C26" }}>
                        <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2m-1 18H5V9h14zm1-13H4V4h16z" />
                    </SvgIcon>
                    Add Product
                </Button>
                <Button
                    onClick={() => {
                        handleOpenAddMembership();
                    }}
                    sx={{ color: "#5D6D7E", backgroundColor: "#F1C7DE", display: "flex", alignItems: "center", gap: "5px", textTransform: 'none', fontSize: "13px", paddingInline: "10px", borderRadius: "8px" }}>
                    <SvgIcon sx={{ fontSize: "18px", color: "#DF1181" }}>
                        <path d="M20 2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h4v5l4-2 4 2v-5h4c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2m0 13H4v-2h16zm0-5H4V4h16z" />
                    </SvgIcon>
                    Add Membership
                </Button>
            </Box>

            <Box sx={{ marginTop: "30px", display: openServices === true ? "block" : "none" }}>

                <Box>
                    <FormControl sx={{ m: 1, width: 400, height: 50 }}>
                        <InputLabel id="demo-multiple-name-label"
                            sx={{ fontSize: '14px' }}>search & add procedure *</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={treatmentName}
                            onChange={(e) => {
                                const selectedValues = e.target.value;
                                setTreatmentName(selectedValues);
                            }}
                            input={< OutlinedInput
                                label="search & add procedure"
                                sx={{
                                    height: 40,
                                    '& .MuiSelect-select': {
                                        fontSize: '13px',
                                    }
                                }} />}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 250,
                                    },
                                },
                            }}
                        >
                            {addServiceOption.map((procedure) => (
                                <MenuItem key={procedure.uuid} value={procedure.tentProcedureCatalogName}
                                    sx={{ fontSize: "13px" }}>
                                    {procedure.tentProcedureCatalogName} {procedure?.isCompleted
                                        ? "(completed)"
                                        : procedure?.isAssigned
                                            ? "(Assigned)"
                                            : ""}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: treatmentName.length > 0 ? "block" : "none" }}>

                    <Box sx={{ display: "flex", width: "100%" }}>

                        <Box sx={{ flexBasis: "16.6667%", flexGrow: "0", maxWidth: "16.6667%", display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px", paddingTop: "16px" }}>
                            <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "14px" }}>Procedure</Typography>
                            <Typography variant="span" sx={{ fontWeight: "400", fontSize: "14px" }} >{treatmentName}</Typography>
                        </Box>

                        <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                            <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Unit</Typography>
                            <Box sx={{ marginTop: "8px" }}>
                                <TextField
                                    id="unit"
                                    name="unit"
                                    type="number"
                                    value={formInputValue.unit}
                                    onChange={handleChange(setFormInputValue)}
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
                                    value={formInputValue.price}
                                    onChange={handleChange(setFormInputValue)}
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
                                    id="discount"
                                    name="discount"
                                    type="number"
                                    value={formInputValue.discount}
                                    onChange={handleChange(setFormInputValue)}
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
                                    value={formInputValue.discountUnit.currency}
                                    onChange={(e) => handleDiscountUpdate(setFormInputValue)(e.target.value)}
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
                                        value={taxSelected}
                                        onChange={(event) => {
                                            const selectedValues = event.target.value;
                                            setTaxSelected(selectedValues);
                                            handleTaxUpdate(setFormInputValue)(selectedValues);
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
                                        {taxType.map((option, index) => (
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
                            <Typography variant="body 1" sx={{ fontSize: "13px", fontWeight: "400" }}>{totalPrice}</Typography>
                        </Box>

                        <Box sx={{ paddingLeft: "20px", paddingTop: "50px", display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-start" }}>
                            <Box>
                                <Button onClick={handleAddDetail} sx={{ color: "#fff", padding: "4px 20px", backgroundColor: "#0062DD", borderRadius: "25px", textTransform: "none", fontSize: "13px" }}>
                                    <SvgIcon sx={{ color: "#fff" }}>
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
                                    </SvgIcon>
                                    Add
                                </Button>
                            </Box>

                            <Box>
                                <Button sx={{ color: "#fff", padding: "4px 20px", backgroundColor: "#0062DD", borderRadius: "25px", textTransform: "none", fontSize: "13px" }}>
                                    Remove
                                </Button>
                            </Box>
                        </Box>

                    </Box>

                </Box>
            </Box>


            <Box sx={{ marginTop: "30px", display: openProduct === true ? "block" : "none" }}>
                <Box >
                    <FormControl sx={{ m: 1, width: 400, height: 50 }}>
                        <InputLabel id="demo-multiple-name-label"
                            sx={{ fontSize: '14px' }}>search & add product *</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={selectedDropdown}
                            onChange={(e) => { setSelectedDropdown(e.target.value) }}
                            input={< OutlinedInput
                                label="search & add product"
                                sx={{
                                    height: 40,
                                    '& .MuiSelect-select': {
                                        fontSize: '13px',
                                    }
                                }} />}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 250,
                                    },
                                },
                            }}
                        >
                            {productDropdown.length > 0 ? (
                                productDropdown.map((procedure, index) => (
                                    <MenuItem
                                        key={procedure?.productUuid || index}
                                        value={procedure?.productName}
                                        sx={{ fontSize: "13px" }}
                                    >
                                        {procedure?.productName}
                                    </MenuItem>
                                ))
                            ) :
                                <MenuItem sx={{ fontSize: "13px" }}>No Options</MenuItem>
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box>
                    <Box sx={{ display: selectedDropdown.length > 0 ? "block" : "none" }}>
                        <Box sx={{ flexBasis: "16.6667%", flexGrow: "0", maxWidth: "16.6667%", display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px", paddingTop: "16px" }}>
                            <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "14px" }}>Product name</Typography>
                            <Typography variant="span" sx={{ fontWeight: "400", fontSize: "14px" }} >{selectedDropdown}</Typography>
                        </Box>

                        <Box>
                            <Box sx={{ display: "flex", width: "100%" }}>
                                <Box sx={{ paddingLeft: "16px", paddingTop: "16px" }}>
                                    <Typography variant="body 1" sx={{ fontWeight: "400", fontSize: "13px" }}>Unit</Typography>
                                    <Box sx={{ marginTop: "8px" }}>
                                        <TextField
                                            id="unit"
                                            name="unit"
                                            type="number"
                                            value={productFormInputValue.unit}
                                            onChange={handleChange(setProductFormInputValue)}
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
                                            value={productFormInputValue.price}
                                            o onChange={handleChange(setProductFormInputValue)}
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
                                            id="discount"
                                            name="discount"
                                            type="number"
                                            value={productFormInputValue.discount}
                                            onChange={handleChange(setProductFormInputValue)}
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
                                            value={productFormInputValue.discountUnit.currency}
                                            onChange={(e) => handleDiscountUpdate(setProductFormInputValue)(e.target.value)}
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
                                                value={productTaxSelected}
                                                onChange={(event) => {
                                                    const selectedValues = event.target.value;
                                                    setProductTaxSelected(selectedValues);
                                                    handleTaxUpdate(setProductFormInputValue)(selectedValues);
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
                                                {taxType.map((option, index) => (
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
                                    <Typography variant="body 1" sx={{ fontSize: "13px", fontWeight: "400" }}>{productTotalPrice}</Typography>
                                </Box>

                                <Box sx={{ paddingLeft: "20px", paddingTop: "50px" }}>
                                    <Button onClick={handleAddProductTable} sx={{ color: "#fff", padding: "4px 20px", backgroundColor: "#0062DD", borderRadius: "25px", textTransform: "none", fontSize: "13px" }}>
                                        <SvgIcon sx={{ color: "#fff" }}>
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" />
                                        </SvgIcon>
                                        Add
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ marginTop: "20px" }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f3f3f3" }}>
                        <TableRow>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>S.NO</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Name</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Unit</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Validity</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Price</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Discount</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Tax</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Total</TableCell>
                            <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "12px" }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    {billingTable.length > 0 ? (
                        <TableBody>
                            {billingTable.map((item, index) => (
                                <TableRow>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.treatmentName ? item?.treatmentName : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.qty ? item?.qty : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>-</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.cost ? item?.cost : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.discount ? `${item?.discount} ${item?.discountUnit?.currency}` : "-"}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        {item?.taxInfo?.map((tax) => `${tax.taxName} (${tax.taxPercent}%)`).join(", ")}
                                    </TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>{item?.total}</TableCell>
                                    <TableCell sx={{ border: "1.5px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        <IconButton sx={{ color: "rgb(244, 67, 54)" }} onClick={() => handleDelete(index)}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4} rowSpan={2} sx={{ border: "none" }}></TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "13px" }}>Total price</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "13px" }}>Total discount</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "13px" }}>Total tax</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center", fontSize: "13px" }}>Grand total</TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center" }}></TableCell>
                            </TableRow>
                            <TableRow sx={{ color: "#000", backgroundColor: "#f3f3f3" }}>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center" }}>
                                    ₹ {billingTable.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center" }}>
                                    ₹{billingTable.reduce((acc, item) => {

                                        let basePrice = (parseFloat(item?.qty) || 1) * (parseFloat(item?.cost) || 0);
                                        let discountValue = parseFloat(item?.discount) || 0;

                                        if (item?.discountUnit?.currency === "%") {
                                            discountValue = (basePrice * discountValue) / 100;
                                        }

                                        return acc + discountValue;
                                    }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center" }}>
                                    ₹{billingTable.reduce((acc, item) => {

                                        let basePrice = (parseFloat(item?.qty) || 1) * (parseFloat(item?.cost) || 0);
                                        let discountValue = parseFloat(item?.discount) || 0;

                                        if (item?.discountUnit?.currency === "%") {
                                            discountValue = (basePrice * discountValue) / 100;
                                        }

                                        let finalPrice = basePrice - discountValue;

                                        let totalTax = item?.taxInfo.reduce((acc, tax) => {
                                            let taxAmount = (finalPrice * (parseFloat(tax.taxPercent) || 0)) / 100;

                                            return acc + taxAmount;
                                        }, 0);

                                        return acc + totalTax;

                                    }, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center" }}>
                                    ₹ {billingTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell sx={{ border: "1.5px solid #ddd", textAlign: "center" }}></TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={9} sx={{ border: "none" }}>
                                    <Typography variant="h6" sx={{ fontSize: "18px", textAlign: "center", paddingBlock: "10px", border: "none" }}>
                                        No data found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "50px", marginTop: "50px" }}>
                <Typography sx={{ fontSize: "13px" }}>Payment no :</Typography>
                <Typography sx={{ fontSize: "13px" }}>{reciptNo}</Typography>
            </Box>

            <Box sx={{ marginTop: "30px", display: "flex", alignItems: "center", gap: "20px" }}>
                <Box>
                    <FormControl sx={{ m: 1, width: 200, height: 50 }}>
                        <InputLabel id="demo-multiple-name-label"
                            sx={{ fontSize: '14px' }}>
                            Payment methods*
                        </InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            value={selectedPayment}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            input={< OutlinedInput
                                label="Payment methods"
                                sx={{
                                    height: 40,
                                    '& .MuiSelect-select': {
                                        paddingTop: '8px',
                                        paddingBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '13px',
                                    }
                                }}
                            />}
                        >
                            {paymentMethods.map((option) => (
                                <MenuItem key={option.uuid} value={option.modeName}
                                    sx={{ fontSize: "12px" }}>
                                    {option.modeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <TextField
                        disabled
                        id="outlined-disabled"
                        label="payable(INR)"
                        value={billingTotal}
                        defaultValue="₹ 0.00"
                        sx={{
                            '& .MuiInputBase-root': {
                                height: 40,
                                fontSize: '14px',
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '12px',
                            },
                            '& input': {
                                padding: '8px 14px',
                            }
                        }}
                    />
                </Box>
                <Box>
                    <TextField
                        enable
                        id="outlined-enable"
                        label="payable(INR)"
                        value={billingTotal}
                        defaultValue="₹ 0.00"
                        sx={{
                            '& .MuiInputBase-root': {
                                height: 40,
                                fontSize: '14px',
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '12px',
                            },
                            '& input': {
                                padding: '8px 14px',
                            },

                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "8px", mt: 4 }}>
                <Button onClick={handleClickPost} sx={{ color: "#fff", background: "#0062DD", padding: "4px 20px", textTransform: "none", borderRadius: "25px" }} >
                    save
                </Button>
            </Box>
        </Box>
    )
}

export default Billing; 