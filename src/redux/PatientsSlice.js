
const initialState = {      
    state: {}
}

export const patientsReducer = (state = initialState, action) => {
    switch (action?.type) {
        case ('SAVE_PATIENT_DATA'): {
            return {
                ...state,
                state: action?.payload
            }
        }
        default: {
            return state;
        }
    }
}


export const savePatientData = (payload) => ({
    type: 'SAVE_PATIENT_DATA',
    payload: payload
}) 