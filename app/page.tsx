"use client";

import React, { useState } from "react";
import AssetInput from "@/components/AssetInput";
import MetadataCard from "@/components/MetadataCard";
import ImprovementsCard from "@/components/ImprovementsCard";
import CategoryCard from "@/components/CategoryCard";
import { OrganizeResponse } from "@/types/organizer";

export default function Home() {
  const [data, setData] = useState<OrganizeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrganize = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/organize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Đã xảy ra lỗi không xác định.");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message || "Không thể kết nối đến server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">AI 3D Asset Organizer</h1>
          <p className="text-xs text-gray-500 mt-1">
            Phân loại danh sách asset/phòng của dự án số hóa 3D tự động bằng Gemini API
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Input */}
          <div className="bg-white p-5 border border-gray-200 rounded-md shadow-sm h-fit">
            <AssetInput onSubmit={handleOrganize} isLoading={isLoading} serverError={error} />
          </div>

          {/* Column 2: Results */}
          <div className="space-y-4">
            {data ? (
              <>
                <MetadataCard metadata={data.metadata} />
                <ImprovementsCard improvements={data.improvements} />
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 px-1">Kết quả Phân loại</h3>
                  {data.categories.map((category, index) => (
                    <CategoryCard key={index} category={category} />
                  ))}
                </div>
              </>
            ) : (
              <div className="min-h-[300px] border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center p-6 text-center bg-white shadow-sm">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-sm text-gray-500">Gemini đang phân tích và tổ chức lại danh sách của bạn...</p>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <p className="text-sm font-bold text-gray-700">Chưa có dữ liệu</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                      Nhập danh sách asset ở cột bên trái và nhấn nút "Tổ chức Asset" để bắt đầu phân tích.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
