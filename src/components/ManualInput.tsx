import React, { useState, useEffect } from "react";

interface ManualInputProps {
  // onInputChange: (university: string, major: string, snbpRef: number) => void;
  onInputChange: (snbpRef: number) => void;
}

// const ManualInput: React.FC<ManualInputProps> = ({ onInputChange }) => {
//   const [university] = useState<string>("");
//   const [major] = useState<string>("");
//   const [snbpRef, setSnbpRef] = useState<number>(0);

const ManualInput: React.FC<ManualInputProps> = ({ onInputChange }) => {
  const [snbpRef, setSnbpRef] = useState<number>(0);

  // useEffect(() => {
  //   onInputChange(university, major, snbpRef);
  // }, [university, major, snbpRef]);

  useEffect(() => {
    onInputChange(snbpRef);
  }, [snbpRef]);

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">
        Input Manual Nilai Referensi SNBP
      </h3>
      {/* <div className="mb-2">
        <label htmlFor="manual-university" className="block mb-1">
          Masukkan Nama Universitas (Opsional)
        </label>
        <input
          type="text"
          id="manual-university"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="manual-major" className="block mb-1">
          Masukkan Nama Jurusan (Opsional)
        </label>
        <input
          type="text"
          id="manual-major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}
      <div className="mb-2">
        <label htmlFor="manual-snbp-ref" className="block mb-1">
          Masukkan Nilai Referensi SNBP PTN / Target Nilai
        </label>
        <input
          type="number"
          id="manual-snbp-ref"
          min="0"
          max="100"
          step="0.1"
          value={snbpRef}
          onChange={(e) =>
            setSnbpRef(Math.min(parseFloat(e.target.value), 100))
          }
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default ManualInput;
