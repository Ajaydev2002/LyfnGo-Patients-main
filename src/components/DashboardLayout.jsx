import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Navigation from "../consts/Navigation";
import '../app.css';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';

const DashboardLayout = () => {

    const [hospitalList, setHospitalList] = useState(false);

    const showHospitalList = () => {
        setHospitalList(!hospitalList);
    }

    return (

        <div className="Layout-container" style={{ display: "flex", flexWrap: "wrap" }}>

            <div className="sidebar-container" style={{ width: "100px", backgroundColor: "#fff", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "2px 0px 10px rgba(73, 73, 73, 0.2)", position: "fixed",zIndex:"150" }}>
                <div className="logo-section" style={{ marginTop: "10px" }}>
                    <img src={logo} style={{ width: "48px" }} />
                </div>

                <div className="sidebar-content" style={{ overflowY: "scroll", height: "91vh", width: "100px" }}>
                    <div className="sidebar-items" >
                        {Navigation.map((items, index) => (
                            <Link key={index} to={"#"}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBlock: "8px", marginBlock: "13px" }}>
                                    <img src={items.img} />
                                    <p style={{ color: items.color, fontSize: "13px", paddingBlock: "5px" }}>{items.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderTop: "0.5px solid rgb(225, 221, 221)" }}>
                        <p style={{ fontSize: "12px", paddingBlock: "2px", color: "rgb(114, 114, 114)" }}>Powered by</p>
                        <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Main_menu_icons/LYFnGO_logo.svg" style={{ width: "60px" }} />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex",zIndex:"140", justifyContent: "space-between", alignItems: "center", width: "calc(100% - 101px)", paddingInline: "15px", boxShadow: "0px 3px 10px rgba(73, 73, 73, 0.2)", marginLeft: "100px", paddingBlock: "6px",position:"fixed",backgroundColor:"#fff" }}>
                <div style={{ position: "relative", }}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "190px", alignitems: "center", cursor: "pointer" }} onClick={showHospitalList}>
                        <div>
                            <h4 style={{ fontSize: "13px", fontWeight: "600" }}>Ajay Clinic</h4>
                        </div>
                        <div style={{ paddingLeft: "20px" }}>
                            <ExpandLessIcon style={{ display: hospitalList ? "block" : "none", fontSize: "20px", color: "rgba(0, 0, 0, 0.54)" }} />
                            <ExpandMoreIcon style={{ display: hospitalList ? "none" : "block", fontSize: "20px", color: "rgba(0, 0, 0, 0.54)" }} />
                        </div>
                    </div>
                    <div style={{ zIndex: "20", display: hospitalList ? "block" : "none", backgroundcolor: "#fff", position: "absolute", width: "200px", fontSize: "14px", paddingLeft: "15px", borderRadius: "10px", boxShadow: "2px 2px 10px rgba(73, 73, 73, 0.1)", cursor: "pointer", top: "50px" }}>
                        <p style={{ paddingBlock: "5px", color: "rgb(17, 24, 39)" }}>Ajay clinic</p>
                        <p style={{ paddingBlock: "5px", color: "rgb(17, 24, 39)" }}>sri Ramachandra</p>
                        <p style={{ paddingBlock: "5px", color: "rgb(17, 24, 39)" }}>Fortis Hospital</p>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid black", padding: "8px", borderRadius: "25px" }}>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "130px" }}>
                            <div>
                                <p style={{ fontSize: "13px", color: "rgb(53, 53, 53)", paddingLeft: "5px" }}>Name</p>
                            </div>
                            <div style={{ paddingLeft: "20px", cursor: "pointer" }}>
                                <ExpandLessIcon style={{ display: hospitalList ? "block" : "none", fontSize: "20px", color: "rgba(0, 0, 0, 0.54)" }} />
                                <ExpandMoreIcon style={{ display: hospitalList ? "none" : "block", fontSize: "20px", color: "rgba(0, 0, 0, 0.54)" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input type="text" placeholder="Exp - john doe" style={{ outline: "none", border: "none", paddingLeft: "30px", width: "350px" }} />
                            <ExpandMoreIcon style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.54)", cursor: "pointer" }} />
                        </div>
                    </div>

                    <div>
                        <Tooltip
                            title="Add Patient"
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -10],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <button style={{ backgroundColor: "#2EB2FF", cursor: "pointer", paddingInline: "22px", paddingBlock: "4px", borderRadius: "25px", border: "none", marginLeft: "12px" }}>
                                <svg width="22" height="22" viewBox="0 0 23 23" fill="#fff">
                                    <path d="M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4m2 2v2h3v3h2v-3h3v-2h-3V7h-2v3zM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip
                            title="Add Appointment"
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -10],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <button style={{ backgroundColor: "#2EB2FF", cursor: "pointer", paddingInline: "22px", paddingBlock: "4px", borderRadius: "25px", border: "none", marginLeft: "12px" }}>
                                <img src="https://d1cdqhtb2bf9h4.cloudfront.net/B2C/add_appointment.svg" style={{ width: "22px" }} />
                            </button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip
                            title="More options"
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -23],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <button style={{ backgroundColor: "#fff", cursor: "pointer", border: "none", padding: "12px" }}>
                                <svg width="22" height="22" viewBox="0 0 23 23" fill="black">
                                    <path d="M4 8h4V4H4zm6 12h4v-4h-4zm-6 0h4v-4H4zm0-6h4v-4H4zm6 0h4v-4h-4zm6-10v4h4V4zm-6 4h4V4h-4zm6 6h4v-4h-4zm0 6h4v-4h-4z" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip
                            title="settings"
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -23],
                                            },
                                        },
                                    ],
                                },
                            }}>
                            <button style={{ backgroundColor: "#fff", cursor: "pointer", border: "none", padding: "12px" }}>
                                <svg width="22" height="22" viewBox="0 0 23 23" fill="black">
                                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip
                            title="Notification"
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -23],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <button style={{ backgroundColor: "#fff", cursor: "pointer", border: "none", padding: "12px" }}>
                                <svg width="22" height="22" viewBox="0 0 23 23" fill="black">
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2m6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5z" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer", borderLeft: "1px solid rgb(203, 200, 200)" }}>
                        <div style={{ paddingLeft: "20px" }}>
                            <p style={{ fontSize: "13px", fontWeight: "600" }}>Ajay Clinic</p>
                            <p style={{ fontSize: "13px", textAlign: "right" }}>Owner</p>
                        </div>
                        <div style={{ fontSize: "18px", backgroundColor: "rgb(0, 98, 221)", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", marginLeft: "5px", color: "#fff", fontWeight: "500" }}>
                            A
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardLayout;