# Hlime Project Rules

Phạm vi áp dụng: toàn bộ project Hlime.

## 1. Source of truth

- `docs/HLIME_WEBSITE_SPEC.md` là source of truth của project.
- Trước mỗi task lớn, phải đọc đúng các phần SPEC liên quan rồi mới lập kế hoạch hoặc thay đổi project.
- Khi yêu cầu và implementation hiện tại khác SPEC, ưu tiên SPEC trừ khi owner đưa ra quyết định mới rõ ràng.

## 2. Quy trình bắt buộc

Thực hiện theo đúng thứ tự:

`Context → Structure → Design → Prototype → Frontend → Database → Storage → Auth → Admin → Security → Test → Deploy`

- Không bỏ qua hoặc đảo thứ tự các giai đoạn khi chưa có chỉ đạo rõ ràng từ owner.
- Không làm Backend, Supabase hoặc Admin trước khi owner duyệt Prototype.

## 3. Tiết kiệm quota và giữ đúng phạm vi

- Chỉ đọc những file và phần tài liệu liên quan trực tiếp đến task.
- Không quét toàn bộ repository nếu không thực sự cần.
- Không refactor hoặc chỉnh sửa ngoài phạm vi yêu cầu.
- Chỉ chạy các kiểm tra cần thiết và tương xứng với rủi ro thay đổi.
- Dừng khi acceptance criteria của task đã đạt; không tiếp tục mở rộng công việc.

## 4. Agent Skills

- Chỉ dùng Agent Skills thật sự liên quan đến task hiện tại.
- Không gọi skill nặng, review toàn project hoặc tạo quy trình dư thừa cho thay đổi nhỏ.
- Nếu user chỉ định skill cụ thể, dùng skill đó trong đúng phạm vi task.

## 5. Scope và architecture

- Không tự thêm feature ngoài `docs/HLIME_WEBSITE_SPEC.md`.
- Nếu phát hiện cần thay đổi lớn về architecture, scope hoặc product flow, dừng triển khai và báo owner để xác nhận.
- Không biến giả định thành quyết định đã được duyệt.

## 6. UI và responsive

- Desktop và mobile đều là yêu cầu bắt buộc.
- UI phải tuân theo design system Hlime trong SPEC: thanh lịch, nhẹ nhàng, sạch sẽ, tinh tế và soft premium.
- Ảnh bánh là trọng tâm; bố cục phải dễ đọc, có khoảng thở và CTA rõ ràng.
- Tránh giao diện rập khuôn, trang trí dư thừa và “AI-template look”.

## 7. Ngôn ngữ VI/KO

- Tiếng Việt là ngôn ngữ mặc định.
- Tiếng Hàn là ngôn ngữ thứ hai.
- Nội dung động phải được thiết kế để hỗ trợ đồng thời bản VI và KO theo SPEC.
- Không xây giải pháp chỉ hoạt động cho một ngôn ngữ nếu nội dung thuộc phạm vi song ngữ.

## 8. Dữ liệu do Admin quản lý

- Nội dung kinh doanh thay đổi thường xuyên phải được thiết kế để Admin quản lý về sau, không hard-code cố định.
- Bao gồm tối thiểu: giá, sản phẩm, mô tả, ảnh, category, địa chỉ, số điện thoại, email, giờ mở cửa, social links, map link và nội dung homepage.
- Dữ liệu demo phải được đánh dấu rõ là demo, không phải production data.
- Có thể hard-code layout, component structure, route structure và các quy tắc hệ thống ít thay đổi.

## 9. Security

- Không đặt secret, credential hoặc Supabase `service_role` key trong frontend.
- Không commit credential hoặc file nhạy cảm.
- Database và Storage khi triển khai phải có RLS/policy phù hợp với quyền truy cập thực tế.
- Dữ liệu public và dữ liệu Admin phải được phân quyền rõ ràng trước khi production.

## 10. Git và release

- Kiểm tra diff trước khi commit.
- Xác nhận không có file nhạy cảm hoặc thay đổi ngoài scope trong diff.
- Chỉ commit, push hoặc deploy khi owner yêu cầu rõ ràng.
- Không tự tạo commit hoặc triển khai production như một bước mặc định.

## 11. Báo cáo khi kết thúc task

Báo cáo ngắn gọn:

- Files changed.
- Trạng thái kiểm tra: `PASS` hoặc `FAIL`.
- Vấn đề, giới hạn hoặc quyết định còn lại cần owner xử lý.
