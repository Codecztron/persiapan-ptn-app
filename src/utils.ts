import { UniversityData, PredictionResult } from "./types";

export function calculateAverageGrade(grades: number[]): number {
  const filledGrades = grades.filter((grade) => grade > 0);
  return filledGrades.length > 0
    ? filledGrades.reduce((a, b) => a + b, 0) / filledGrades.length
    : 0;
}

// Hapus fungsi visualizeGrades dari sini

function ratioToFloat(ratioStr: string): number {
  const match = ratioStr.match(/(\d+):(\d+)/);
  if (match) {
    try {
      return parseFloat(match[1]) / parseFloat(match[2]);
    } catch (e) {
      return 0.0;
    }
  } else {
    return 0.0;
  }
}

export function predictChance(
  df: UniversityData[] | null,
  university: string,
  major: string,
  averageGrade: number,
  snbpRefManual: number | null = null,
): PredictionResult {
  if (df) {
    const filteredData = df.find(
      (data) => data.UNIV === university && data.JURUSAN === major,
    );

    if (!filteredData) {
      return {
        chance_snbp: null,
        chance_snbt: null,
        required_increase: null,
        snbp_ref: null,
        snbt_ref: null,
        total_applicants_snbp: null,
        accepted_snbp: null,
        total_applicants_snbt: null,
        accepted_snbt: null,
        keketatan_snbp: null,
        keketatan_snbt: null,
      };
    }

    const totalApplicantsSnbp = filteredData["PENDAFTAR SNBP"] || 0;
    const acceptedSnbp = filteredData["DITERIMA SNBP"] || 0;
    const totalApplicantsSnbt = filteredData["PENDAFTAR SNBT"] || 0;
    const acceptedSnbt = filteredData["DITERIMA SNBT"] || 0;
    const snbpRef = parseFloat(filteredData.SNBP) || 0.0;
    const snbtRef = parseFloat(filteredData.SNBT) || 0.0;
    const keketatanSnbp = ratioToFloat(filteredData["KEKETATAN SNBP"]);
    const keketatanSnbt = ratioToFloat(filteredData["KEKETATAN SNBT"]);

    const chanceSnbp =
      totalApplicantsSnbp > 0 ? (acceptedSnbp / totalApplicantsSnbp) * 100 : 0;
    const chanceSnbt =
      totalApplicantsSnbt > 0 ? (acceptedSnbt / totalApplicantsSnbt) * 100 : 0;

    let requiredIncrease = null;
    if (averageGrade < snbpRef) {
      requiredIncrease = snbpRef + 2 - averageGrade;
    }

    return {
      chance_snbp: chanceSnbp,
      chance_snbt: chanceSnbt,
      required_increase: requiredIncrease,
      snbp_ref: snbpRef,
      snbt_ref: snbtRef,
      total_applicants_snbp: totalApplicantsSnbp,
      accepted_snbp: acceptedSnbp,
      total_applicants_snbt: totalApplicantsSnbt,
      accepted_snbt: acceptedSnbt,
      keketatan_snbp: keketatanSnbp,
      keketatan_snbt: keketatanSnbt,
    };
  } else {
    let requiredIncrease = null;
    if (averageGrade < (snbpRefManual ?? 0)) {
      requiredIncrease = (snbpRefManual ?? 0) + 2 - averageGrade;
    }
    return {
      chance_snbp: null,
      chance_snbt: null,
      required_increase: requiredIncrease,
      snbp_ref: snbpRefManual,
      snbt_ref: null,
      total_applicants_snbp: null,
      accepted_snbp: null,
      total_applicants_snbt: null,
      accepted_snbt: null,
      keketatan_snbp: null,
      keketatan_snbt: null,
    };
  }
}
