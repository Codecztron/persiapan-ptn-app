import React, { useState } from "react";

interface GradeInputsProps {
  onGradeChange: (grades: number[]) => void;
}

const GradeInputs: React.FC<GradeInputsProps> = ({ onGradeChange }) => {
  const [grades, setGrades] = useState<number[]>(Array(5).fill(0));

  const handleGradeChange = (index: number, value: number) => {
    const newGrades = [...grades];
    newGrades[index] = Math.min(value, 100);
    setGrades(newGrades);
    onGradeChange(newGrades);
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">Data Rapor</h3>
      {grades.map((grade, index) => (
        <div key={index} className="mb-2">
          <label htmlFor={`semester-${index + 1}`} className="block mb-1">
            Nilai Rata-rata Semester {index + 1}
          </label>
          <input
            type="number"
            id={`semester-${index + 1}`}
            min="0"
            max="100"
            step="0.1"
            value={grade}
            onChange={(e) =>
              handleGradeChange(index, parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );
};

export default GradeInputs;
