"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SectionDetails() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  let parsedKeywords: string[] = [];
  try {
    parsedKeywords = JSON.parse(searchParams.get("keywords") || "[]");
  } catch (error) {
    console.error("Error parsing keywords:", error);
  }
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section && parsedKeywords.length > 0) {
      fetch("/api/ai-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, keywords: parsedKeywords }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setContent(data.content);
          } else {
            setError(data.error || "Failed to generate content.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Failed to fetch content. Please try again.");
          setLoading(false);
        });
    } else {
      setError("Invalid section or keywords.");
      setLoading(false);
    }
  }, [section, parsedKeywords]);

  if (!section || parsedKeywords.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <p className="text-center mt-4 text-red-500">Invalid section or keywords.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <p className="text-center mt-4 text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-4">{section}</h1>
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        {content ? (
          content.includes("\n")
            ? content.split("\n").map((paragraph, index) => (
                <div key={index} className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                </div>
              ))
            : <p className="text-gray-700 leading-relaxed">{content}</p>
        ) : (
          <p className="text-gray-500">No content available.</p>
        )}
      </div>
    </div>
  );
}
