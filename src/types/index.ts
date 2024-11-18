import { AdminTypes } from "@/db/schema/admin";
import { AllergyType } from "@/db/schema/allergy";
import { AppointmentType } from "@/db/schema/appointment";
import { DiagnosisType } from "@/db/schema/diagnosis";
import { EncounterTypes } from "@/db/schema/encounter";
import { ImmunizationType } from "@/db/schema/immunization";
import { InsuranceType } from "@/db/schema/insurance";
import { LabType } from "@/db/schema/labs";
import { MedicationType } from "@/db/schema/medication";
import { PatientTypes } from "@/db/schema/patient";
import { ProcedureType } from "@/db/schema/procedure";
import { ProviderTypes } from "@/db/schema/provider";
import { UserTypes } from "@/db/schema/user";
import { VitalSignsType } from "@/db/schema/vitalsign";





export interface SelectEncounter extends EncounterTypes {

  medications: MedicationType[]; 
  diagnoses: DiagnosisType[]; 
  vitalSigns: VitalSignsType[];
  labs: LabType[];
  immunizations: ImmunizationType[];
  allergies: AllergyType[];

  insurance: InsuranceType[];

  procedures: ProcedureType[];  
}


export interface SelectAppointment extends AppointmentType {
  encounter: SelectEncounter[];
}


export interface SelectPatient  extends PatientTypes{
  appointments: SelectAppointment[];
}

export interface SelectUser extends UserTypes {
  patient?: SelectPatient;
  provider?: SelectProvider;
  admin?: AdminTypes;
}



export interface SelectProvider extends ProviderTypes{
 appointments?: SelectAppointment[];
  
  
}

export interface SelectAdmin extends AdminTypes{
  
}
export interface SelectProviderPatient {
  patient_id: "";
  provider_id: "";

  // Relationships
}

export interface CurrentUserResponse {
  user: UserTypes;
  
}

export interface SearchResponse {
  users: SelectUser[];
  newOffset: number | null;
  totalUsers: number;
}

export type SearchError = {
  message?: string;
};



export  interface PatientFormProps {
  onClose: () => void; // Function type for onClose
}


export interface DashboardProps {
  users:SelectUser[]
  offset: number;
  totalUsers: number;
}


export interface EncounterProps {
  encounterId: string,
  onSuccess: () => void 
}