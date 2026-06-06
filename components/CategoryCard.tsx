import React from "react";
import { Category } from "@/types/organizer";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
      <h3 className="text-base font-bold text-gray-850 border-b border-gray-100 pb-2 mb-3 flex items-center justify-between">
        <span>{category.name}</span>
        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {category.assets.length} Assets
        </span>
      </h3>
      <div className="overflow-hidden border border-gray-100 rounded-md">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-55 text-left text-gray-600 font-semibold">
            <tr>
              <th scope="col" className="px-3 py-2">Tên gốc</th>
              <th scope="col" className="px-3 py-2">Slug đề xuất</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {category.assets.map((asset, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-800 font-medium whitespace-nowrap">
                  {asset.originalName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <code className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-mono rounded border border-blue-100">
                    {asset.suggestedSlug}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
