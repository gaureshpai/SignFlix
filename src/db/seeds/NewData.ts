

// Helper function to generate random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};



// Generate 20 users
const firstNames = [
  "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Skyler", "Dakota", "Jamie", "Cameron"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Martinez"
];

const randomElement = (arr: string | any[]) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate random dates


const users = Array.from({ length: 20 }, (_, i) => {
  const isPatient = i % 2 === 0; // Every second user is a patient
  const role = isPatient ? 'patient' : ['admin', 'provider'][Math.floor(Math.random() * 2)];

  return {
    id: crypto.randomUUID(),
    name: `${randomElement(firstNames)} ${randomElement(lastNames)}`, // Random first and last name
    role: role,
    gender: Math.random() > 0.5 ? 'male' : 'female',
    date_of_birth: randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)).toISOString().split('T')[0],
    email: `user${i + 1}@example.com`,
    emailVerified: randomDate(new Date(2020, 0, 1), new Date()).toISOString(),
    image: `https://example.com/avatar${i + 1}.jpg`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
});



// Generate addresses
const cities = [
 { name: "New York", state: "NY", zip: "10001" },
 { name: "Los Angeles", state: "CA", zip: "90001" },
 { name: "Chicago", state: "IL", zip: "60601" },
 { name: "Houston", state: "TX", zip: "77001" },
 { name: "Phoenix", state: "AZ", zip: "85001" },
 { name: "Philadelphia", state: "PA", zip: "19101" },
 { name: "San Antonio", state: "TX", zip: "78201" },
 { name: "San Diego", state: "CA", zip: "92101" },
 { name: "Dallas", state: "TX", zip: "75201" },
 { name: "San Jose", state: "CA", zip: "95101" }
];

const streetNames = [
 "Main St", "Oak Ave", "Park Rd", "Elm St", "Washington Blvd",
 "Lake Dr", "River Rd", "Mountain View", "Sunset Blvd", "Forest Lane"
];


   const city = cities[Math.floor(Math.random() * cities.length)];
    const streetNumber = Math.floor(Math.random() * 9000) + 1000;
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];


const addresses =Array.from({ length: users.length }, (_, i) => ({
  id: crypto.randomUUID(),
  address_line_1: `${streetNumber} ${streetName}`,
  address_line_2: `Apt ${100 + i}`,
  city: city.name,
      state: city.state,
      zip: city.zip,
  country: "USA"
}));


// Generate patients
const patients = users.filter(user => user.role === 'patient').map((user, i) => ({
  id: crypto.randomUUID(),
  user_id: user.id,
  phone_number: `555${100000 + i}`,
  address: addresses[i].id,
  height: (150 + Math.random() * 50).toFixed(2),
  weight: Math.floor(50 + Math.random() * 100),
  occupation: ["Teacher", "Engineer", "Doctor", "Artist"][Math.floor(Math.random() * 4)],
  marital_status: ["Married", "Single", "Divorced", "Widowed"][Math.floor(Math.random() * 4)],
  emergency_contact_name: `${["John", "Jane", "Michael", "Sarah"][Math.floor(Math.random() * 4)]} ${["Smith", "Johnson", "Williams", "Brown"][Math.floor(Math.random() * 4)]}`,
  emergency_contact_relationship: ["Spouse", "Parent", "Sibling", "Friend"][Math.floor(Math.random() * 4)],
  emergency_contact_number: `555${200000 + i}`,
  socialHistory: "Patient reports moderate alcohol consumption (2-3 drinks per week) and is a non-smoker. Exercises regularly, primarily through jogging and yoga.",
  past_medical_history: "History of hypertension (diagnosed 5 years ago, well-controlled with medication). Appendectomy at age 15. No other significant surgical history.",
  family_medical_history: "Father had type 2 diabetes and died of a heart attack at age 65. Mother is 70 with osteoarthritis. Maternal grandmother had breast cancer at age 55, survived.",
  blood_type: ["A positive", "B negative", "O positive", "AB negative"][Math.floor(Math.random() * 4)],
  primary_care_physician: users.find(u => u.role === 'provider')?.id || null,
  preferred_language: ["English", "Spanish", "Vietnamese", "Mandarin", "Portuguese"][Math.floor(Math.random() * 5)],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  notes: "Patient is generally compliant with medication regimen and follow-up appointments. Expressed interest in nutritional counseling for weight management. Consider referral to dietitian."
 }));



