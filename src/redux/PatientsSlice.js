
const initialState = {
    state: {}
}

export const patientsReducer = (action) => {
    switch (action?.type) {
        case ('SAVE_PATIENT_DATA'): {
            return {
                ...initialState,
                state: action?.payload
            }
        }
        default: {
            return {
                initialState
            }
        }
    }
}


export const savePatientData = (payload) => ({
    type: 'SAVE_PATIENT_DATA',
    payload: payload
}) 