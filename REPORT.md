# BÁO CÁO ĐÁNH GIÁ NĂNG LỰC ỨNG VIÊN
## Đề tài: AI 3D Asset Organizer (Option B)

Báo cáo này trình bày chi tiết về quá trình xây dựng ứng dụng, tích hợp mô hình ngôn ngữ lớn (LLM), các khó khăn gặp phải cùng với phần phân tích QA/Tư duy sản phẩm theo yêu cầu của bài test.

---

## 1. Mô tả Chức năng Đã làm (Features Built)
Ứng dụng **AI 3D Asset Organizer** là một web app nhỏ hoàn chỉnh (Fullstack) hỗ trợ tổ chức và chuẩn hóa dữ liệu 3D:
- **Giao diện Nhập liệu (Frontend)**:
  - Textarea hỗ trợ nhập danh sách asset thô bằng văn bản hoặc JSON đơn giản (mỗi dòng một tên phòng/asset).
  - Có cơ chế kiểm tra (validation) dữ liệu trống trước khi gửi đi.
  - Trạng thái chờ xử lý (Loading state) trực quan có spinner quay và vô hiệu hóa (disable) nút bấm để tránh gửi trùng request.
  - Bố cục đáp ứng (Responsive Layout): 2 cột hiển thị song song trên Desktop, tự động chuyển thành 1 cột dọc trên Mobile.
- **Xử lý trung gian (Backend API)**:
  - Route handler `app/api/organize/route.ts` đóng vai trò API trung gian tiếp nhận dữ liệu từ frontend, bảo vệ khóa API an toàn tuyệt đối.
  - Kiểm tra và xử lý lỗi mạng hoặc lỗi phản hồi từ API AI.
- **Tính năng AI ứng dụng**:
  - Tích hợp mô hình `gemini-2.5-flash` qua REST API để tự động phân nhóm asset theo các loại không gian hợp lý.
  - Tự động sinh tên file/slug dạng camelCase hoặc kebab-case chuẩn hóa cho từng asset.
  - Tổng hợp thông tin thống kê dự án (Metadata): Đề xuất tên dự án, đếm số lượng nhóm và số lượng asset.
  - Đề xuất 2-3 cải thiện về cách đặt tên hoặc tối ưu hóa quy trình quản lý pipeline 3D.
  - Hỗ trợ **nhận diện và phản hồi đa ngôn ngữ**: Người dùng nhập tiếng Việt -> AI phản hồi tiếng Việt; nhập tiếng Anh -> AI phản hồi tiếng Anh.

---

## 2. Cách Dùng AI/LLM & Sử dụng Công cụ AI trong Phát triển
### Các công cụ AI đã dùng trong quá trình làm bài:
- **Antigravity (AI Coding Assistant)**: Dùng để hỗ trợ thiết lập dự án Next.js 15 nhanh chóng, viết khung mã nguồn TypeScript sạch, tối ưu hóa các component CSS Tailwind và viết báo cáo này.
- **Google Gemini 2.5 Flash API**: Đóng vai trò là công cụ phân tích và xử lý logic nghiệp vụ chính (tổ chức asset).

### Prompt mẫu đã sử dụng ở Backend để hướng dẫn AI:
Chúng tôi sử dụng một System Instruction chi tiết để định hướng tư duy cho AI như sau:
```text
You are a Senior 3D Pipeline and Asset Management specialist.
Analyze the provided raw list of 3D assets, rooms, or items and organize them into logical categories.
Create a suitable URL-friendly camelCase or kebab-case slug for each asset.
Determine an appropriate project name based on the assets listed.
Provide constructive suggestions or improvements for naming consistency or catalog structure.

Language requirement:
- Detect the language of the input list.
- If the input is primarily in Vietnamese, write all generated textual values (such as category names, the project name, and the items in the improvements array) in Vietnamese.
- If the input is primarily in English, write all generated textual values in English.
- Always preserve the "originalName" of the assets exactly as they were written in the input, do not translate them.

You must return response in STRICT JSON format matching the schema. Do not output any markdown wrapper or explanation, output ONLY raw JSON.
```

### Cách kiểm tra lại output của AI để tránh lỗi (Halucination/Format):
- **Cấu hình `responseSchema` ở Backend**: Tận dụng tính năng định nghĩa schema chặt chẽ của Gemini API bằng cách truyền `responseSchema` (cấu trúc JSON định sẵn) qua thuộc tính `generationConfig`. Điều này đảm bảo AI luôn trả về định dạng JSON có cấu trúc chính xác (khớp 100% với Typescript interfaces).
- **Try-Catch & Validation**: Tại Route handler của backend, phản hồi từ AI được đưa vào khối `try-catch` để parse JSON. Đồng thời thực hiện kiểm tra thực tế (ví dụ: kiểm tra xem các mảng `categories` và `improvements` có tồn tại không). Nếu lỗi định dạng hoặc thiếu dữ liệu, backend lập tức trả về mã lỗi 500 kèm thông tin rõ ràng cho Client thay vì làm sập trang.