// Generate providers
const providers = users.filter(user => user.role === 'provider').map((user, i) => ({
  id: crypto.randomUUID(),
  user_id: user.id,
  specialty: ["Cardiology", "Pediatrics", "Neurology", "Oncology"][Math.floor(Math.random() * 4)],
  license_number: `LIC${100000 + i}`,
  provider_qualification: Math.random() > 0.7 ? "NP" : "MD"
}));

// Generate admins
const admins = users.filter(user => user.role === 'admin').map(user => ({
  id: crypto.randomUUID(),
  user_id: user.id
}));

// Generate appointments
const appointments = patients.flatMap(patient => 
  Array.from({ length: 2 }, () => ({
    id: crypto.randomUUID(),
    reason: "Annual check-up",
    patient_id: patient.id,
    provider_id: providers[Math.floor(Math.random() * providers.length)].id,
    scheduled_date: randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))).toISOString(),
    timeSlotIndex: Math.floor(Math.random() * 24),
    location: ["Main Clinic", "Downtown Office", "North Branch"][Math.floor(Math.random() * 3)],
    type: ["new_patient", "follow_up", "annual_physical"][Math.floor(Math.random() * 3)],
    status: ["scheduled", "cancelled", "completed"][Math.floor(Math.random() * 3)],
    notes: "Patient requested early morning appointment."
  }))
);

// Generate encounters
const encounters = appointments.map(appointment => ({
  id: crypto.randomUUID(),
  appointment_id: appointment.id,
  date: new Date(appointment.scheduled_date).toISOString().split('T')[0],
  time: new Date(appointment.scheduled_date).toTimeString().split(' ')[0],
  encounter_type: ["inpatient", "outpatient", "emergency"][Math.floor(Math.random() * 3)],
  chief_complaint: "Patient reports persistent headaches",
  assessment_and_plan: "Prescribed pain medication and ordered further tests",
  notes: "Follow-up appointment scheduled in 2 weeks",
  updated_at: new Date().toISOString()
}));

// Generate allergies
const allergies = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  encounter_id: encounter.id,
  allergen: ["Peanuts", "Penicillin", "Latex", "Shellfish"][Math.floor(Math.random() * 4)],
  allergy_reaction: ["Rash", "Anaphylaxis", "Swelling", "Difficulty breathing"][Math.floor(Math.random() * 4)],
  severity: ["mild", "moderate", "severe"][Math.floor(Math.random() * 3)],
  note: "Patient advised to avoid allergen",
  updated_At: new Date().toISOString(),
  created_At: new Date().toISOString()
}));

// Generate diagnoses
const diagnoses = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  diagnosis_name: ["Hypertension", "Type 2 Diabetes", "Asthma", "Migraine"][Math.floor(Math.random() * 4)],
  diagnosis_code: ["I10", "E11", "J45", "G43"][Math.floor(Math.random() * 4)],
  encounter_id: encounter.id,
  severity: ["mild", "moderate", "severe"][Math.floor(Math.random() * 3)],
  note: "Patient education provided on management strategies",
  updated_At: new Date().toISOString(),
  created_At: new Date().toISOString()
}));

// Generate immunizations
const immunizations = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  vaccine_name: ["Influenza", "COVID-19", "Tdap", "MMR"][Math.floor(Math.random() * 4)],
  site: ["Left arm", "Right arm", "Left thigh", "Right thigh"][Math.floor(Math.random() * 4)],
  vaccination_date: new Date(encounter.date).toISOString().split('T')[0],
  vaccination_time: new Date(encounter.date + 'T' + encounter.time).toTimeString().split(' ')[0],
  encounter_id: encounter.id,
  vaccinator: `Dr. ${["Smith", "Johnson", "Williams", "Brown"][Math.floor(Math.random() * 4)]}`
}));

