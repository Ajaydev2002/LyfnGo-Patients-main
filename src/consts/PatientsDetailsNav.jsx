import PatientInfo from "../pages/PatientInfo";
import VitalSign from "../pages/VitalSign";
import ClinicalNotes from "../pages/ClinicalNotes";
import Prescription from "../pages/Prescription";
import Files from "../pages/Files";
import VisitHistory from "../pages/VisitHistory";
import LabOrder from "../pages/LabOrders";
import Treatment from "../pages/Treatment";
import Procedure from "../pages/Procedure";
import Appointment from "../pages/Appointment";
import HealthBoard from "../pages/Healthboard";
import Billing from "../pages/Billing";
import NewPrescription from "../pages/NewPrescription";

const PatientsDeatailsNav = [
    {
        id: 1,
        segment: '/Patient details',
        title: 'Patient details',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Patients_icon.svg",
        component: PatientInfo,
    },
    {
        id: 2,
        segment: '/Healthboard',
        title: 'Healthboard',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Healthboard_icon.svg",
        component: HealthBoard,
    },
    {
        id: 3,
        segment: '/Appointments',
        title: 'Appointments',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Appointments_icon.svg",
        component: Appointment ,
    },
    {
        id: 4,
        segment: '/Communication',
        title: 'Communication',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Channel_icon.svg",
        component: HealthBoard,
    },
    {
        id: 5,
        segment: '/Vital signs',
        title: 'Vital signs',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Vitalsigns_icon.svg",
        component: VitalSign,
    },
    {
        id: 6,
        segment: '/Visit History',
        title: 'Visit History',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Visits_History_icon.svg",
        component: VisitHistory,
    },
    {
        id: 7,
        segment: '/Clinical notes',
        title: 'Clinical notes',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Clinical_notes_icon.svg",
        component: ClinicalNotes,
    },
    {
        id: 8,
        segment: '/Prescription',
        title: 'Prescription',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Prescription_icon.svg",
        component: Prescription,
    },
    {
        id: 9,
        segment: '/Files',
        title: 'Files',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Files_icon.svg",
        component: Files,
    },
    {
        id: 10,
        segment: '/Lab Orders',
        title: 'Lab Orders',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Laborders_icon.svg",
        component: LabOrder,
    },
    {
        id: 11,
        segment: '/Treatment',
        title: 'Treatment',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Treatment_icon.svg",
        component: Treatment,
    },
    {
        id: 12,
        segment: '/Procedure',
        title: 'Procedure',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Procedure_icon.svg",
        component: Procedure,
    },
    {
        id: 13,
        segment: '/Billing',
        title: 'Billing',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Billing_icon.svg",
        component: Billing,
    },
    {
        id: 14,
        segment: '/Membership',
        title: 'Membership',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Membership_icon.svg",
        component: HealthBoard,
    },
    {
        id: 15,
        segment: '/Treatment plan',
        title: 'Treatment plan',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Treatmentplan_icon.svg",
        component: HealthBoard,
    },
    {
        id: 16,
        segment: '/Billing History',
        title: 'Billing History',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Billinghistory_icon.svg",
        component: HealthBoard,
    },
    {
        id: 17,
        segment: '/Patient feed',
        title: 'Patient feed',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Feed_icon.svg",
        component: HealthBoard,
    },
    {
        id: 18,
        segment: '/Review',
        title: 'Review',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Review_icon.svg",
        component: HealthBoard,
    },
    {
        id: 19,
        segment: '/Products',
        title: 'Products',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/Products_icon.svg",
        component: NewPrescription,
    },
    {
        id: 20,
        segment: '/Delete patient',
        title: 'Delete patient',
        img: "https://d1cdqhtb2bf9h4.cloudfront.net/B2B_Flash/Info_icons/delete_icon.svg",
        component: HealthBoard,
    },

]

export default PatientsDeatailsNav;