// api/getPatientDetails.js
import axios from "axios";
import { decryption } from "../utils";

export const getPatientDetails = async (custUuid) => {

    try {
        const response = await axios.get(
            `https://flash.lyf.yoga/api/customer/getCustomerMaster/${custUuid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Internal: "LYFnGO",
                },
            }
        );

        const decryptedData = decryption(response);
        return decryptedData; 

    } catch (error) {
        console.error("Error fetching patient details:", error);
        throw error;
    }
};
