import { NextResponse } from "next/server";
import { OrganizeResponse } from "@/types/organizer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { text } = body;

    // 1. Validate input
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Dữ liệu đầu vào không được để trống." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY chưa được cấu hình ở backend." },
        { status: 500 }
      );
    }

    // 2. Call Gemini REST API
    // Using gemini-2.5-flash as requested
    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a Senior 3D Pipeline and Asset Management specialist.
Analyze the provided raw list of 3D assets, rooms, or items and organize them into logical categories.
Create a suitable URL-friendly camelCase or kebab-case slug for each asset.
Determine an appropriate project name based on the assets listed.
Provide constructive suggestions or improvements for naming consistency or catalog structure.

You must return response in STRICT JSON format matching the schema. Do not output any markdown wrapper or explanation, output ONLY raw JSON.`;

    const schema = {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Name of the category, e.g., Bedroom, Kitchen, Utility" },
              assets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    originalName: { type: "string", description: "The original name from the input list" },
                    suggestedSlug: { type: "string", description: "Clean URL-friendly slug, e.g., bedroom-01, kitchen-sink" }
                  },
                  required: ["originalName", "suggestedSlug"]
                }
              }
            },
            required: ["name", "assets"]
          }
        },
        metadata: {
          type: "object",
          properties: {
            projectName: { type: "string", description: "Synthesized project name based on the inputs" },
            totalAssets: { type: "integer", description: "Total count of assets processed" },
            totalCategories: { type: "integer", description: "Total count of categories created" }
          },
          required: ["projectName", "totalAssets", "totalCategories"]
        },
        improvements: {
          type: "array",
          items: { type: "string", description: "List of pipeline improvements or comments" }
        }
      },
      required: ["categories", "metadata", "improvements"]
    };

    const apiBody = {
      contents: [
        {
          parts: [
            {
              text: `Here is the list of 3D assets to organize:\n\n${text}`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemPrompt
          }
        ]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      return NextResponse.json(
        { error: `Gemini API trả về lỗi: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { error: "Không nhận được phản hồi hợp lệ từ Gemini." },
        { status: 500 }
      );
    }

    // 3. Parse JSON response
    let parsedData: OrganizeResponse;
    try {
      parsedData = JSON.parse(rawText.trim());
    } catch (parseError) {
      console.error("Failed to parse Gemini output:", rawText, parseError);
      return NextResponse.json(
        { error: "Dữ liệu trả về từ AI không đúng định dạng JSON hợp lệ." },
        { status: 500 }
      );
    }

    // 4. Validate parsed JSON structure
    if (
      !parsedData.categories ||
      !Array.isArray(parsedData.categories) ||
      !parsedData.metadata ||
      typeof parsedData.metadata.totalAssets !== "number" ||
      !Array.isArray(parsedData.improvements)
    ) {
      return NextResponse.json(
        { error: "Cấu trúc JSON phản hồi từ AI không đúng cấu trúc yêu cầu." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("API Router Error:", error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi nội bộ ở server." },
      { status: 500 }
    );
  }
}
