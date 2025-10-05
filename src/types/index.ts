
export type UserRole = 'patient' | 'doctor' | 'intern';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  hospital?: string;
  bio?: string;
  yearsExperience: number;
  education?: string[];
  freeCommunityHours: number;
  rating: number;
  availability?: string[];
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  medicalHistory?: MedicalRecord[];
  upcomingAppointments?: Appointment[];
}

export interface Intern extends User {
  role: 'intern';
  hospital?: string;
  supervisor?: string;
  yearOfResidency: number;
  specialty?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  attachments?: string[];
  followUpDate?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  isVirtual: boolean;
}

export interface AIAnalysis {
  id: string;
  patientId: string;
  createdAt: string;
  symptoms: string[];
  possibleConditions: {
    condition: string;
    probability: number;
  }[];
  recommendedTests?: string[];
  severity: 'low' | 'medium' | 'high';
  doctorVerified: boolean;
  doctorId?: string;
  doctorNotes?: string;
}

export interface ImageAnalysis {
  id: string;
  patientId: string;
  imageUrl: string;
  analysisType: 'x-ray' | 'mri' | 'ct-scan' | 'ultrasound' | 'dermatology';
  aiDiagnosis: string;
  aiConfidence: number;
  doctorVerified: boolean;
  doctorId?: string;
  doctorNotes?: string;
}
