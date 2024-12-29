import { UniversityData } from "../types";
import { useState, useEffect } from "react";

interface UniversitySelectionProps {
  data: UniversityData[] | null;
  onSelectionChange: (university: string, major: string) => void;
}

const UniversitySelection: React.FC<UniversitySelectionProps> = ({
  data,
  onSelectionChange,
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [universities, setUniversities] = useState<string[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [universityInput, setUniversityInput] = useState<string>("");
  const [majorInput, setMajorInput] = useState<string>("");

  useEffect(() => {
    if (data) {
      const uniqueUniversities = Array.from(
        new Set(data.map((item) => item.UNIV)),
      );
      setUniversities(uniqueUniversities);
      setSelectedUniversity(uniqueUniversities[0] ?? "");
    }
  }, [data]);

  useEffect(() => {
    if (data && selectedUniversity) {
      const filteredMajors = data
        .filter((item) => item.UNIV === selectedUniversity)
        .map((item) => item.JURUSAN);
      setMajors(filteredMajors);
      setSelectedMajor(filteredMajors[0] ?? "");
    }
  }, [data, selectedUniversity]);

  useEffect(() => {
    if (selectedUniversity && selectedMajor) {
      onSelectionChange(selectedUniversity, selectedMajor);
    }
  }, [selectedUniversity, selectedMajor, onSelectionChange]);

  const filterUniversities = (value: string) => {
    if (!universities || !value) return universities;
    return universities.filter((uni) =>
      uni?.toLowerCase().includes(value.toLowerCase()),
    );
  };

  const filterMajors = (value: string) => {
    if (!majors || !value) return majors;
    return majors.filter((major) =>
      major?.toLowerCase().includes(value.toLowerCase()),
    );
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">
        Pilihan Universitas dan Jurusan
      </h3>
      <div className="mb-2">
        <label htmlFor="university" className="block mb-1">
          Pilih Universitas
        </label>
        <input
          id="university"
          type="text"
          value={universityInput}
          onChange={(e) => setUniversityInput(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
          placeholder="Ketik nama universitas..."
        />
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filterUniversities(universityInput).map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="major" className="block mb-1">
          Pilih Jurusan
        </label>
        <input
          id="major"
          type="text"
          value={majorInput}
          onChange={(e) => setMajorInput(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
          placeholder="Ketik nama jurusan..."
        />
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filterMajors(majorInput).map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UniversitySelection;
