
import axios from "axios";

export const getAppointmentDetails = async () => {

    try {
        const response = await axios.get(
            `https://flash.lyf.yoga/files/ms-calendar-appointment/appointment/appointmentDetails?tentId=jzxph5ql&custId=rkpcdske&period=upcoming`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        );

        return response; 

    } catch (error) {
        console.error("Error fetching patient details:", error);
        throw error;
    }
};
