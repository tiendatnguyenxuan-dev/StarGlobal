# AI 3D Asset Organizer

Ứng dụng full-stack hoàn chỉnh giúp phân loại và tổ chức danh sách asset/phòng của một dự án số hóa 3D tự động bằng cách sử dụng Next.js 15 và Gemini 2.5 Flash API.

## Mục tiêu Dự án
Giúp các nhà phát triển và thiết kế 3D nhanh chóng chuẩn hóa tên gọi, phân loại phòng/asset, tạo ra các URL-friendly slugs chuẩn chỉnh (camelCase hoặc kebab-case) từ danh sách text thô hoặc JSON đầu vào.

---

## Kiến trúc Dự án
Ứng dụng sử dụng mô hình Next.js App Router kết hợp giữa Client Components và Route Handlers (Serverless API):

1. **Frontend (Client-side)**:
   - Sử dụng **React** và **TypeScript** quản lý trạng thái tải (loading), dữ liệu phản hồi (data), và thông báo lỗi (error validation).
   - Thiết kế giao diện rõ ràng, sạch sẽ và dễ dùng bằng **Tailwind CSS**.
   - Bố cục linh hoạt: 2 cột trên Desktop (nhập liệu ở bên trái, kết quả ở bên phải) và tự động chuyển về 1 cột trên Mobile.

2. **Backend (Server-side API)**:
   - Route handler `app/api/organize/route.ts` tiếp nhận dữ liệu đầu vào.
   - Gửi yêu cầu HTTP POST trực tiếp đến **Gemini REST API** (`gemini-2.5-flash`).
   - Sử dụng `generationConfig` của Gemini với `responseMimeType: "application/json"` và cấu hình `responseSchema` để đảm bảo kết quả trả về là một cấu trúc JSON chính xác tuyệt đối theo khuôn mẫu yêu cầu.

---

## Sơ đồ cấu trúc thư mục

```text
StarGlobal/
├── app/
│   ├── api/
│   │   └── organize/
│   │       └── route.ts       # Route Handler gọi Gemini REST API
│   ├── globals.css            # CSS toàn cục cho Tailwind
│   ├── layout.tsx             # Layout chính của Next.js
│   └── page.tsx               # Trang chính (Layout 2 cột & State)
├── components/
│   ├── AssetInput.tsx         # Textarea nhập danh sách asset & Nút submit
│   ├── CategoryCard.tsx       # Hiển thị bảng asset đã phân nhóm & đề xuất slug
│   ├── MetadataCard.tsx       # Hiển thị thống kê và tên dự án tổng hợp
│   └── ImprovementsCard.tsx   # Hiển thị đề xuất cải tiến của AI
├── types/
│   └── organizer.ts           # Khai báo kiểu dữ liệu TypeScript (Strict Types)
├── .env.local                 # Khai báo GEMINI_API_KEY
├── next.config.ts             # Cấu hình Next.js
├── postcss.config.mjs         # Cấu hình PostCSS cho Tailwind
├── tailwind.config.ts         # Cấu hình Tailwind CSS
├── tsconfig.json              # Cấu hình TypeScript compiler
└── package.json               # Các package dependency cài đặt
```

---

## Hướng dẫn Thiết lập và Chạy ứng dụng

### 1. Cài đặt Dependencies
Chạy lệnh dưới đây tại thư mục gốc của dự án để cài đặt tất cả các thư viện cần thiết:
```bash
npm install
```

### 2. Cấu hình Biến môi trường
Tạo file `.env.local` ở thư mục gốc (hoặc sử dụng file đã được tạo sẵn) và điền khóa API Gemini của bạn:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Lưu ý: Bạn có thể lấy khóa API miễn phí hoặc trả phí tại [Google AI Studio](https://aistudio.google.com/).*

### 3. Chạy ở môi trường Development
Chạy dev server cục bộ:
```bash
npm run dev
```
Sau khi chạy thành công, truy cập ứng dụng tại địa chỉ: [http://localhost:3000](http://localhost:3000).

### 4. Build Product Bundle (Tùy chọn)
Để build phiên bản chạy tối ưu nhất cho sản xuất, hãy chạy:
```bash
npm run build
npm start
```
