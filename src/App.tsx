import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { calculateAverageGrade, predictChance } from "./utils";
import { UniversityData } from "./types";
import GradeInputs from "./components/GradeInputs";
import UniversitySelection from "./components/UniversitySelection";
import ManualInput from "./components/ManualInput";
import PredictionResult from "./components/PredictionResult";
import { Chart } from "chart.js/auto";
import { FaUniversity, FaBookOpen, FaDonate } from "react-icons/fa";

declare global {
  interface Window {
    myChart: any;
  }
}

const App: React.FC = () => {
  const [grades, setGrades] = useState<number[]>(Array(5).fill(0));
  const [averageGrade, setAverageGrade] = useState<number>(0);
  const [data, setData] = useState<UniversityData[] | null>(null);
  const [dataSource, setDataSource] = useState<"Database" | "Input Manual">(
    "Database",
  );
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [manualUniversity, setManualUniversity] = useState<string>("");
  const [manualMajor, setManualMajor] = useState<string>("");
  const [manualSnbpRef, setManualSnbpRef] = useState<number>(0);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  const visualizeGrades = (
    grades: number[],
    chartRef: React.RefObject<HTMLCanvasElement>,
  ) => {
    console.log("visualizeGrades terpanggil", grades);
    const semesters = grades.map((_, i) => i + 1);
    const ctx = chartRef.current?.getContext("2d");

    if (ctx) {
      if (window.myChart) {
        window.myChart.destroy();
      }

      window.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: semesters,
          datasets: [
            {
              label: "Nilai Rata-rata",
              data: grades,
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#3B82F6",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Grafik Nilai Rapor",
              font: {
                size: window.innerWidth < 768 ? 14 : 16,
                weight: "bold",
              },
            },
            legend: {
              labels: {
                font: {
                  size: window.innerWidth < 768 ? 12 : 14,
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Semester",
                font: {
                  size: window.innerWidth < 768 ? 12 : 14,
                  weight: "bold",
                },
              },
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: true,
                text: "Nilai Rata-rata",
                font: {
                  size: window.innerWidth < 768 ? 12 : 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(0,0,0,0.1)",
              },
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.csv");
      const reader = response.body?.getReader();
      const result = await reader?.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result?.value);

      Papa.parse(csv, {
        header: true,
        delimiter: ";",
        dynamicTyping: true,
        complete: (results) => {
          setData(results.data as UniversityData[]);
        },
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newAverageGrade = calculateAverageGrade(grades);
    setAverageGrade(newAverageGrade);
    console.log("useEffect untuk chart terpanggil", grades, chartRef.current);

    if (chartRef.current) {
      visualizeGrades(grades, chartRef);
    }

    const prediction = predictChance(
      dataSource === "Database" ? data : null,
      dataSource === "Database" ? selectedUniversity : manualUniversity,
      dataSource === "Database" ? selectedMajor : manualMajor,
      newAverageGrade,
      dataSource === "Input Manual" ? manualSnbpRef : null,
    );
    setPredictionResult(prediction);
  }, [
    grades,
    data,
    dataSource,
    selectedUniversity,
    selectedMajor,
    manualUniversity,
    manualMajor,
    manualSnbpRef,
  ]);

  const handleGradeChange = (newGrades: number[]) => {
    setGrades(newGrades);
  };

  const handleUniversitySelectionChange = (
    university: string,
    major: string,
  ) => {
    setSelectedUniversity(university);
    setSelectedMajor(major);
  };

  const handleManualInputChange = (
    university: string,
    major: string,
    snbpRef: number,
  ) => {
    setManualUniversity(university);
    setManualMajor(major);
    setManualSnbpRef(snbpRef);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="container mx-auto px-4 py-6 sm:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 mb-4 tracking-tight flex flex-col sm:flex-row items-center justify-center">
            <FaUniversity className="mb-2 sm:mb-0 sm:mr-3 text-4xl sm:text-5xl" />
            <span className="text-center">
              Aplikasi Prediksi Peluang SNBP dan SNBT
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-4 flex items-center justify-center">
            <FaBookOpen className="mr-2" />
            by Codecztron (Andri)
          </p>
          <a
            href="https://saweria.co/Codecztron"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            <FaDonate className="mr-2" />
            Donasi via Saweria
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
            <GradeInputs onGradeChange={handleGradeChange} />

            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
                Pilihan Sumber Data
              </h3>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="Database"
                    checked={dataSource === "Database"}
                    onChange={() => setDataSource("Database")}
                    className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">Database</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="Input Manual"
                    checked={dataSource === "Input Manual"}
                    onChange={() => setDataSource("Input Manual")}
                    className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">Input Manual</span>
                </label>
              </div>
            </div>

            {dataSource === "Database" && (
              <UniversitySelection
                data={data}
                onSelectionChange={handleUniversitySelectionChange}
              />
            )}

            {dataSource === "Input Manual" && (
              <ManualInput onInputChange={handleManualInputChange} />
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <span className="text-base sm:text-lg text-gray-700 mb-2 sm:mb-0">
                Rata-rata Nilai Rapor:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-blue-600">
                {averageGrade.toFixed(2)}
              </span>
            </div>

            <div className="bg-gray-100 rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 h-[300px] sm:h-[400px]">
              <canvas ref={chartRef}></canvas>
            </div>

            {predictionResult && (
              <PredictionResult
                averageGrade={averageGrade}
                prediction={predictionResult}
                grades={grades}
              />
            )}

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-100 rounded-xl shadow-md">
              <p className="font-bold text-gray-700 mb-2 text-sm sm:text-base">
                Source: www.mykampus.id
              </p>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                Data berikut diambil pada tahun 2022-2024, dan pasti setiap
                tahun pasti mengalami kenaikan.
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                Semoga bisa menjadi patokan nilai untuk kedepannya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