// Generate insurance
const insurances = patients.map(patient => ({
  id: crypto.randomUUID(),
  encounter_id: encounters.find(e => appointments.find(a => a.id === e.appointment_id)?.patient_id === patient.id)?.id!,
  patient_id: patient.id,
  insurance_provider: ["Blue Cross", "Aetna", "UnitedHealth", "Cigna"][Math.floor(Math.random() * 4)],
  policy_number: `POL${100000 + Math.floor(Math.random() * 900000)}`,
  group_number: `GRP${10000 + Math.floor(Math.random() * 90000)}`
}));

// Generate labs
const labs = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  encounter_id: encounter.id,
  test_Name: ["Complete Blood Count", "Lipid Panel", "Thyroid Function", "Metabolic Panel"][Math.floor(Math.random() * 4)],
  test_Code: ["CBC", "LIPID", "TSH", "CMP"][Math.floor(Math.random() * 4)],
  status: ["pending", "completed", "cancelled"][Math.floor(Math.random() * 3)],
  note: "Fasting required for 12 hours before test",
  result: "Within normal range",
  result_Date: new Date(new Date(encounter.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  date_Ordered: new Date(encounter.date).toISOString()
}));

// Generate medications
const medications = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  encounter_id: encounter.id,
  medication_name: ["Lisinopril", "Metformin", "Levothyroxine", "Atorvastatin"][Math.floor(Math.random() * 4)],
  code: ["LIS", "MET", "LEV", "ATO"][Math.floor(Math.random() * 4)],
  dosage: ["10mg", "500mg", "50mcg", "20mg"][Math.floor(Math.random() * 4)],
  frequency: ["Once daily", "Twice daily", "Every 8 hours", "As needed"][Math.floor(Math.random() * 4)],
  route: Math.random() > 0.8 ? "IV" : "oral",
  status: ["active", "Inactive", "suspended", "completed"][Math.floor(Math.random() * 4)],
  note: "Take with food",
  start_date: new Date(encounter.date).toISOString(),
  end_date: new Date(new Date(encounter.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
}));

// Generate procedures
const procedures = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  name: ["X-ray", "MRI", "CT Scan", "Ultrasound"][Math.floor(Math.random() * 4)],
  description: "Diagnostic imaging procedure",
  duration: "01:00:00",
  date: new Date(encounter.date).toISOString().split('T')[0],
  status: ["completed", "incomplete", "cancelled"][Math.floor(Math.random() * 3)],
  note: "Patient tolerated procedure well",
  encounter_id: encounter.id
}));



// Generate Vital Signs data
const vitalSigns = encounters.map(encounter => ({
  id: crypto.randomUUID(),
  encounter_id: encounter.id,
  height: (150 + Math.random() * 50).toFixed(2),
  weight: Math.floor(50 + Math.random() * 50),
  systolic_pressure: Math.floor(100 + Math.random() * 60),
  diastolic_pressure: Math.floor(60 + Math.random() * 40),
  heart_rate: Math.floor(60 + Math.random() * 40),
  body_temperature: (36.5 + Math.random() * 2).toFixed(2),
  respiratory_rate: Math.floor(12 + Math.random() * 8),
  oxygen_saturation: (95 + Math.random() * 5).toFixed(2),
  bmi: (18.5 + Math.random() * 15).toFixed(2),
  measured_at: new Date(encounter.date + 'T' + encounter.time).toISOString(),
}));



console.log(JSON.stringify({
  users,
  addresses,
  patients,
  providers,
  admins,
  appointments,
  encounters,
  allergies,
  diagnoses,
  immunizations,
  insurances,
  labs,
  medications,
  procedures,
vitalSigns
}, null, 2));


