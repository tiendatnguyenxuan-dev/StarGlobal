import React from "react";
import { Metadata } from "@/types/organizer";

interface MetadataCardProps {
  metadata: Metadata;
}

export default function MetadataCard({ metadata }: MetadataCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
      <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">
        Thông tin Dự án & Thống kê
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-gray-100 rounded p-3 bg-gray-50">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tên dự án</span>
          <span className="block text-sm font-semibold text-gray-800 mt-1 truncate" title={metadata.projectName}>
            {metadata.projectName || "Chưa xác định"}
          </span>
        </div>
        <div className="border border-gray-100 rounded p-3 bg-gray-50">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tổng số Asset</span>
          <span className="block text-lg font-bold text-blue-600 mt-0.5">
            {metadata.totalAssets}
          </span>
        </div>
        <div className="border border-gray-100 rounded p-3 bg-gray-50">
          <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tổng số Nhóm</span>
          <span className="block text-lg font-bold text-green-600 mt-0.5">
            {metadata.totalCategories}
          </span>
        </div>
      </div>
    </div>
  );
}
