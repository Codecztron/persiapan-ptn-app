import React from "react";
import { PredictionResult as PredictionResultType } from "../types";

interface PredictionResultProps {
  averageGrade: number;
  prediction: PredictionResultType;
  grades: number[];
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  averageGrade,
  prediction,
  grades,
}) => {
  const {
    chance_snbp,
    chance_snbt,
    required_increase,
    snbp_ref,
    snbt_ref,
    total_applicants_snbp,
    accepted_snbp,
    total_applicants_snbt,
    accepted_snbt,
    keketatan_snbp,
    keketatan_snbt,
  } = prediction;

  const target_average = (snbp_ref ?? 0) + 2;

  // Fungsi untuk mengubah format keketatan
  const formatKeketatan = (keketatan: number | null): string => {
    if (keketatan === null) {
      return "N/A";
    }
    const pembilang = 1;
    const penyebut = Math.round(pembilang / keketatan);
    return `${pembilang}:${penyebut}`;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Prediksi Peluang</h2>
      {snbp_ref !== null && (
        <p className="mb-2">
          Nilai Referensi SNBP: <strong>{snbp_ref.toFixed(2)}</strong>
        </p>
      )}
      {snbp_ref !== null && (
        <p className="mb-2">
          Nilai aman SNBP untuk jurusan ini:{" "}
          <strong>{target_average.toFixed(2)}</strong>
        </p>
      )}
      {snbt_ref !== null && (
        <p className="mb-2">
          Nilai Referensi SNBT: <strong>{snbt_ref.toFixed(2)}</strong>
        </p>
      )}

      {/* Tabel */}
      {(chance_snbp !== null || chance_snbt !== null) && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Jalur</th>
                <th className="px-4 py-2">Peluang</th>
                <th className="px-4 py-2">Pendaftar</th>
                <th className="px-4 py-2">Diterima</th>
                <th className="px-4 py-2">Keketatan</th>
              </tr>
            </thead>
            <tbody>
              {chance_snbp !== null && (
                <tr>
                  <td className="border px-4 py-2">SNBP</td>
                  <td className="border px-4 py-2">
                    {chance_snbp.toFixed(2)}%
                  </td>
                  <td className="border px-4 py-2">{total_applicants_snbp}</td>
                  <td className="border px-4 py-2">{accepted_snbp}</td>
                  <td className="border px-4 py-2">
                    {formatKeketatan(keketatan_snbp)}
                  </td>
                </tr>
              )}
              {chance_snbt !== null && (
                <tr>
                  <td className="border px-4 py-2">SNBT</td>
                  <td className="border px-4 py-2">
                    {chance_snbt.toFixed(2)}%
                  </td>
                  <td className="border px-4 py-2">{total_applicants_snbt}</td>
                  <td className="border px-4 py-2">{accepted_snbt}</td>
                  <td className="border px-4 py-2">
                    {formatKeketatan(keketatan_snbt)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Saran */}
      {required_increase !== null && averageGrade < (snbp_ref ?? 0) && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <h3 className="font-bold">Saran:</h3>
          {grades.filter((g) => g > 0).length < 5 && (
            <p className="mb-2">
              Kamu saat ini berada di semester{" "}
              {grades.filter((g) => g > 0).length}
            </p>
          )}
          {grades.filter((g) => g > 0).length < 5 && (
            <>
              {(() => {
                const current_semester = grades.filter((g) => g > 0).length;
                const remaining_semesters = 5 - current_semester;
                const k = 0.5;
                const total_weight = Array.from(
                  { length: remaining_semesters },
                  (_, i) => k ** i,
                ).reduce((a, b) => a + b, 0);
                let current_average = averageGrade;

                return Array.from({ length: remaining_semesters }, (_, i) => {
                  const increase = (required_increase * k ** i) / total_weight;
                  const target_grade = Math.min(
                    current_average + increase,
                    100,
                  );
                  current_average = target_grade;
                  return (
                    <p key={i} className="mb-1">
                      - Semester {current_semester + 1 + i}: Dapatkan nilai
                      minimal <strong>{target_grade.toFixed(2)}</strong>
                    </p>
                  );
                });
              })()}
            </>
          )}
          <p>
            Target nilai aman untuk masuk jurusan ini adalah{" "}
            <strong>{target_average.toFixed(2)}</strong>
          </p>
        </div>
      )}

      {averageGrade >= (snbp_ref ?? 0) && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <p className="font-bold">
            Selamat! Nilai rata-rata rapormu sudah memenuhi syarat untuk
            mendaftar di jurusan ini. Pertahankan prestasimu!
          </p>
          <p>
            Target nilai aman untuk masuk jurusan ini adalah{" "}
            <strong>{target_average.toFixed(2)}</strong>
          </p>
        </div>
      )}

      {/* Pesan jika data tidak ditemukan */}
      {snbp_ref === null && chance_snbp === null && chance_snbt === null && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <p>Data universitas atau jurusan tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