---

## 3. Khó khăn Gặp phải (Challenges)
- **Ràng buộc định dạng trả về từ LLM**: AI đôi khi chèn các khối đánh dấu markdown (ví dụ ` ```json ... ``` `) vào nội dung trả về, khiến trình phân tích cú pháp `JSON.parse` bị lỗi. Khó khăn này được khắc phục bằng cách thiết lập `responseMimeType: "application/json"` trong cấu hình gọi API và hướng dẫn cụ thể trong Prompt.
- **Ràng buộc tên của npm**: Tên thư mục gốc chứa các chữ cái viết hoa (`StarGlobal`), làm cho lệnh khởi tạo `create-next-app` trực tiếp tại thư mục này bị từ chối do quy định đặt tên gói của npm. Giải pháp là khởi tạo tạm trong một thư mục con viết thường, sau đó di chuyển toàn bộ source code lên thư mục gốc.

---

## 4. Báo cáo QA & Tư duy Sản phẩm (3 điểm chưa hợp lý & Cách cải thiện)

Dưới đây là 3 điểm chưa hợp lý về UI/UX và luồng thao tác được phát hiện trong quá trình thiết kế hệ thống hiện tại:

### Điểm 1: Chưa có tính năng Sao chép nhanh (Copy to Clipboard) cho Slugs
- **Mức độ ảnh hưởng**: **Trung bình (Medium)**.
- **Mô tả**: Sau khi AI phân tích và đưa ra danh sách các suggested slugs rất chuẩn chỉnh, người dùng (thiết kế 3D) muốn lấy các slugs này để đặt tên file vật lý. Tuy nhiên họ phải bôi đen thủ công từng dòng để sao chép. Nếu danh sách có hàng chục hoặc hàng trăm asset, thao tác này sẽ gây mất thời gian lớn.
- **Đề xuất cải thiện**: Thêm một nút "Copy toàn bộ Slugs dưới dạng JSON/CSV" ở thẻ Metadata, hoặc biểu tượng copy nhanh bên cạnh từng slug để sao chép chỉ với 1 click.

### Điểm 2: Thiếu tính năng "Thử lại nhanh" (Retry Button) khi gặp lỗi mạng/API
- **Mức độ ảnh hưởng**: **Thấp (Low)**.
- **Mô tả**: Khi cuộc gọi API thất bại (ví dụ: do rớt mạng cục bộ hoặc vượt quá Rate Limit của API Gemini), ứng dụng hiển thị thông báo lỗi màu đỏ. Người dùng phải bấm vào nút submit "Tổ chức Asset" một cách thủ công. Giao diện chưa có nút "Thử lại" chuyên dụng giúp tự động gửi lại request.
- **Đề xuất cải thiện**: Bổ sung nút "Thử lại" (Retry) trực tiếp trong banner thông báo lỗi để tăng tính tiện lợi cho trải nghiệm người dùng.

### Điểm 3: Khả năng xử lý khi lượng dữ liệu nhập vào quá lớn (Performance/Timeout)
- **Mức độ ảnh hưởng**: **Trung bình (Medium)**.
- **Mô tả**: Nếu người dùng dán một danh sách chứa hàng trăm hoặc hàng nghìn asset thô vào ô nhập liệu, cuộc gọi API đến Gemini sẽ mất rất nhiều thời gian xử lý và có nguy cơ cao bị lỗi Timeout từ server (đặc biệt là khi deploy lên các dịch vụ serverless như Vercel có giới hạn thời gian chạy 10-15 giây).
- **Đề xuất cải thiện**: Giới hạn số lượng ký tự/dòng tối đa mà người dùng được phép nhập ở Client-side (ví dụ: tối đa 100 dòng). Nếu cần xử lý nhiều hơn, nên chia nhỏ (batching) danh sách ở frontend và gửi thành nhiều yêu cầu tuần tự.

---

## 5. Hướng Cải thiện Nếu Có Thêm Thời gian
Nếu có thêm thời gian phát triển, dự án sẽ được mở rộng các tính năng hữu ích sau:
1. **Xuất tệp cấu hình (Export config)**: Hỗ trợ người dùng tải về file JSON hoặc CSV chứa danh sách phân loại và các slugs đã sinh ra để import trực tiếp vào các phần mềm 3D như Blender, Unity, Unreal Engine.
2. **Cho phép tùy chỉnh định dạng Slug**: Thêm phần lựa chọn cấu hình ở giao diện (ví dụ: cho phép người dùng tự chọn định dạng `kebab-case`, `snake_case`, hoặc `camelCase` tùy theo quy chuẩn đặt tên riêng của từng studio).
3. **Lưu lịch sử hoạt động (History Log)**: Sử dụng LocalStorage để lưu lại các dự án đã phân tích gần đây, giúp người dùng dễ dàng xem lại các đề xuất trước đó mà không cần gọi lại API AI nhiều lần gây tốn chi phí.
