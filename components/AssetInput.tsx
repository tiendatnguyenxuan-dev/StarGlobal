"use client";

import React, { useState } from "react";

interface AssetInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  serverError: string | null;
}

export default function AssetInput({ onSubmit, isLoading, serverError }: AssetInputProps) {
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setLocalError("Dữ liệu đầu vào không được để trống. Vui lòng nhập danh sách asset.");
      return;
    }
    setLocalError(null);
    onSubmit(text);
  };

  const displayError = localError || serverError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="asset-input" className="block text-sm font-semibold text-gray-700 mb-2">
          Nhập danh sách Asset hoặc Phòng
        </label>
        <textarea
          id="asset-input"
          className="w-full h-80 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm resize-none"
          placeholder={`Ví dụ:
Bedroom 1
Bedroom 2
Kitchen
Living Room
Lobby
Electrical Room`}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.trim()) setLocalError(null);
          }}
          disabled={isLoading}
        />
      </div>

      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm" role="alert">
          {displayError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tổ chức Asset...
          </span>
        ) : (
          "Tổ chức Asset"
        )}
      </button>
    </form>
  );
}
