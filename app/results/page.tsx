"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { OutlineSection } from "../api/generate/types";

export default function Results() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || ""; 
  const [outline, setOutline] = useState<OutlineSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (course) {
      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: course }), 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOutline(data.data.sections || []);
          } else {
            setError(data.error || "An unknown error occurred.");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch the outline. Please try again.");
          setLoading(false);
        });
    } else {
      setError("No course selected.");
      setLoading(false);
    }
  }, [course]);

  if (loading) {
    return <p className="text-center mt-4 text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Course Outline for: {course}
      </h1>
      {outline.length > 0 ? (
        <ul className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          {outline.map((item, index) => (
            <li
              key={index}
              className="mb-4 flex items-center justify-between border-b pb-2"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.section}
                </h2>
                <p className="text-gray-600">{item.keywords.join(", ")}</p>
              </div>
              <button
                className="ml-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                onClick={() => router.push( `/details?section=${encodeURIComponent( item.section )}&keywords=${encodeURIComponent( JSON.stringify(item.keywords) )}` ) }
              >
                Learn More
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No outline was generated.</p>
      )}
    </div>
  );
}
