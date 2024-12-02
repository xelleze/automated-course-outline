"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  name: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/generate");
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCourse = selectedCourse.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
    router.push(`/results?course=${encodeURIComponent(formattedCourse)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Automated Course Outline Generator
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!selectedCourse}
          className={`w-full ${
            selectedCourse ? "bg-primary hover:bg-primary-dark" : "bg-gray-300 cursor-not-allowed"
          } text-white py-3 rounded-md transition-colors`}
        >
          Generate Outline
        </button>
      </form>
    </div>
  );
}
