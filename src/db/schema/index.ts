export { default as AdminTable, AdminsRelations } from "./admin";
export { AllergiesRelations, default as AllergiesTable, Severity } from "./allergy";
export {
    AppointmentRelations,
    default as AppointmentTable, Appointment_type, Apt_Status} from "./appointment";
export { DiagnosisRelations, default as DiagnosisTable, severity } from "./diagnosis";
export { AccountsTable, SessionsTable, default as UserTable, UsersRelations, VerificationTokensTable, userRoles, gender_id } from "./user";

export {
    ProviderPatientRelations,
    default as ProviderPatientTable
} from "./provider_patient";

export { default as ProviderTable, providerRelations, provider_type } from "./provider";

export { EncounterRelations, default as EncounterTable, Encounter_type } from "./encounter";

export {
    ImmunizationRelations,
    default as ImmunizationTable
} from "./immunization";

export { InsuranceRelations, default as InsuranceTable } from "./insurance";

export { LabRelations, default as LabTable, lab_status } from "./labs";

export { MedicationRelations, default as MedicationTable, Med_Route, Med_Status } from "./medication";

export { VitalSignRelations, default as VitalSignTable } from "./vitalsign";

export { PatientRelations, default as PatientTable, bloodTypes, marital_status, preferred_language } from "./patient";

export { ProcedureRelations, default as ProcedureTable, procedure_status } from "./procedure";

export { default as AddressTable, AddressRelations } from "./address";