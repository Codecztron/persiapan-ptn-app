export interface UniversityData {
  UNIV: string;
  JURUSAN: string;
  SNBP: string;
  "PENDAFTAR SNBP": number;
  "DITERIMA SNBP": number;
  "KEKETATAN SNBP": string;
  SNBT: string;
  "PENDAFTAR SNBT": number;
  "DITERIMA SNBT": number;
  "KEKETATAN SNBT": string;
}

export interface PredictionResult {
  chance_snbp: number | null;
  chance_snbt: number | null;
  required_increase: number | null;
  snbp_ref: number | null;
  snbt_ref: number | null;
  total_applicants_snbp: number | null;
  accepted_snbp: number | null;
  total_applicants_snbt: number | null;
  accepted_snbt: number | null;
  keketatan_snbp: number | null;
  keketatan_snbt: number | null;
}
