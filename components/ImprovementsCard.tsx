import React from "react";

interface ImprovementsCardProps {
  improvements: string[];
}

export default function ImprovementsCard({ improvements }: ImprovementsCardProps) {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
      <h3 className="text-sm font-bold text-gray-850 border-b border-gray-100 pb-2 mb-3">
        Đề xuất & Ý kiến Cải thiện từ AI
      </h3>
      <ul className="list-disc list-inside space-y-2 text-xs text-gray-600">
        {improvements.map((improvement, idx) => (
          <li key={idx} className="leading-relaxed">
            <span className="text-gray-800">{improvement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
