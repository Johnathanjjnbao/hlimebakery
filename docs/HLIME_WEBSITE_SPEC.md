# Hlime Website Specification — V1

> **This document is the source of truth for Hlime V1.**  
> **Major implementation changes should be checked against this specification.**

| Thuộc tính | Giá trị |
|---|---|
| Thương hiệu | Hlime Bakery & Pâtisserie |
| Phiên bản tài liệu | 1.2 — Approved Owner Decisions Baseline |
| Owner Review | **APPROVED** |
| Trạng thái | Được duyệt làm baseline triển khai; các mục cố ý quyết định sau được liệt kê tại Section 15.3 |
| Đối tượng đọc | Owner, designer, người mới học Vibe Coding, frontend developer, admin developer, QA |
| Phạm vi | Lập kế hoạch sản phẩm, nội dung, thiết kế, kiến trúc và tiêu chí hoàn thành V1 |
| Ngoài phạm vi tài liệu | Code, cấu hình hạ tầng thực tế, dữ liệu production, hướng dẫn vận hành chi tiết |

---

## Cách sử dụng tài liệu này

Tài liệu này là căn cứ chung để thiết kế, xây dựng, kiểm thử và nghiệm thu website Hlime V1. Khi có đề xuất mới, hãy kiểm tra ba câu hỏi:

1. Đề xuất có phục vụ mục tiêu V1 không?
2. Đề xuất có làm thay đổi trải nghiệm, dữ liệu, bảo mật hoặc phạm vi đã thống nhất không?
3. Nếu là thay đổi lớn, owner đã duyệt và tài liệu này đã được cập nhật chưa?

Quy ước:

- **Bắt buộc**: điều kiện phải có để nghiệm thu V1.
- **Khuyến nghị**: hướng triển khai ưu tiên, có thể thay đổi nếu có lý do rõ ràng.
- **Future V2**: không đưa vào V1 trừ khi owner phê duyệt thay đổi phạm vi.
- **Owner**: người có quyền quyết định cuối cùng về thương hiệu, nội dung, sản phẩm và phạm vi kinh doanh.

---

## 1. Context và mục tiêu sản phẩm

### 1.1 Thương hiệu

**Hlime Bakery & Pâtisserie** là tiệm bánh thuộc phân khúc trung cấp, dễ tiếp cận. Hlime phục vụ cả nhu cầu mua bánh thường ngày và nhu cầu tìm một sản phẩm chỉn chu hơn cho dịp đặc biệt.

Danh mục kinh doanh định hướng gồm:

- Bánh ăn hằng ngày.
- Bánh mì và bánh ngọt đơn giản.
- Viennoiserie.
- Bánh Pháp.
- Pâtisserie.
- Bánh sinh nhật và bánh Celebration.
- Gift Box.

### 1.2 Định vị

Hlime đứng giữa hai thái cực:

- Không rẻ đến mức làm giảm cảm nhận về chất lượng và độ chỉn chu.
- Không xa xỉ đến mức khách hàng bình thường cảm thấy khó tiếp cận.

Website phải truyền tải được thông điệp: bánh đẹp, ngon, làm cẩn thận, giá hợp lý và có thể mua cho cả ngày thường lẫn dịp đặc biệt.

### 1.3 Tagline định hướng

> **Everyday sweetness, beautifully made.**

Tagline này thể hiện hai lớp giá trị:

- **Everyday sweetness**: gần gũi, có thể thưởng thức thường xuyên.
- **Beautifully made**: được làm chỉn chu, có thẩm mỹ và mang cảm giác premium vừa đủ.

### 1.4 Mục tiêu của website V1

Website V1 phải giúp khách hàng:

1. Hiểu Hlime bán gì và thuộc phân khúc nào trong vài giây đầu.
2. Dễ tìm sản phẩm theo nhu cầu hoặc category.
3. Xem được ảnh, tên, giá và thông tin chính của sản phẩm.
4. Chuyển đổi giữa tiếng Việt và tiếng Hàn để đọc nội dung bằng ngôn ngữ phù hợp.
5. Thêm sản phẩm vào giỏ, kiểm tra đơn và gửi xác nhận/chốt đơn mà không phải đoán bước tiếp theo.
6. Tìm được thông tin của chi nhánh duy nhất trong V1, giờ mở cửa và kênh liên hệ.
7. Tin tưởng thương hiệu nhờ hình ảnh, nội dung và trải nghiệm nhất quán.

Website V1 phải giúp đội ngũ Hlime:

1. Quản lý sản phẩm và ảnh qua Admin.
2. Quản lý nội dung tiếng Việt và tiếng Hàn song song.
3. Dùng hỗ trợ dịch tự động VI → KO nhưng vẫn kiểm soát được bản dịch tiếng Hàn.
4. Cập nhật nội dung thường dùng mà không cần sửa code hoặc redeploy.
5. Ẩn, hiện và đánh dấu tình trạng sản phẩm nhanh chóng.
6. Duy trì một hệ thống đơn giản, an toàn và dễ mở rộng sang V2.

### 1.5 Chỉ số thành công định hướng

V1 chưa cần hệ thống phân tích phức tạp. Khi có công cụ đo lường, nên theo dõi tối thiểu:

- Lượt nhấn **Xem menu**.
- Lượt mở trang chi tiết sản phẩm.
- Lượt thêm sản phẩm vào Shopping Cart.
- Tỷ lệ đi từ Shopping Cart đến gửi xác nhận/chốt đơn thành công.
- Lượt xem trang Celebration.
- Tỷ lệ người dùng mobile hoàn thành luồng từ xem sản phẩm đến xác nhận đơn.

Không đặt mục tiêu doanh thu cụ thể trong tài liệu này vì chưa có dữ liệu nền.

---

## 2. Brand và Design System

### 2.1 Tính cách thương hiệu

Hlime cần tạo cảm giác:

- Thanh lịch.
- Nhẹ nhàng.
- Sạch sẽ.
- Tinh tế.
- Soft premium — cao cấp vừa đủ, không phô trương.
- Gần gũi với khách hàng thường ngày.

Hlime không nên tạo cảm giác:

- Quá cute hoặc trẻ con.
- Quá xa xỉ, lạnh lùng hoặc khó tiếp cận.
- Rườm rà, nhiều hiệu ứng hoặc giống một mẫu website AI đại trà.

### 2.2 Bảng màu

| Token định hướng | Mã màu | Vai trò ưu tiên |
|---|---:|---|
| Primary Rose Pink | `#D98C9F` | CTA chính, điểm nhấn thương hiệu, trạng thái được chọn |
| Soft Pink | `#F4DCE3` | Nền phụ, vùng nhấn nhẹ, tag hoặc badge |
| Cream | `#FFF9F5` | Nền chính ấm, tạo cảm giác mềm và gần gũi |
| White | `#FFFFFF` | Card, vùng nội dung cần độ sạch và tương phản |
| Chocolate Brown | `#4A2F2A` | Chữ chính, heading, yếu tố cần độ chắc chắn |
| Muted Burgundy | `#8A4657` | Accent đậm, trạng thái hover, chi tiết premium |

Nguyên tắc sử dụng:

- Dùng Cream hoặc White làm nền chủ đạo để ảnh bánh nổi bật.
- Chocolate Brown là màu chữ chính ưu tiên hơn màu đen tuyệt đối.
- Rose Pink dùng có kiểm soát, ưu tiên cho hành động và điểm nhấn.
- Muted Burgundy tạo chiều sâu nhưng không phủ diện tích quá lớn.
- Bảo đảm độ tương phản chữ và nền đạt yêu cầu accessibility; không dùng màu nhạt cho đoạn chữ dài nếu khó đọc.
- Tránh gradient không có mục đích. Nếu cần dùng, gradient phải rất nhẹ và không cạnh tranh với ảnh sản phẩm.

### 2.3 Typography

| Nhóm | Lựa chọn ưu tiên | Lựa chọn thay thế | Mục đích |
|---|---|---|---|
| Heading | Fraunces | Lora | Tạo nét pâtisserie thanh lịch và có cá tính |
| Body/UI | Inter | DM Sans | Dễ đọc trên desktop và mobile |

Quy tắc:

- Chỉ chọn một font heading và một font body cho V1.
- Heading có phân cấp rõ ràng; không dùng quá nhiều kích thước gần giống nhau.
- Body text phải đủ lớn và có line-height thoáng để đọc tốt trên mobile.
- Nút, nhãn và giá sản phẩm phải rõ ràng, không dùng kiểu chữ trang trí.
- Giới hạn số độ đậm để giao diện nhất quán và tải nhanh.

### 2.4 Hình ảnh

Ảnh bánh là trọng tâm thị giác của website.

Yêu cầu:

- Ánh sáng, màu sắc và hậu kỳ nhất quán.
- Bánh phải là chủ thể rõ ràng; phông nền không gây nhiễu.
- Có tỷ lệ ảnh thống nhất cho product card để tránh layout nhảy hoặc lệch.
- Trang chi tiết có ảnh đủ lớn để nhìn rõ kết cấu và hoàn thiện sản phẩm.
- Không kéo giãn, crop mất chủ thể hoặc dùng ảnh mờ.
- Có ảnh dự phòng khi sản phẩm chưa có ảnh chính thức.
- Ảnh phải được tối ưu dung lượng và có mô tả thay thế phù hợp.

### 2.5 Thành phần giao diện

**Card sản phẩm**

- Ảnh là phần nổi bật nhất.
- Hiển thị tên, category hoặc badge cần thiết, giá và trạng thái.
- Card sạch, bo góc vừa phải, shadow nhẹ.
- Toàn bộ card hoặc vùng hành động chính phải dễ nhấn trên mobile.

**Button/CTA**

- Có phân cấp Primary và Secondary rõ ràng.
- Nội dung dùng động từ cụ thể: **Xem menu**, **Xem chi tiết**, **Thêm vào giỏ hàng**, **Xem giỏ hàng**, **Xác nhận đơn**, **Liên hệ tư vấn**.
- Trạng thái hover, focus, pressed và disabled phải nhìn thấy được.

**Navigation**

- Ngắn gọn, dễ hiểu và nhất quán giữa các trang.
- Mobile navigation phải dễ mở, dễ đóng và không che mất hành động quan trọng.

**Form**

- Nhãn trường luôn rõ ràng.
- Thông báo lỗi đặt gần trường liên quan và giải thích cách sửa.
- Không yêu cầu thông tin không cần thiết cho bước liên hệ.

### 2.6 Khoảng cách, bo góc và chiều sâu

- Dùng một hệ spacing nhất quán thay vì đặt khoảng cách tùy ý ở từng section.
- Ưu tiên nhiều khoảng thở giữa các khối nội dung.
- Bo góc ở mức vừa phải; không biến toàn bộ giao diện thành các “viên thuốc”.
- Shadow nhẹ, dùng để phân lớp chứ không trang trí.
- Mỗi section cần có nhịp điệu rõ ràng giữa tiêu đề, mô tả, nội dung và CTA.

### 2.7 Animation và tương tác

- Animation phải tinh tế, nhanh và có mục đích phản hồi thao tác.
- Ưu tiên chuyển trạng thái nhẹ cho card, button, menu và nội dung xuất hiện.
- Không dùng hiệu ứng liên tục làm người dùng mất tập trung khỏi sản phẩm.
- Tôn trọng tùy chọn giảm chuyển động của thiết bị.
- Giao diện vẫn phải sử dụng được nếu animation không chạy.

### 2.8 Nguyên tắc tránh “AI template look”

- Không lạm dụng gradient, glow, glassmorphism hoặc các khối bo tròn giống nhau.
- Không dùng câu marketing chung chung không có thông tin thật.
- Không đặt quá nhiều badge, icon hoặc số liệu không có căn cứ.
- Bố cục phải xuất phát từ ảnh bánh và hành trình mua hàng của Hlime.
- Dùng khoảng trắng, tỷ lệ ảnh, typography và nội dung thật để tạo chất lượng thay vì thêm trang trí.
- Mọi section phải có vai trò rõ ràng; section không phục vụ mục tiêu người dùng thì nên bỏ.

---

## 3. Product Structure

### 3.1 Category V1

| Category | Mục đích | Ví dụ nhu cầu khách hàng |
|---|---|---|
| Everyday Bakery | Nhóm bánh dễ mua và phù hợp dùng thường xuyên. Đây là cửa vào gần gũi nhất của thương hiệu. | Ăn sáng, ăn nhẹ, mua mang về hằng ngày |
| Viennoiserie | Nhóm bánh dùng kỹ thuật bột cán lớp hoặc giàu bơ, giúp thể hiện tay nghề nhưng vẫn quen thuộc. | Croissant, pain au chocolat, bữa sáng chỉn chu |
| French Pâtisserie | Nhóm bánh Pháp tinh tế hơn, nhấn vào kết cấu, hương vị và trình bày. | Thưởng thức cuối tuần, quà nhỏ, trải nghiệm premium |
| Cakes | Nhóm bánh cake phổ thông hoặc bánh nguyên chiếc không nhất thiết gắn với một sự kiện. | Dùng tại nhà, chia sẻ, mang đến buổi gặp mặt |
| Celebration Cakes | Nhóm bánh dành cho sinh nhật và các dịp kỷ niệm, cần thông tin đặt trước rõ ràng. | Sinh nhật, anniversary, sự kiện nhỏ |
| Gift Box | Bộ quà đóng gói chỉn chu, giúp khách chọn quà nhanh theo dịp. | Tặng người thân, đối tác, dịp lễ |

Tên category phải có bản tiếng Việt và tiếng Hàn. Hệ thống dùng một định danh ổn định, không phụ thuộc ngôn ngữ, để đổi nội dung hiển thị mà không làm hỏng filter hoặc liên kết.

### 3.2 Product fields V1

| Field | Ý nghĩa | Quy tắc V1 |
|---|---|---|
| `id` | Định danh duy nhất của sản phẩm | Hệ thống tự quản lý; không tái sử dụng cho sản phẩm khác |
| `name_vi` | Tên sản phẩm tiếng Việt | Bắt buộc; ngắn gọn, dễ nhận biết |
| `name_ko` | Tên sản phẩm tiếng Hàn | Bắt buộc trước khi public bản KO; có thể được tạo từ auto-translate rồi sửa tay |
| `category` | Category của sản phẩm | Bắt buộc; thuộc một trong các category đang hoạt động |
| `short_description_vi` | Mô tả ngắn tiếng Việt | Ngắn, tập trung vào hương vị/đặc điểm chính |
| `short_description_ko` | Mô tả ngắn tiếng Hàn | Truyền đạt cùng ý với VI, được phép biên tập tự nhiên cho người đọc KO |
| `description_vi` | Mô tả đầy đủ tiếng Việt | Dễ đọc, hữu ích cho quyết định mua; không cần nội dung dài |
| `description_ko` | Mô tả đầy đủ tiếng Hàn | Có thể auto-translate từ VI rồi sửa tay; không được tự ghi đè bản đã chỉnh thủ công |
| `price` | Giá bán hiển thị | Bắt buộc nếu sản phẩm có giá cố định; hiển thị nhất quán theo VND |
| `image` | Ảnh đại diện chính | Bắt buộc trước khi public; lưu bằng đường dẫn từ Storage |
| `active` | Sản phẩm có được xuất hiện công khai hay không | `false` nghĩa là ẩn khỏi website public |
| `available` | Sản phẩm hiện có thể đặt/mua hay không | `false` vẫn có thể hiển thị nhưng phải ghi rõ tạm hết hoặc chưa nhận đặt |
| `featured` | Sản phẩm có được ưu tiên ở khu vực nổi bật hay không | Dùng có giới hạn; không phải mọi sản phẩm đều featured |
| `best_seller` | Đánh dấu sản phẩm bán chạy | Dùng cho section Best Sellers và badge nếu cần |
| `display_order` | Thứ tự ưu tiên hiển thị | Số nhỏ hơn được ưu tiên trước; cần quy ước nhất quán |

Đối với **Celebration Cakes**, V1 bổ sung các dữ liệu cần thiết sau:

| Field logic | Ý nghĩa | Quy tắc V1 |
|---|---|---|
| `size_options` | Các size khách có thể chọn | Admin quản lý theo từng sản phẩm Celebration; hiển thị bằng VI/KO khi có nhãn chữ |
| `flavor_options` | Các flavor khách có thể chọn | Admin quản lý theo từng sản phẩm Celebration; hiển thị bằng VI/KO |
| `required_date` | Ngày khách cần bánh | Khách chọn khi đặt; phải được validate theo quy tắc vận hành được cấu hình |
| `message_note` | Lời nhắn hoặc ghi chú cho bánh/đơn | Khách nhập tùy chọn; giới hạn độ dài hợp lý và hiển thị cho Admin khi xử lý order |

### 3.3 Quy tắc hiển thị sản phẩm

- Chỉ sản phẩm có `active = true` mới xuất hiện trên website public.
- Sản phẩm có `active = true` và `available = false` vẫn có thể xuất hiện để khách biết danh mục, nhưng phải có trạng thái rõ ràng và CTA phù hợp.
- Sản phẩm `featured = true` có thể xuất hiện tại các vùng nổi bật trên Home.
- Sản phẩm `best_seller = true` có thể xuất hiện trong Best Sellers.
- `display_order` quyết định thứ tự trước; khi bằng nhau, hệ thống dùng một quy tắc phụ nhất quán như tên hoặc thời điểm tạo.
- Nếu sản phẩm thiếu ảnh, dữ liệu lỗi hoặc không tồn tại, giao diện phải dùng trạng thái dự phòng thay vì vỡ layout.
- Nút **Thêm vào giỏ hàng** chỉ khả dụng khi sản phẩm vừa `active = true` vừa `available = true`.

### 3.4 Những field chưa đưa vào V1

Các field sau chỉ thêm khi có nhu cầu vận hành thực tế, không thêm “để dành”:

- Weight.
- Allergen.
- Stock chi tiết.
- SKU.
- Nutrition information.
- Lead time theo từng sản phẩm.
- Gallery nhiều ảnh.

Size và flavor của Celebration Cakes đã thuộc V1; không áp dụng bắt buộc cho mọi category. Lead time chỉ thêm thành field riêng nếu quy trình thực tế cần ngoài `required_date`. Ưu tiên giải pháp tối thiểu đủ dùng, tránh biến V1 thành hệ thống cấu hình sản phẩm phức tạp.

### 3.5 Nguyên tắc dữ liệu

- Dữ liệu hiển thị cho khách phải đến từ Supabase, không hard-code lặp lại trong nhiều trang.
- Category nên có định danh ổn định để đổi tên hiển thị mà không làm hỏng liên kết.
- Giá phải được lưu theo kiểu dữ liệu số phù hợp, không lưu như câu chữ đã định dạng.
- Ảnh được lưu trong Storage; database chỉ giữ đường dẫn và thông tin liên quan.
- Không xóa vĩnh viễn sản phẩm chỉ vì tạm ngừng bán; ưu tiên ẩn bằng `active`.
- Size/flavor option của Celebration phải đến từ Supabase để Admin có thể cập nhật mà không redeploy.

### 3.6 Nội dung song ngữ VI/KO

- Website public phải hỗ trợ **Vietnamese (VI)** và **Korean (KO)**.
- **VI là ngôn ngữ mặc định** trên route mặc định.
- **KO dùng route riêng** trong namespace locale, định hướng `/ko/...`.
- Nếu nội dung KO bị thiếu, website phải fallback sang VI thay vì hiển thị trống hoặc làm vỡ trang.
- Mọi nội dung do Admin quản lý và hiển thị cho khách phải có field VI và KO song song. Điều này áp dụng cho products, categories, Homepage content và các Site Settings có nội dung ngôn ngữ tự nhiên.
- Dữ liệu không cần dịch như giá, email, phone, URL, cờ trạng thái và thứ tự hiển thị chỉ lưu một lần.
- Admin phải hỗ trợ auto-translate theo một chiều **VI → KO**.
- Nội dung KO do máy dịch tạo ra phải có thể xem lại và sửa thủ công trước hoặc sau khi lưu.
- Khi VI thay đổi, hệ thống phải nhận biết KO có thể đã cũ và cho phép cập nhật bản dịch.
- Nếu KO đã được chỉnh thủ công, hệ thống không được tự ghi đè. Admin phải nhận cảnh báo và chủ động chọn giữ bản KO hiện tại, xem bản dịch mới hoặc thay thế.
- Cách lưu metadata về nguồn bản dịch, trạng thái review và phiên bản VI liên quan được chốt trong data design; không được bỏ yêu cầu bảo vệ bản dịch thủ công.
- Nội dung bắt buộc chưa có KO phải được hiển thị rõ trong Admin. Public route KO dùng fallback VI có kiểm soát; fallback không thay thế trách nhiệm hoàn thiện bản dịch KO.

---

## 4. Website Structure

### 4.1 Sơ đồ website

```text
Home
├── Menu / Products
│   ├── Category / Filtered view
│   └── Product Detail
├── Celebration
│   └── Product Detail
├── Shopping Cart
│   ├── Customer / Order Information
│   ├── Pickup / Delivery
│   └── Submit Order / Order Status
├── About
└── Contact / Order Support
```

### 4.2 Vai trò từng trang

| Trang | Vai trò | Kết quả mong muốn |
|---|---|---|
| Home | Giới thiệu nhanh thương hiệu, sản phẩm nổi bật và các lối đi chính. | Khách chọn xem menu, khám phá category hoặc bắt đầu đặt bánh. |
| Menu / Products | Là catalogue trung tâm để duyệt và lọc sản phẩm. | Khách tìm được sản phẩm phù hợp với ít thao tác. |
| Product Detail | Cung cấp đủ thông tin và hình ảnh để khách ra quyết định. | Khách thêm sản phẩm available vào Shopping Cart hoặc tiếp tục khám phá. |
| Celebration | Giải thích lựa chọn bánh cho dịp đặc biệt và quy trình đặt trước. | Khách tìm mẫu phù hợp, thêm vào Cart khi sản phẩm hỗ trợ hoặc liên hệ khi cần tư vấn riêng. |
| Shopping Cart | Cho khách xem sản phẩm đã chọn, thay đổi số lượng, xóa món và kiểm tra subtotal/cart summary. | Khách xác nhận lựa chọn rồi chuyển sang nhập thông tin đơn. |
| Customer / Order Information | Thu thập đúng những thông tin cần thiết để Hlime tiếp nhận yêu cầu đặt bánh. | Khách cung cấp thông tin hợp lệ mà không cần tạo tài khoản. |
| Pickup / Delivery | Cho khách chọn nhận tại cửa hàng hoặc giao hàng và nhập thông tin liên quan. | Order request có đủ dữ liệu fulfillment để Hlime xử lý. |
| Submit Order / Order Status | Cho khách xem summary, gửi order và nhận trạng thái ban đầu `PENDING`. | Hlime xem order trong Admin, xác nhận và chuyển trạng thái thành `CONFIRMED`; không có payment online. |
| About | Xây dựng niềm tin bằng câu chuyện, cách làm và định vị của Hlime. | Khách hiểu vì sao Hlime đáng tin và phù hợp với họ. |
| Contact / Order Support | Gom thông tin của một chi nhánh, bản đồ, giờ mở cửa và kênh hỗ trợ. | Khách liên hệ khi cần tư vấn hoặc hỗ trợ đơn; đây không thay thế Cart đối với sản phẩm đặt trực tiếp được. |

### 4.3 Navigation chính

Navigation desktop và mobile nên dùng cùng hệ thống nhãn:

- Home.
- Menu.
- Celebration.
- About.
- Contact / Order Support.

Header phải có language switcher VI/KO và lối vào Shopping Cart với số lượng item dễ nhận biết. CTA **Đặt bánh** nên luôn dễ tìm, ưu tiên dẫn khách đến Menu để chọn sản phẩm; khi đã có sản phẩm trong Cart, lối vào Cart phải nổi bật. Logo đưa người dùng về Home.

### 4.4 Nguyên tắc URL và điều hướng

- URL dễ đọc, ổn định và phản ánh đúng nội dung trang.
- VI dùng route mặc định; KO dùng route riêng trong namespace `/ko/...`.
- Khi mở route KO nhưng field KO tương ứng còn thiếu, giao diện fallback sang VI và không được hiển thị nội dung trống.
- Mỗi sản phẩm có URL riêng để có thể chia sẻ.
- Chuyển VI ↔ KO phải điều hướng đến route tương ứng của cùng nội dung và không làm mất Cart/state trong flow.
- Filter có thể phản ánh trên URL nếu không làm tăng độ phức tạp quá mức; tối thiểu phải giữ trải nghiệm rõ ràng khi refresh hoặc quay lại.
- Shopping Cart phải giữ được lựa chọn khi khách điều hướng giữa các trang trong cùng phiên; chiến lược lưu lâu hơn được chốt trong frontend design.
- Trang không tồn tại cần có hướng quay về Menu hoặc Home.
- Không tạo trang riêng nếu nội dung quá ít và có thể giải quyết tốt trong một section.

---

## 5. Homepage Storyboard

### 5.1 Luồng tổng thể

```text
Header
  ↓
Hero
  ↓
Shop by Category
  ↓
Best Sellers
  ↓
French Signature
  ↓
Everyday Favorites
  ↓
Celebration
  ↓
Why Hlime
  ↓
About Preview
  ↓
Contact / Map / Opening Hours
  ↓
Footer
```

Trình tự này đi từ nhận diện thương hiệu đến khám phá sản phẩm, sau đó xây dựng niềm tin và kết thúc bằng hành động thực tế.

### 5.2 Chi tiết từng section

| Section | Nội dung cốt lõi | Mục đích UX | CTA chính |
|---|---|---|---|
| Header | Logo, navigation, language switcher VI/KO, Cart và CTA đặt bánh | Giúp khách định hướng, đổi ngôn ngữ và luôn có đường đến hành động chính | Đặt bánh; Xem giỏ hàng |
| Hero | Ảnh bánh nổi bật, tên Hlime Bakery & Pâtisserie, tagline, hai CTA | Truyền tải định vị trong vài giây và cho khách hai lối đi rõ ràng | Xem menu; Đặt bánh |
| Shop by Category | 6 category với ảnh hoặc visual đại diện | Phục vụ khách chưa biết tên món nhưng biết loại bánh hoặc nhu cầu | Xem category |
| Best Sellers | Một nhóm nhỏ sản phẩm có `best_seller = true` | Giảm khó khăn lựa chọn và tạo điểm bắt đầu an toàn cho khách mới | Xem chi tiết; Xem tất cả |
| French Signature | Sản phẩm Pháp/Pâtisserie đại diện năng lực và nét riêng của Hlime | Tăng cảm nhận tinh tế, tạo lý do chọn Hlime thay vì tiệm bánh phổ thông | Khám phá French Pâtisserie |
| Everyday Favorites | Các món dễ mua và phù hợp hằng ngày | Cân bằng hình ảnh premium bằng tính gần gũi và khả năng mua thường xuyên | Xem Everyday Bakery |
| Celebration | Ảnh bánh sự kiện, thông điệp đặt trước và hỗ trợ tư vấn | Thu hút nhu cầu có giá trị cao hơn; dẫn đến sản phẩm có thể thêm vào Cart hoặc kênh tư vấn khi cần tùy chỉnh | Xem bánh Celebration; Liên hệ tư vấn |
| Why Hlime | 3–4 lý do ngắn, có căn cứ về sản phẩm hoặc trải nghiệm | Trả lời câu hỏi “Vì sao nên chọn Hlime?” mà không dùng quảng cáo chung chung | Có thể không cần CTA |
| About Preview | Câu chuyện ngắn và ảnh con người/quy trình nếu có | Tạo kết nối cảm xúc và tăng độ tin cậy | Về Hlime |
| Contact / Map / Opening Hours | Địa chỉ, bản đồ, số điện thoại, giờ mở cửa và kênh hỗ trợ | Giúp khách chuyển từ xem online sang ghé cửa hàng hoặc nhận hỗ trợ | Chỉ đường; Liên hệ; Xem menu |
| Footer | Navigation phụ, thông tin liên hệ, social links, thông tin pháp lý cơ bản | Hoàn thiện điều hướng và cho phép tìm lại thông tin quan trọng | Theo dõi; Liên hệ |

### 5.3 Yêu cầu Hero

Hero bắt buộc có:

- Một ảnh bánh chất lượng cao, thể hiện đúng phong cách Hlime.
- Tên **Hlime Bakery & Pâtisserie**.
- Tagline **Everyday sweetness, beautifully made.**
- CTA chính **Xem menu**.
- CTA phụ **Đặt bánh**.

CTA **Đặt bánh** ở Hero dẫn đến Menu hoặc nhóm sản phẩm phù hợp để khách chọn món, sau đó dùng **Thêm vào giỏ hàng** tại Product Detail. CTA này không bỏ qua Shopping Cart.

Hero không nên:

- Chứa quá nhiều chữ.
- Dùng carousel tự chạy.
- Đặt chữ lên vùng ảnh làm giảm độ đọc.
- Dùng nhiều CTA cạnh tranh nhau.

### 5.4 Quy tắc nội dung Home

- Mỗi section chỉ truyền đạt một ý chính.
- Số sản phẩm trên Home được giới hạn để tránh biến Home thành toàn bộ catalogue.
- Nội dung thật và ảnh thật được ưu tiên hơn câu marketing dài.
- Thứ tự section có thể tinh chỉnh sau prototype test, nhưng mọi thay đổi lớn phải giữ nguyên mục tiêu của flow.
- Các section sản phẩm phải lấy dữ liệu từ Supabase để Admin có thể cập nhật mà không redeploy.
- Nội dung chữ trên Home phải có đủ bản VI và KO; đổi ngôn ngữ không được làm mất vị trí điều hướng hoặc Cart.

---

## 6. Other Page Storyboards

### 6.1 Menu / Products

**Mục tiêu:** giúp khách duyệt toàn bộ sản phẩm, chuyển category và tìm món phù hợp nhanh chóng.

**Storyboard:**

```text
Header
→ Page title + mô tả ngắn
→ Category filter
→ Product grid
→ Loading / Empty / Error state khi cần
→ Contact prompt ngắn
→ Footer
```

**User flow:**

1. Khách vào Menu.
2. Xem tất cả hoặc chọn một category.
3. Quan sát ảnh, tên, giá và trạng thái trên product card.
4. Mở Product Detail.
5. Thêm sản phẩm vào Cart từ Product Detail hoặc quay lại danh sách.

**CTA chính:** **Xem chi tiết**.  
**CTA hỗ trợ:** **Xem giỏ hàng** khi Cart đã có sản phẩm hoặc **Liên hệ** khi khách cần tư vấn.

**Yêu cầu UX:**

- Filter phải dễ nhận biết, thao tác tốt bằng ngón tay và có trạng thái đang chọn.
- Trên mobile, không để filter chiếm phần lớn màn hình.
- Sản phẩm unavailable phải được ghi rõ trước khi khách mở chi tiết nếu có thể.
- Empty state phải giải thích rằng category chưa có sản phẩm và gợi ý xem category khác.
- Không bắt buộc search trong V1; chỉ thêm nếu số lượng sản phẩm thực tế khiến filter category không đủ.

### 6.2 Product Detail

**Mục tiêu:** cung cấp đủ thông tin để khách tự tin chọn sản phẩm và thêm sản phẩm vào Shopping Cart.

**Storyboard:**

```text
Breadcrumb hoặc đường quay lại
→ Ảnh sản phẩm
→ Tên + category + giá + trạng thái
→ Mô tả ngắn và mô tả đầy đủ
→ Quantity selector tối thiểu nếu được đặt tại trang chi tiết
→ CTA Thêm vào giỏ hàng
→ Thông tin đặt trước nếu có
→ Sản phẩm liên quan
→ Footer
```

**User flow:**

1. Khách mở sản phẩm từ Home, Menu hoặc Celebration.
2. Xem ảnh, giá, mô tả và tình trạng có thể đặt.
3. Chọn số lượng phù hợp hoặc giữ số lượng mặc định là 1.
4. Nhấn CTA **Thêm vào giỏ hàng**.
5. Nhận phản hồi rõ rằng sản phẩm đã được thêm.
6. Chọn **Tiếp tục mua** hoặc **Xem giỏ hàng** để đi đến bước chốt đơn.

**CTA chính:** **Thêm vào giỏ hàng**.  
**CTA hỗ trợ:** **Xem giỏ hàng** hoặc **Xem sản phẩm khác**.

**Yêu cầu UX:**

- CTA, quantity và giá phải dễ thấy mà không cần tìm kiếm.
- Nếu `available = false`, vô hiệu hóa **Thêm vào giỏ hàng**, hiển thị trạng thái phù hợp và cho phép liên hệ hỏi thêm.
- Thêm vào Cart không được tạo order hoặc hiển thị như đã chốt đơn.
- Khi đổi VI/KO, lựa chọn sản phẩm và quantity trong Cart phải được giữ nguyên.
- Không hiển thị thông tin như allergen, size hoặc weight nếu dữ liệu chưa được quản lý đáng tin cậy.
- Nếu sản phẩm không tồn tại hoặc đã bị ẩn, hiển thị trạng thái rõ ràng và dẫn về Menu.

### 6.3 Celebration

**Mục tiêu:** phục vụ khách mua bánh cho sinh nhật hoặc dịp đặc biệt, nơi nhu cầu thường cần tư vấn và đặt trước.

**Storyboard:**

```text
Hero Celebration
→ Các dịp phù hợp
→ Celebration Cakes nổi bật
→ Cách đặt bánh ngắn gọn
→ Thông tin cần chuẩn bị khi liên hệ
→ FAQ ngắn nếu có dữ liệu thật
→ CTA liên hệ/đặt bánh
→ Footer
```

**User flow:**

1. Khách vào từ Home hoặc navigation.
2. Xem phong cách bánh và các lựa chọn đang hoạt động.
3. Mở sản phẩm cụ thể hoặc đọc cách đặt.
4. Chọn **size**, **flavor**, **ngày cần bánh** và nhập **lời nhắn/ghi chú** nếu cần.
5. Thêm vào Shopping Cart và đi qua flow Customer Info → Pickup/Delivery → Submit Order.
6. Nếu bánh cần tùy chỉnh ngoài bốn field V1, liên hệ Hlime để được tư vấn.

**CTA chính:** **Xem mẫu Celebration** và **Thêm vào giỏ hàng** tại sản phẩm có thể đặt trực tiếp.  
**CTA hỗ trợ:** **Liên hệ tư vấn** cho yêu cầu tùy chỉnh.

Size, flavor, ngày cần bánh và lời nhắn/ghi chú là dữ liệu bắt buộc phải được hỗ trợ trong Celebration V1. Đây vẫn là configurator tối thiểu, không phải hệ thống báo giá hoặc tùy biến bánh phức tạp.

### 6.4 About

**Mục tiêu:** kể câu chuyện thương hiệu vừa đủ để tạo tin tưởng, không biến thành bài giới thiệu dài.

**Storyboard:**

```text
Brand statement
→ Câu chuyện Hlime
→ Triết lý “Everyday + Beautifully Made”
→ Cách Hlime tiếp cận sản phẩm/chất lượng
→ Ảnh thương hiệu hoặc quy trình
→ CTA khám phá Menu
→ Footer
```

**User flow:**

1. Khách muốn biết thêm về thương hiệu.
2. Hiểu định vị, giá trị và cách làm của Hlime.
3. Chuyển sang xem sản phẩm hoặc liên hệ.

**CTA chính:** **Khám phá menu**.  
**CTA hỗ trợ:** **Liên hệ Hlime**.

Mọi tuyên bố về nguyên liệu, quy trình hoặc cam kết chất lượng phải đúng với thực tế và được owner xác nhận.

### 6.5 Contact / Order Support

**Mục tiêu:** giúp khách liên hệ Hlime, tìm chi nhánh duy nhất hoặc nhận hỗ trợ trước/sau khi gửi yêu cầu đặt bánh.

**Storyboard:**

```text
Tiêu đề + hướng dẫn ngắn
→ Kênh liên hệ/hỗ trợ ưu tiên
→ Phone / Email / Social
→ Address + Map
→ Opening Hours
→ Ghi chú về thời gian phản hồi hoặc đặt trước nếu có
→ Form liên hệ tối giản nếu được xác nhận
→ Footer
```

**User flow:**

1. Khách chọn kênh liên hệ phù hợp.
2. Xem giờ mở cửa và thông tin cửa hàng nếu muốn ghé trực tiếp.
3. Gửi câu hỏi, nhu cầu tùy chỉnh hoặc yêu cầu hỗ trợ liên quan đến đơn.
4. Nếu muốn đặt sản phẩm tiêu chuẩn, quay lại Menu/Product → Shopping Cart → xác nhận đơn.

**CTA chính:** kênh liên hệ được owner chọn làm ưu tiên.  
**CTA hỗ trợ:** **Chỉ đường**, **Xem menu** hoặc các kênh liên hệ khác.

Form liên hệ không bắt buộc trong V1. Nếu có form, phải xác định nơi nhận dữ liệu, chống spam, xử lý lỗi và thông báo thành công rõ ràng trước khi triển khai.

### 6.6 Shopping Cart, Submit Order và Order Status

**Mục tiêu:** cho phép khách gom sản phẩm, kiểm tra chi phí, cung cấp thông tin cần thiết và gửi xác nhận/chốt đơn mà không cần thanh toán online hoặc tạo customer account.

**Storyboard:**

```text
Shopping Cart
→ Danh sách sản phẩm + quantity + subtotal
→ Cart summary
→ Customer / Order Information
→ Pickup hoặc Delivery
→ Review summary + Submit Order
→ PENDING
→ Hlime xác nhận
→ CONFIRMED
```

**Chức năng tối thiểu:**

- Thêm và xóa sản phẩm.
- Tăng/giảm hoặc nhập quantity hợp lệ.
- Tính subtotal từng dòng và tổng tạm tính của Cart.
- Hiển thị cart summary rõ ràng.
- Thu thập đúng customer/order information cần cho vận hành.
- Cho khách chọn **nhận tại cửa hàng (Pickup)** hoặc **giao hàng (Delivery)**.
- Thu thập thông tin fulfillment tương ứng; Delivery phải có thông tin giao hàng cần thiết, Pickup phải hiển thị thông tin của chi nhánh duy nhất.
- Cho khách review summary trước khi submit.
- Order mới submit thành công phải có trạng thái `PENDING`.
- Hlime xác nhận order trong Admin để chuyển trạng thái sang `CONFIRMED`.
- Không có bước thanh toán online trong V1.

**User flow:**

1. Khách mở Shopping Cart sau khi thêm ít nhất một sản phẩm.
2. Kiểm tra sản phẩm, quantity, giá và subtotal.
3. Xóa hoặc thay đổi quantity nếu cần.
4. Nhập customer/order information bắt buộc.
5. Chọn Pickup hoặc Delivery và nhập thông tin tương ứng.
6. Review cart/customer/fulfillment summary bằng ngôn ngữ đang chọn.
7. Nhấn **Submit Order** để gửi order request.
8. Hệ thống tiếp nhận thành công và gán trạng thái `PENDING`.
9. Hlime review order trong Admin và xác nhận để chuyển sang `CONFIRMED`.

**CTA chính theo bước:** **Tiếp tục đặt hàng** → **Chọn Pickup/Delivery** → **Submit Order**.  
**CTA hỗ trợ:** **Tiếp tục mua**, **Xóa sản phẩm**, **Quay lại chỉnh sửa**.

**Yêu cầu UX và dữ liệu:**

- Empty Cart phải có hướng quay về Menu.
- Quantity không được nhỏ hơn 1; xóa sản phẩm là hành động riêng và rõ ràng.
- Tổng tiền phải cập nhật chính xác khi quantity thay đổi.
- Nếu giá hoặc availability thay đổi trước lúc submit, hệ thống phải cảnh báo và yêu cầu khách review lại.
- Không thu thập nhiều dữ liệu cá nhân hơn quy trình vận hành thực sự cần.
- Không dùng từ ngữ khiến khách hiểu rằng đã thanh toán.
- Trạng thái `PENDING` nghĩa là website đã tiếp nhận yêu cầu nhưng Hlime chưa xác nhận khả năng đáp ứng.
- Trạng thái `CONFIRMED` chỉ được gán sau khi Hlime thực hiện xác nhận.
- V1 chỉ khóa hai trạng thái nghiệp vụ `PENDING` và `CONFIRMED`; các trạng thái nâng cao được để lại cho giai đoạn sau.
- Order request, line items, Celebration selections và fulfillment data phải được gửi/lưu an toàn qua Supabase. Cơ chế thông báo order mới cho đội ngũ Hlime là quyết định còn mở.

---

## 7. User Flows

### 7.1 Khách mới chưa biết chọn món

```text
Home
→ Shop by Category hoặc Best Sellers
→ Category
→ Product Detail
→ Add to Cart
→ Shopping Cart
→ Customer / Order Information
→ Pickup / Delivery
→ Submit Order
→ PENDING
→ Hlime xác nhận
→ CONFIRMED
```

Điểm cần bảo đảm:

- Định vị thương hiệu rõ ngay ở Hero.
- Category dễ hiểu với người không biết thuật ngữ chuyên môn.
- Best Sellers giúp giảm áp lực lựa chọn.
- Product Detail giải đáp đủ câu hỏi cơ bản trước khi thêm vào Cart.
- Summary trước Submit Order cho phép phát hiện sai sản phẩm, quantity, customer information hoặc fulfillment.

### 7.2 Khách đã biết món

```text
Menu
→ Category Filter
→ Product Detail
→ Add to Cart
→ Shopping Cart
→ Customer Info
→ Pickup / Delivery
→ Submit Order
→ PENDING → CONFIRMED
```

Điểm cần bảo đảm:

- Menu tải nhanh và filter phản hồi rõ.
- Card cho phép nhận ra sản phẩm qua ảnh, tên và giá.
- Số bước từ Menu đến Add to Cart và Submit Order được giữ ở mức tối thiểu nhưng không bỏ qua summary và fulfillment choice.

### 7.3 Khách mua bánh sự kiện

```text
Home
→ Celebration
→ Celebration Product
→ Size + Flavor + Required Date + Message/Note
→ Add to Cart
→ Shopping Cart
→ Customer Info
→ Pickup / Delivery
→ Submit Order
→ PENDING → CONFIRMED
```

Điểm cần bảo đảm:

- Khách hiểu đây là sản phẩm có thể cần đặt trước.
- Trang Celebration hướng dẫn thông tin cần chuẩn bị.
- Sản phẩm có thể đặt trực tiếp đi qua Cart; yêu cầu tùy chỉnh ngoài V1 đi qua kênh tư vấn.
- `PENDING` không tạo cảm giác đã thanh toán hoặc được Hlime chấp nhận; chỉ `CONFIRMED` thể hiện Hlime đã xác nhận order.

### 7.4 Đổi ngôn ngữ trong hành trình mua

```text
VI hoặc KO
→ Browse / Product / Cart
→ Đổi ngôn ngữ
→ Giữ nguyên trang, sản phẩm và quantity
→ Tiếp tục flow bằng ngôn ngữ mới
```

Điểm cần bảo đảm:

- Language switcher dễ tìm trên desktop và mobile.
- VI dùng route mặc định; KO dùng route `/ko/...` tương ứng.
- Nội dung public, validation message, Cart và order status hiển thị bằng ngôn ngữ đang chọn; thiếu KO thì fallback VI.
- Đổi ngôn ngữ không làm mất Cart hoặc dữ liệu khách vừa nhập trong cùng flow.
- Tên sản phẩm trong order summary/status dùng bản dịch tương ứng, trong khi `product_id`, giá và quantity không thay đổi.

### 7.5 Trạng thái ngoại lệ trong flow

| Tình huống | Hành vi mong muốn |
|---|---|
| Sản phẩm tạm unavailable | Giữ thông tin nếu vẫn active, ghi rõ trạng thái, cho phép hỏi thêm hoặc xem sản phẩm khác |
| Category chưa có sản phẩm | Empty state thân thiện, gợi ý category khác hoặc Menu tổng |
| Không tải được dữ liệu | Thông báo ngắn, có nút thử lại và lối về trang ổn định |
| Link sản phẩm không hợp lệ | Trang not found phù hợp, có CTA về Menu |
| Ảnh không tải được | Ảnh dự phòng giữ đúng tỷ lệ, không làm vỡ card |
| Cart trống | Hiển thị empty state và CTA về Menu |
| Sản phẩm trong Cart trở thành unavailable | Cảnh báo, không cho submit cho đến khi khách xóa hoặc cập nhật Cart |
| Giá thay đổi trước khi submit | Hiển thị giá mới, cập nhật tổng và yêu cầu khách review lại |
| Gửi order request thất bại | Giữ Cart và dữ liệu đã nhập, thông báo lỗi và cho phép thử lại an toàn |
| Thiếu nội dung KO | Admin nhận cảnh báo; public route KO fallback sang VI thay vì hiển thị trống |
| Delivery thiếu thông tin giao hàng | Không cho Submit Order và chỉ rõ field cần bổ sung |
| Celebration thiếu size/flavor/ngày cần bánh bắt buộc | Không cho thêm/submit cho đến khi dữ liệu hợp lệ |

---

## 8. Admin Planning

### 8.1 Mục tiêu Admin V1

Admin là công cụ nội bộ để người được cấp quyền thay đổi sản phẩm, ảnh và nội dung VI/KO mà không cần chỉnh code hoặc redeploy website.

Admin V1 ưu tiên:

- Dễ học.
- Ít bước.
- Dữ liệu rõ ràng.
- Hai ngôn ngữ được trình bày song song và có trạng thái dịch dễ nhận biết.
- Ngăn lỗi nhập liệu phổ biến.
- Bảo vệ quyền chỉnh sửa.

Admin V1 không phải hệ thống ERP, POS, inventory nâng cao hoặc full Order Management. Tuy nhiên, V1 bắt buộc có quản lý order tối thiểu: xem danh sách, nhận biết order `PENDING`, xem chi tiết và xác nhận để chuyển thành `CONFIRMED`.

### 8.2 Dashboard

Dashboard cung cấp một cái nhìn nhanh, không cần biểu đồ phức tạp.

Nội dung khuyến nghị:

- Tổng số sản phẩm active.
- Số sản phẩm unavailable.
- Số sản phẩm featured.
- Số sản phẩm best seller.
- Lối tắt thêm sản phẩm và chỉnh Homepage.
- Cảnh báo dữ liệu thiếu quan trọng như sản phẩm active nhưng chưa có ảnh hoặc giá.
- Cảnh báo nội dung public còn thiếu bản KO hoặc bản KO có thể đã cũ sau khi VI thay đổi.
- **Danh sách order**, ưu tiên order mới và order `PENDING`.
- **Badge Pending Orders** hiển thị số lượng order đang có trạng thái `PENDING`.

Dashboard không cần biểu đồ doanh thu, payment report hoặc phân tích order nâng cao trong V1.

### 8.3 Products

Admin phải cho phép:

- Xem danh sách sản phẩm.
- Thêm sản phẩm.
- Sửa sản phẩm.
- Ẩn/hiện bằng trạng thái `active`.
- Cập nhật giá.
- Cập nhật tên, mô tả ngắn và mô tả đầy đủ bằng VI và KO song song.
- Chọn category.
- Tải lên hoặc thay ảnh.
- Đánh dấu featured.
- Đánh dấu best seller.
- Cập nhật available.
- Cập nhật thứ tự hiển thị.
- Với Celebration Cakes: quản lý size options và flavor options bằng VI/KO.

Yêu cầu trải nghiệm:

- Phân biệt rõ **ẩn khỏi website** và **tạm hết/không nhận đặt**.
- Xác thực các field bắt buộc trước khi lưu.
- Hiển thị trạng thái đang lưu, lưu thành công và lỗi.
- Cảnh báo trước thao tác có thể làm mất dữ liệu.
- Không yêu cầu nhập URL ảnh bằng tay nếu đã có luồng upload Storage.
- Có hành động auto-translate VI → KO rõ ràng và cho phép preview/review kết quả.
- Khi VI thay đổi sau khi KO đã được sửa tay, phải cảnh báo trước mọi thao tác có thể thay thế KO.

### 8.4 Categories

Admin Categories tối thiểu cần:

- Xem 6 category V1.
- Chỉnh tên hiển thị và mô tả ngắn bằng VI và KO nếu được phép.
- Chỉnh ảnh đại diện hoặc thứ tự hiển thị nếu thiết kế sử dụng.
- Bật/tắt hiển thị có kiểm soát.

Việc thêm/xóa category có thể ảnh hưởng navigation, filter và Homepage. Đây là thay đổi nội dung có tác động cấu trúc, nên cần quy trình rõ và không cho xóa category đang có sản phẩm mà không xử lý dữ liệu liên quan.

### 8.5 Homepage

Admin Homepage tối thiểu quản lý:

- Hero image.
- Hero title VI và KO.
- Subtitle/tagline VI và KO nếu nội dung cần bản địa hóa.
- Section title, subtitle hoặc supporting text VI/KO dùng trên Homepage.
- About Preview và các Homepage content block đã được prototype duyệt.
- Featured products.

Khuyến nghị giữ cấu trúc và thứ tự section trong code ở V1, còn nội dung chính và lựa chọn sản phẩm lấy từ database. Không cần page builder kéo-thả.

### 8.6 Site Settings

Admin Site Settings quản lý:

- Phone.
- Address VI và KO cho một chi nhánh duy nhất.
- Email.
- Opening hours VI và KO khi có nội dung chữ cần dịch.
- Social links.
- Map link.
- Kênh liên hệ/hỗ trợ ưu tiên nếu được thiết kế dưới dạng setting.

Các giá trị này phải được dùng lại trên Header, Contact và Footer để tránh thông tin mâu thuẫn. V1 chỉ có một chi nhánh; không xây cấu trúc quản lý nhiều chi nhánh.

### 8.7 Order Settings

Admin Order Settings quản lý các dữ liệu vận hành có thể thay đổi mà không cần redeploy:

- Pickup help/instruction text bằng VI/KO.
- Delivery help/instruction text bằng VI/KO.
- Order submit, `PENDING` và `CONFIRMED` help text bằng VI/KO.
- Thông tin chi nhánh được dùng cho Pickup, lấy lại từ Site Settings thay vì nhập lặp.
- Các quy tắc ngày đặt/nhận bánh có thể cấu hình nếu vận hành thực tế cần.

Order Settings không bao gồm payment configuration, inventory nâng cao hoặc shipping engine phức tạp.

### 8.8 Translation Workflow VI → KO

Admin phải hỗ trợ workflow sau cho mọi nội dung song ngữ do Admin quản lý:

```text
Nhập hoặc sửa VI
→ Auto-translate VI → KO
→ Preview KO
→ Admin review và có thể sửa tay
→ Lưu VI + KO + trạng thái dịch
```

Quy tắc bắt buộc:

- Field VI và KO hiển thị song song hoặc chuyển qua lại mà không làm mất dữ liệu chưa lưu.
- VI là nguồn đầu vào cho auto-translate sang KO; hệ thống tự tạo bản KO khi nhập nội dung VI mới và không auto-translate ngược KO → VI trong V1.
- KO luôn sửa tay được.
- Hệ thống phải phân biệt được KO do máy dịch tạo và KO đã được chỉnh thủ công, bằng metadata hoặc cơ chế tương đương.
- Khi VI thay đổi và KO vẫn là bản máy dịch, hệ thống có thể tạo lại bản KO theo VI mới.
- Khi VI thay đổi và KO đã sửa tay, hệ thống phải giữ nguyên KO, cảnh báo rõ rằng bản KO có thể không còn đồng bộ và không tự ghi đè.
- Không tự ghi đè KO đã sửa tay. Mọi thao tác thay thế phải có preview và xác nhận chủ động.
- Admin có thể chọn giữ KO hiện tại, dùng bản dịch mới hoặc chỉnh bản dịch mới trước khi lưu.
- Lỗi dịch không được làm mất VI hoặc KO đang có.
- Secret/API credential của dịch vụ dịch không được đặt trong React frontend.

### 8.9 Orders và tiếp nhận order request

- Shopping Cart thuộc public website, không yêu cầu khách đăng nhập.
- Order request phải được gửi/lưu an toàn qua Supabase cùng line items, customer information, Pickup/Delivery data và Celebration selections khi có.
- Việc submit phải chống tạo bản ghi trùng khi khách nhấn lại hoặc mạng retry ở mức phù hợp với V1.
- Website chỉ hiển thị submit success sau khi Supabase đã tiếp nhận order và tạo trạng thái `PENDING`.
- Admin phải xem được danh sách order và chi tiết customer, line items, Celebration selections, Pickup/Delivery information và order summary.
- Admin phải có hành động xác nhận order để chuyển `PENDING` → `CONFIRMED`.
- Badge Pending Orders phải cập nhật theo số order `PENDING` hiện có.
- Full Order Management ngoài hai trạng thái trên, payment và customer account không thuộc Admin V1.
- Kênh notification chủ động khi có order mới vẫn cần owner xác nhận; dù chưa có notification, order phải xuất hiện đáng tin cậy trong Admin.

### 8.10 Auth và quyền truy cập

- Website public không yêu cầu đăng nhập.
- Admin bắt buộc đăng nhập qua Supabase Auth.
- Chỉ tài khoản được cấp quyền mới truy cập được màn hình và thao tác Admin.
- Ẩn giao diện Admin không thay thế cho bảo mật database; quyền thật phải được kiểm soát bằng RLS/policy.
- V1 giả định một vai trò quản trị chung. Nhiều cấp quyền chỉ thêm khi có nhu cầu vận hành thực tế.
- Phải có cách đăng xuất và xử lý session hết hạn rõ ràng.

### 8.11 Luồng cập nhật không redeploy

```text
Admin đăng nhập
→ Chỉnh nội dung / dữ liệu / ảnh
→ Supabase Database hoặc Storage
→ Website public đọc dữ liệu mới
→ Nội dung mới xuất hiện mà không redeploy
```

Quy tắc phân biệt:

| Loại thay đổi | Ví dụ | Có cần deploy? |
|---|---|---|
| Thay đổi code | Layout, logic filter, component, quy tắc validation, route mới | Có |
| Thay đổi content | Tên/mô tả VI-KO, giá, opening hours, social links, order/help text | Không |
| Thay đổi database record | Active, available, featured, best seller, display order | Không |
| Thay đổi image | Hero image, product image, category image; upload mới dùng filename/path unique | Không |
| Thay đổi database schema hoặc policy | Thêm field, sửa quan hệ, thay RLS | Có quy trình kỹ thuật và kiểm thử; có thể cần deploy phần website liên quan |

“Không cần redeploy” không có nghĩa là bỏ qua validation, quyền truy cập hoặc kiểm tra nội dung trước khi public.

### 8.12 Demo Data và dữ liệu kinh doanh có thể thay đổi

Prototype/V1 được phép dùng demo data hợp lý để thiết kế và kiểm thử, gồm:

- Địa chỉ, số điện thoại, email, giờ mở cửa, social links và map link.
- Tên, mô tả, giá và ảnh bánh.
- Hero title, subtitle và image.
- Nội dung Homepage.
- Category image và text.
- Order/help text.

Quy tắc bắt buộc:

- Demo data phải được đánh dấu rõ là **DEMO — NOT PRODUCTION DATA** trong tài liệu, seed/data source hoặc môi trường quản trị phù hợp để không bị nhầm là dữ liệu thật.
- Mọi demo data có khả năng thay đổi trong vận hành phải được thiết kế để chỉnh qua Admin sau này.
- Ưu tiên đặt dữ liệu trong **Products**, **Categories**, **Homepage Settings**, **Site Settings** và **Order Settings**.
- Không hard-code dữ liệu kinh doanh thay đổi thường xuyên vào React components hoặc route files.
- Có thể hard-code layout, component structure, route structure và các system rule ít thay đổi.
- Trước production, toàn bộ demo data public phải được thay bằng dữ liệu thật đã được owner duyệt.

---

## 9. Technical Architecture — Planning Only

Phần này mô tả hướng kiến trúc, không phải yêu cầu triển khai trong task tạo tài liệu.

### 9.1 Kiến trúc V1 đã khóa

| Lớp | Hướng đề xuất | Lý do |
|---|---|---|
| Frontend public + Admin UI | **React + Vite** | Nhẹ, dễ bảo trì, phù hợp Supabase, Admin và Shopping Cart |
| Backend/Data | **Supabase** | Lưu products, bản dịch VI/KO, categories, Homepage/Site/Order Settings, orders, line items và trạng thái V1 |
| Auth | Supabase Auth | Bảo vệ quyền truy cập Admin |
| Media | Supabase Storage | Lưu ảnh sản phẩm và ảnh nội dung |
| Source control | Git + GitHub | Theo dõi thay đổi code và hỗ trợ quy trình review/deploy |
| Auto-translation boundary | Supabase server-side capability hoặc secure backend boundary thuộc hệ Supabase | Không để secret dịch vụ dịch trong React frontend; hỗ trợ VI → KO có kiểm soát |
| Deployment | **Hosting/domain/staging chưa chốt**; chỉ chọn sau khi prototype và frontend direction ổn định | Phương án cuối cùng phải hỗ trợ HTTPS, custom domain, React + Vite, GitHub deploy và biến môi trường an toàn |

React + Vite và Supabase là quyết định chính thức của V1. Hosting provider, domain và staging chưa được chọn; việc đánh giá chỉ bắt đầu sau khi prototype/frontend ổn định. Không đổi stack đã khóa nếu không có lý do kỹ thuật đủ mạnh và owner phê duyệt.

### 9.2 Sơ đồ dữ liệu và nội dung

```text
                    ┌─────────────────────┐
                    │     Admin User      │
                    └──────────┬──────────┘
                               │ Sign in
                               ▼
                    ┌─────────────────────┐
                    │    Supabase Auth    │
                    └──────────┬──────────┘
                               │ Authorized write
                               ▼
┌─────────────────┐ Read content ┌─────────────────────┐
│ React Public UI │◄─────────────│ Supabase Database   │
│ + Shopping Cart │─────────────►│ Orders: PENDING     │
└────────┬────────┘ Submit order └──────────┬──────────┘
         │                                  │ Image path
         │ Read public images               ▼
         └───────────────────────►┌─────────────────────┐
                                 │  Supabase Storage   │
                                 └─────────────────────┘

Admin VI content
→ Secure Supabase-side translation boundary
→ VI → KO translation service
→ Preview/review in Admin
→ Save without silently overwriting manually edited KO

PENDING Order
→ Admin Order List + Pending Badge
→ Hlime review/xác nhận
→ CONFIRMED
```

### 9.3 Public website flow

1. React website dùng VI trên route mặc định và KO trên route `/ko/...`.
2. Website yêu cầu dữ liệu VI/KO cần thiết từ Supabase; nếu field KO thiếu thì fallback VI.
3. Supabase chỉ trả dữ liệu public theo policy đã định nghĩa.
4. Website render sản phẩm, category và settings.
5. Ảnh được tải từ Storage với kích thước phù hợp.
6. Cart quản lý product reference, quantity và summary trong frontend; cách persistence phải không làm mất Cart khi điều hướng trong phiên.
7. Khách nhập Customer Info, chọn Pickup/Delivery và Submit Order.
8. Supabase lưu order, line items và fulfillment data với trạng thái khởi tạo `PENDING`.
9. Nếu có lỗi, website giữ Cart/dữ liệu phù hợp, hiển thị trạng thái dự phòng và cho phép thử lại an toàn.

### 9.4 Admin flow

1. Admin đăng nhập.
2. Supabase Auth xác thực session.
3. Admin UI kiểm tra trạng thái đăng nhập và quyền phù hợp.
4. Thao tác đọc/ghi đi qua policy RLS của Supabase.
5. Ảnh được tải lên Storage theo policy.
6. Khi yêu cầu auto-translate, VI được gửi qua secure Supabase-side boundary; kết quả KO quay về Admin để preview/review.
7. KO đã sửa tay chỉ được thay thế sau cảnh báo và xác nhận chủ động.
8. Admin xem danh sách order và badge Pending Orders.
9. Hlime review order rồi chuyển trạng thái `PENDING` → `CONFIRMED`.
10. Website public nhận content/data/image cập nhật ở lần tải hoặc refresh tiếp theo mà không redeploy.

### 9.5 Ranh giới bảo mật

- Public frontend chỉ chứa thông tin được phép công khai.
- Không đưa service role key hoặc secret vào frontend.
- Không đưa credential của dịch vụ auto-translate vào React frontend.
- Public/anonymous key chỉ được dùng theo mô hình Supabase cho phép và luôn đi kèm RLS đúng.
- Quyền ghi products, categories, homepage và site settings chỉ dành cho admin hợp lệ.
- Quyền gửi order request từ public phải được giới hạn, validate và bảo vệ khỏi lạm dụng; không được mở quyền ghi tùy ý vào dữ liệu quản trị.
- Customer/order information chỉ được đọc bởi vai trò được phép và không được trả về public.
- Chỉ Admin được phép chuyển trạng thái order từ `PENDING` sang `CONFIRMED`.
- Quyền upload, thay và xóa ảnh phải được giới hạn.
- Validation phía giao diện giúp trải nghiệm tốt hơn nhưng không thay thế validation và policy phía dữ liệu.
- Trước production cần kiểm thử trực tiếp các tình huống truy cập trái phép.

### 9.6 Nguyên tắc cache và cập nhật

- Content, data và image thay đổi qua Admin phải xuất hiện trên website mà không cần redeploy.
- React frontend không được đóng cứng dữ liệu kinh doanh tại thời điểm build theo cách làm Admin sửa nhưng website vẫn giữ nội dung cũ lâu dài.
- Mỗi lần upload/thay ảnh phải dùng **filename hoặc storage path unique**. Không ghi đè file cũ tại cùng URL rồi trông chờ browser/CDN tự bỏ cache.
- Database lưu path mới; website đọc path mới để nhận ảnh mới ngay theo chính sách tải dữ liệu/cache đã chọn.
- Cơ chế refresh/revalidation cụ thể được chốt trong technical design, nhưng không được phá yêu cầu “Admin update không cần redeploy”.

### 9.7 Môi trường

Tối thiểu nên phân biệt:

- **Local/Development**: phát triển và kiểm tra cá nhân.
- **Production**: website thật cho khách hàng.

Quyết định có staging hay không được để lại đến khi prototype/frontend ổn định, cùng thời điểm chọn hosting/domain. Dữ liệu thử nghiệm không được làm lẫn hoặc làm hỏng dữ liệu production.

### 9.8 Ranh giới hard-code và dữ liệu quản trị

| Được hard-code | Phải quản lý qua Supabase/Admin |
|---|---|
| Layout | Products và Celebration options |
| Component structure | Categories |
| Route structure, gồm route VI mặc định và route KO | Homepage Settings |
| System rules ít thay đổi, gồm order status transition V1 | Site Settings cho một chi nhánh |
| Validation structure | Order Settings và order/help text |
|  | Dữ liệu kinh doanh/demo data có thể thay đổi |

Demo data chỉ dùng để prototype/test, phải được đánh dấu **DEMO — NOT PRODUCTION DATA** và thay trước khi go-live.

---

## 10. Responsive và Mobile Experience

### 10.1 Nguyên tắc

Thiết kế desktop và mobile phải được nghĩ từ đầu. Mobile không phải phiên bản desktop được thu nhỏ.

Mỗi breakpoint cần xem xét lại:

- Thứ tự ưu tiên nội dung.
- Kích thước và crop ảnh.
- Số cột sản phẩm.
- Cách hiển thị navigation và filter.
- Vị trí CTA.
- Khoảng cách và vùng nhấn.

### 10.2 Ưu tiên trên mobile

Theo thứ tự:

1. Hình ảnh sản phẩm.
2. Tên bánh.
3. Giá.
4. Trạng thái available.
5. Category filter.
6. CTA thêm vào giỏ hàng.
7. Cart summary và CTA xác nhận đơn.
8. Language switcher VI/KO.
9. Navigation dễ sử dụng.

### 10.3 Yêu cầu mobile

- Header gọn, menu dễ mở/đóng, CTA không gây chật.
- Language switcher và Cart dễ tìm nhưng không cạnh tranh quá mức với nội dung sản phẩm.
- Hero không chiếm quá nhiều chiều cao đến mức che toàn bộ nội dung tiếp theo.
- Ảnh không bị crop mất bánh ở các kích thước phổ biến.
- Product grid phù hợp với chiều rộng; chữ và giá không bị cắt.
- Filter có thể cuộn ngang hoặc dùng pattern gọn nếu cần, nhưng phải thể hiện lựa chọn hiện tại.
- Vùng nhấn đủ lớn và có khoảng cách để tránh bấm nhầm.
- CTA thêm vào Cart và tiếp tục/xác nhận đơn dễ tiếp cận, nhưng sticky CTA chỉ dùng nếu không che nội dung.
- Cart line item, quantity control, subtotal và form thông tin đơn phải dùng tốt trên màn hình hẹp.
- Map hoặc nội dung nhúng không làm tràn chiều ngang.
- Form dùng keyboard type phù hợp và thông báo lỗi dễ thấy.

### 10.4 Kiểm thử responsive tối thiểu

- Mobile nhỏ.
- Mobile phổ biến.
- Tablet hoặc màn hình trung gian.
- Laptop.
- Desktop rộng.

Không nghiệm thu chỉ dựa vào một kích thước mô phỏng. Cần kiểm tra ít nhất một thiết bị mobile thật trước production nếu có thể.

---

## 11. V1 Scope và Future V2

### 11.1 Trong phạm vi V1

- Catalogue sản phẩm.
- Category và filter cơ bản.
- Product Detail.
- Website song ngữ Vietnamese/Korean: VI mặc định, KO có route riêng, thiếu KO fallback VI.
- Language switcher giữ nguyên hành trình và Cart.
- Homepage theo storyboard.
- Celebration page.
- About page.
- Contact / Order Support.
- Shopping Cart: add/remove product, quantity, subtotal và cart summary.
- Customer Info.
- Pickup tại cửa hàng và Delivery.
- Summary và Submit Order.
- Order status flow tối thiểu: `PENDING` → Hlime xác nhận → `CONFIRMED`.
- Celebration V1: size, flavor, ngày cần bánh và lời nhắn/ghi chú.
- Lưu order, line items, fulfillment và Celebration selections an toàn qua Supabase.
- Admin.
- Dashboard có danh sách order và badge Pending Orders.
- Admin xem order và chuyển `PENDING` → `CONFIRMED`.
- Field VI và KO song song trong Admin.
- Auto-translate VI → KO có preview/review và bảo vệ KO đã sửa tay.
- Products, Categories, Homepage Settings, Site Settings và Order Settings quản lý business content có thể thay đổi.
- Demo data hợp lý được phép dùng trong Prototype/V1 nhưng phải được đánh dấu không phải production data và có đường chỉnh qua Admin.
- Ảnh upload mới dùng filename/path unique; content/data/image cập nhật qua Admin không cần redeploy.
- Supabase Database.
- Supabase Storage cho ảnh.
- Supabase Auth cho Admin.
- RLS và policy bảo mật cần thiết.
- Responsive desktop và mobile.
- Loading, error và empty states.
- SEO cơ bản.
- Production deployment.

### 11.2 Chưa ưu tiên trong V1

- Online payment hoặc lưu thông tin thanh toán.
- Inventory nâng cao hoặc đồng bộ kho.
- Customer accounts.
- Order workflow ngoài `PENDING` và `CONFIRMED`, báo cáo hoặc quản lý vòng đời đơn nâng cao.
- Loyalty/membership.
- Coupon hoặc promotion engine.
- Review/rating.
- Page builder tổng quát.
- Phân quyền Admin nhiều tầng nếu chưa có nhu cầu.

### 11.3 Future V2

Luồng V2 định hướng mở rộng từ Cart/Confirmation đã có trong V1:

```text
V1 Cart + Submit Order + PENDING/CONFIRMED
→ Online Payment
→ Full Order Management
```

V2 chỉ bắt đầu sau khi V1 vận hành ổn định và có dữ liệu thực tế chứng minh nhu cầu. V1 không xây trước payment, customer account, loyalty hoặc inventory phức tạp. Việc chuẩn bị cho V2 chỉ nên dừng ở dữ liệu Cart/order request sạch và code dễ mở rộng.

### 11.4 Quy tắc kiểm soát scope

Một feature mới chỉ được thêm vào V1 khi:

- Có vấn đề người dùng hoặc vận hành cụ thể cần giải quyết.
- Không thể xử lý hợp lý bằng flow hiện có.
- Owner chấp thuận tác động đến thời gian và tiêu chí nghiệm thu.
- Tài liệu này được cập nhật trước hoặc cùng lúc với quyết định triển khai.

---

## 12. Development Order và Approval Gates

### 12.1 Thứ tự bắt buộc

```text
Context
→ Structure
→ Design
→ Storyboard
→ HTML Prototype
→ Review Prototype
→ Frontend
→ Database
→ Storage
→ Auth
→ Admin
→ Security/RLS
→ Testing
→ Deploy
→ Final Review
```

### 12.2 Ý nghĩa từng giai đoạn

| Giai đoạn | Kết quả cần có trước khi đi tiếp |
|---|---|
| Context | Mục tiêu, đối tượng, định vị, V1 scope và non-goals được hiểu thống nhất |
| Structure | Sitemap, VI mặc định, route KO/fallback VI, category, Cart/Pickup/Delivery và content hierarchy được chốt |
| Design | Màu, typography, components, image direction và responsive direction được duyệt |
| Storyboard | Flow từng trang, đổi ngôn ngữ, Celebration options, Cart, Pickup/Delivery, Submit và status được chốt |
| HTML Prototype | Prototype tĩnh dùng demo data đã đánh dấu, thể hiện VI/KO, Cart/Pickup/Delivery/order status và responsive direction; chưa cần database/Admin |
| Review Prototype | Owner duyệt hướng frontend, luồng song ngữ, Cart, hình ảnh và nội dung; danh sách sửa lớn đã hoàn tất |
| Frontend | Xây giao diện thật bằng React + Vite theo prototype đã duyệt, gồm Cart V1 và các điểm kết nối Supabase |
| Database | Tạo data model tối thiểu cho content VI/KO, products, settings, orders/line items, fulfillment và trạng thái `PENDING`/`CONFIRMED` |
| Storage | Thiết lập luồng ảnh và quy tắc lưu trữ |
| Auth | Thiết lập đăng nhập và session cho Admin |
| Admin | Xây Orders list/Pending badge, luồng `PENDING` → `CONFIRMED`, quản lý VI/KO, auto-translate và các Settings đã định nghĩa |
| Security/RLS | Khóa quyền public/admin/order submission, kiểm thử policy và không để lộ secret dịch hoặc secret Supabase |
| Testing | Kiểm thử VI/KO, Cart/order status, chức năng, responsive, accessibility, dữ liệu, lỗi và hiệu năng |
| Deploy | Chọn hosting/domain/staging sau khi prototype/frontend ổn định, rồi deploy production với HTTPS và cấu hình môi trường đúng |
| Final Review | Owner nghiệm thu toàn bộ acceptance criteria và nội dung production |

### 12.3 Approval gate bắt buộc

> **Không làm Backend/Admin trước khi prototype và frontend direction được owner duyệt.**

Gate tối thiểu:

- Sau **Structure + Storyboard**: owner duyệt luồng và phạm vi.
- Sau **Design + HTML Prototype**: owner duyệt visual direction, desktop/mobile, VI/KO, Cart và CTA.
- Trước **Database**: technical owner xác nhận data model tối thiểu, gồm content song ngữ và order request V1.
- Chỉ đánh giá/chọn hosting, domain và staging sau khi prototype/frontend direction ổn định.
- Trước **Deploy**: owner xác nhận content, ảnh, thông tin liên hệ và sản phẩm thật.
- Tại **Final Review**: mọi acceptance criteria phải có bằng chứng kiểm tra.

Nếu prototype bị từ chối, quay lại Design/Storyboard. Không dùng Backend/Admin đã xây để ép prototype theo một hướng chưa được duyệt.

---

## 13. Development Principles

Checklist này áp dụng xuyên suốt quá trình xây dựng:

- [ ] **Mobile-first awareness:** mọi quyết định layout phải tính đến trải nghiệm mobile ngay từ đầu.
- [ ] **Accessibility:** hỗ trợ keyboard, focus rõ, tương phản tốt, alt text phù hợp, label đầy đủ và semantic structure.
- [ ] **Performance:** hạn chế JavaScript không cần thiết, tối ưu ảnh, font và tài nguyên tải đầu trang.
- [ ] **Semantic HTML:** dùng cấu trúc đúng ý nghĩa để hỗ trợ accessibility và SEO.
- [ ] **Clear code structure:** tổ chức theo trách nhiệm rõ ràng, tên dễ hiểu, tránh component hoặc file quá tải.
- [ ] **Minimal hard-code:** nội dung cần Admin quản lý phải đến từ database/settings; chỉ hard-code cấu trúc ít thay đổi.
- [ ] **No secrets in frontend:** không đưa service role key, mật khẩu hoặc thông tin bí mật vào source code/client bundle.
- [ ] **Safe database/RLS:** mọi bảng và Storage bucket phải có policy phù hợp trước production.
- [ ] **Loading/error/empty states:** mọi màn hình dựa vào dữ liệu phải xử lý đủ ba trạng thái.
- [ ] **Image optimization:** kích thước, định dạng, tỷ lệ, lazy loading và ảnh dự phòng được xử lý nhất quán.
- [ ] **SEO fundamentals:** title, description, heading, URL, metadata chia sẻ và nội dung indexable hợp lý.
- [ ] **Consistent design system:** dùng lại token, component và pattern; không thiết kế mỗi trang như một website khác nhau.
- [ ] **Minimal AI smell:** nội dung cụ thể, layout có chủ đích, không lạm dụng hiệu ứng, placeholder hoặc câu chữ sáo rỗng.
- [ ] **Bilingual consistency:** VI/KO cùng cấu trúc, không mất Cart/state khi đổi ngôn ngữ và không public bản dịch chưa được kiểm soát.
- [ ] **Data minimization:** Cart/order form chỉ thu thập dữ liệu khách hàng thực sự cần cho việc tiếp nhận đơn.

Nguyên tắc bổ sung:

- [ ] Ưu tiên giải pháp đơn giản nhất đáp ứng đúng V1.
- [ ] Không thêm dependency hoặc abstraction nếu chưa có nhu cầu rõ.
- [ ] Không dùng dữ liệu giả trong production.
- [ ] Phân biệt rõ “website đã tiếp nhận order request”, “Hlime đã xác nhận khả năng đáp ứng” và “đã thanh toán”; V1 không có online payment.
- [ ] Mọi thay đổi có ảnh hưởng lớn phải được phản ánh lại trong tài liệu này.

---

## 14. Acceptance Criteria — Khi nào Hlime V1 hoàn thành

Hlime V1 chỉ được xem là hoàn thành khi tất cả tiêu chí bắt buộc dưới đây đạt và owner đã thực hiện Final Review.

### 14.1 Brand và nội dung

- [ ] Tên thương hiệu, tagline, màu sắc và typography nhất quán với specification.
- [ ] Giao diện thể hiện đúng “soft premium”, không quá cute và không tạo cảm giác xa xỉ khó tiếp cận.
- [ ] Không còn placeholder, lorem ipsum, ảnh demo hoặc thông tin liên hệ giả trên production.
- [ ] Demo data dùng trong Prototype/V1 được đánh dấu rõ **DEMO — NOT PRODUCTION DATA** và được thay trước go-live.
- [ ] Dữ liệu kinh doanh có thể thay đổi được quản lý qua Products, Categories, Homepage Settings, Site Settings hoặc Order Settings thay vì hard-code.
- [ ] Mọi tuyên bố về sản phẩm/thương hiệu đã được owner xác nhận.

### 14.2 Song ngữ Vietnamese/Korean

- [ ] Website public chuyển đổi được giữa VI và KO trên mọi trang chính.
- [ ] VI là ngôn ngữ mặc định trên route mặc định; KO dùng route riêng `/ko/...`.
- [ ] Navigation, CTA, validation message, empty/error state, Product Detail, Cart và Confirmation có nội dung phù hợp ở cả VI và KO.
- [ ] Đổi ngôn ngữ giữ nguyên trang hiện tại, sản phẩm trong Cart, quantity và dữ liệu người dùng đang nhập trong flow.
- [ ] Products, categories, Homepage content và Site Settings có field VI/KO theo specification.
- [ ] Field KO bị thiếu trên route KO fallback sang VI và không làm trang trống/vỡ; Admin vẫn hiển thị cảnh báo thiếu KO.
- [ ] Auto-translate chỉ chạy VI → KO và không làm mất nội dung VI.
- [ ] KO sửa tay được và không bị tự ghi đè khi VI thay đổi.
- [ ] Trước khi thay KO đã sửa tay, Admin thấy cảnh báo, preview và phải xác nhận chủ động.

### 14.3 Desktop

- [ ] Tất cả trang trong sitemap hoạt động ở kích thước laptop và desktop phổ biến.
- [ ] Layout không vỡ, không có nội dung bị cắt hoặc khoảng trắng bất thường.
- [ ] Navigation, language switcher, Cart, filter, CTA, card và form có đầy đủ trạng thái tương tác cần thiết.
- [ ] Ảnh sản phẩm rõ, đúng tỷ lệ và là trọng tâm thị giác.

### 14.4 Mobile

- [ ] Tất cả trang có layout mobile được thiết kế riêng theo ưu tiên nội dung, không chỉ thu nhỏ desktop.
- [ ] Navigation, language switcher, Cart và category filter dễ thao tác bằng ngón tay.
- [ ] Tên bánh, giá, trạng thái và CTA thêm vào giỏ hàng dễ nhận thấy.
- [ ] Quantity control, cart summary, Customer Info, Pickup/Delivery và summary trước Submit Order dùng tốt trên màn hình hẹp.
- [ ] Không có scroll ngang ngoài ý muốn.
- [ ] Luồng Home/Menu → Product → Cart → Customer Info → Pickup/Delivery → Submit Order hoàn thành được trên mobile bằng cả VI và KO.

### 14.5 Products và categories

- [ ] 6 category V1 hiển thị đúng mục đích và liên kết đúng sản phẩm.
- [ ] Menu hiển thị sản phẩm active và không public sản phẩm inactive.
- [ ] Filter category hoạt động đúng và có empty state.
- [ ] Product Detail hiển thị đúng ảnh, tên, category, mô tả, giá và trạng thái bằng ngôn ngữ đang chọn.
- [ ] Featured, best seller, available và display order hoạt động theo quy tắc.
- [ ] Sản phẩm available thêm vào Cart được; sản phẩm unavailable không thể thêm vào Cart.
- [ ] Celebration Cakes hỗ trợ chọn size, flavor, ngày cần bánh và lời nhắn/ghi chú.
- [ ] Size/flavor options của Celebration chỉnh được từ Admin mà không redeploy.
- [ ] Link sản phẩm không hợp lệ hoặc sản phẩm ẩn được xử lý an toàn.

### 14.6 Shopping Cart và xác nhận/chốt đơn

- [ ] Khách có thể add/remove sản phẩm mà không cần đăng nhập.
- [ ] Khách có thể thay đổi quantity hợp lệ; subtotal từng dòng và tổng Cart cập nhật chính xác.
- [ ] Cart summary hiển thị rõ sản phẩm, quantity, giá và tổng tạm tính.
- [ ] Cart được giữ khi khách điều hướng giữa các trang và đổi VI/KO trong cùng flow.
- [ ] Empty Cart có CTA quay lại Menu.
- [ ] Customer/order form chỉ yêu cầu thông tin đã được owner xác nhận là cần thiết.
- [ ] Khách chọn được **Pickup tại cửa hàng** hoặc **Delivery** và chỉ nhập các field phù hợp với lựa chọn.
- [ ] Pickup hiển thị đúng thông tin của chi nhánh duy nhất; Delivery validate thông tin giao hàng bắt buộc.
- [ ] Có summary review trước thao tác **Submit Order**.
- [ ] Nếu giá hoặc availability thay đổi trước submit, khách được cảnh báo và phải review lại.
- [ ] Order, line items, fulfillment và Celebration selections được Supabase tiếp nhận an toàn, không mở quyền ghi tùy ý vào dữ liệu khác.
- [ ] Submit thành công tạo order với trạng thái `PENDING` và giải thích rằng Hlime chưa xác nhận.
- [ ] Order xuất hiện trong Admin; Hlime xác nhận được để chuyển `PENDING` → `CONFIRMED`.
- [ ] Chỉ order được Hlime xác nhận mới có trạng thái `CONFIRMED`.
- [ ] Submit lỗi không làm mất Cart hoặc dữ liệu khách vừa nhập; retry không tạo order request trùng ngoài ý muốn.
- [ ] Flow không yêu cầu customer account và không có online payment.
- [ ] Không có nội dung khiến khách hiểu nhầm rằng họ đã thanh toán.

### 14.7 Images

- [ ] Admin có thể upload/thay ảnh theo quyền được cấp.
- [ ] Mỗi ảnh upload/thay mới dùng filename hoặc Storage path unique; database được cập nhật sang path mới.
- [ ] Website public đọc ảnh từ Storage mà không cần redeploy.
- [ ] Ảnh được tối ưu phù hợp cho web và không làm layout nhảy đáng kể.
- [ ] Có alt text hoặc chiến lược alt text phù hợp cho ảnh có ý nghĩa.
- [ ] Ảnh lỗi có fallback hợp lý.

### 14.8 Admin

- [ ] Admin đăng nhập được và người không có quyền không truy cập được chức năng quản trị.
- [ ] Admin xem, thêm, sửa, ẩn/hiện sản phẩm được.
- [ ] Admin cập nhật field VI/KO, giá, category, ảnh, featured, best seller, available và display order được.
- [ ] Admin quản lý Categories, Homepage và Site Settings bằng VI/KO theo specification.
- [ ] Admin quản lý Order Settings và order/help text bằng VI/KO.
- [ ] Admin nhập VI thì hệ thống auto-translate sang KO và cho phép preview/review kết quả.
- [ ] Admin sửa KO thủ công được; trạng thái KO đã sửa tay được bảo vệ khỏi ghi đè im lặng.
- [ ] Khi VI đổi, Admin được cảnh báo nếu KO có thể đã cũ.
- [ ] Dashboard hiển thị danh sách order và badge đúng số Pending Orders.
- [ ] Admin xem được chi tiết order, Customer Info, Pickup/Delivery và Celebration selections.
- [ ] Admin chuyển được order từ `PENDING` sang `CONFIRMED`.
- [ ] Demo business data trong Products, Categories, Homepage Settings, Site Settings và Order Settings sửa được mà không thay code.
- [ ] Các form có validation, loading, success và error feedback rõ ràng.
- [ ] Thay đổi content/database/image xuất hiện trên public website mà không cần redeploy.

### 14.9 Auth, RLS và dữ liệu khách hàng

- [ ] Website public không yêu cầu tài khoản khách hàng.
- [ ] Admin dùng Supabase Auth và session được xử lý đúng.
- [ ] Người dùng anonymous không thể tạo, sửa hoặc xóa dữ liệu quản trị.
- [ ] Người dùng anonymous không thể upload, thay hoặc xóa ảnh quản trị.
- [ ] Public chỉ có thể gửi order request qua luồng được validate; không thể đọc order request hoặc customer information.
- [ ] Customer/order information chỉ được truy cập bởi vai trò được phép.
- [ ] Chỉ Admin được phép chuyển order `PENDING` → `CONFIRMED`.
- [ ] Tài khoản không được cấp quyền không thể thực hiện thao tác Admin bằng cách gọi trực tiếp API.
- [ ] Không có Supabase secret hoặc translation service credential trong React frontend, repository public hoặc cấu hình gửi xuống browser.
- [ ] RLS/Storage policies đã được kiểm thử bằng các tình huống được phép và bị từ chối.

### 14.10 Error handling

- [ ] Có loading, empty và error state cho các vùng tải dữ liệu.
- [ ] Lỗi mạng không làm toàn bộ website trắng hoặc mất điều hướng.
- [ ] Admin không mất dữ liệu nhập mà không có cảnh báo hợp lý khi lưu lỗi.
- [ ] Lỗi auto-translate không làm mất VI hoặc KO hiện có.
- [ ] Thiếu KO trên public route KO fallback VI; fallback không che mất cảnh báo dịch trong Admin.
- [ ] Lỗi submit order giữ Cart và customer/order information phù hợp để khách thử lại.
- [ ] Thông báo lỗi dùng ngôn ngữ dễ hiểu và chỉ dẫn bước tiếp theo.
- [ ] Trang 404 có lối về Home hoặc Menu.

### 14.11 Performance

- [ ] Ảnh được resize/compress và tải theo nhu cầu.
- [ ] Nội dung đầu trang không bị trì hoãn bởi tài nguyên không cần thiết.
- [ ] Font và script được giới hạn hợp lý.
- [ ] Không có lỗi nghiêm trọng trong console production.
- [ ] React + Vite build không tải toàn bộ Admin hoặc dữ liệu KO/VI không cần thiết vào luồng public một cách lãng phí.
- [ ] Kiểm tra hiệu năng được thực hiện trên mobile/network thực tế hoặc mô phỏng hợp lý; các vấn đề lớn đã được xử lý.

Không khóa V1 vào một điểm số công cụ duy nhất. Việc nghiệm thu dựa trên trải nghiệm thực tế, các chỉ số kỹ thuật hợp lý và không có bottleneck rõ ràng.

### 14.12 SEO cơ bản

- [ ] Mỗi trang chính có title và meta description đúng nội dung cho VI và KO.
- [ ] Mỗi trang có một heading chính rõ ràng và hierarchy hợp lý.
- [ ] URL dễ đọc và không thay đổi tùy tiện.
- [ ] Có metadata chia sẻ social cơ bản với ảnh phù hợp.
- [ ] Có sitemap/robots behavior phù hợp với production.
- [ ] Chiến lược locale URL, alternate language/hreflang hoặc giải pháp tương đương đã được kiểm tra theo technical design.
- [ ] Nội dung quan trọng có thể được đọc mà không phụ thuộc vào chữ nằm trong ảnh.
- [ ] Trang Admin và các trang không nên index được loại khỏi indexing phù hợp.

### 14.13 Production deployment

- [ ] Hosting/domain/staging chỉ được chọn sau khi prototype và frontend direction ổn định.
- [ ] Production chạy qua HTTPS trên hosting/domain được owner xác nhận.
- [ ] Biến môi trường production đúng và không bị lộ.
- [ ] React + Vite production kết nối đúng Supabase Database, Auth và Storage.
- [ ] Navigation, VI/KO, Cart, order submission, link liên hệ, map, phone, email và social links đã kiểm tra.
- [ ] Content/data/image cập nhật qua Admin hoạt động không cần redeploy.
- [ ] Ảnh thay mới xuất hiện qua unique path, không bị giữ ảnh cũ do ghi đè cùng URL.
- [ ] Có cách xác định phiên bản deploy và rollback khi cần.
- [ ] Smoke test hoàn tất sau deploy trên desktop và mobile.
- [ ] Owner hoàn thành Final Review và chấp thuận go-live.

---

## 15. Assumptions và Owner Decisions

### 15.1 Quyết định owner đã khóa

**Owner Review: APPROVED.** Các quyết định dưới đây không còn là assumption:

1. Website V1 song ngữ **Vietnamese (VI)** và **Korean (KO)**; VI mặc định, KO dùng route riêng `/ko/...`, thiếu KO thì fallback VI.
2. Admin nhập VI và hệ thống auto-translate sang KO. KO sửa tay được; KO đã sửa tay không bị tự ghi đè.
3. V1 chỉ có **một chi nhánh**.
4. Order flow là **Product → Add to Cart → Cart → Customer Info → Pickup/Delivery → Submit Order → `PENDING` → Hlime xác nhận → `CONFIRMED`**.
5. V1 hỗ trợ cả **nhận tại cửa hàng (Pickup)** và **giao hàng (Delivery)**.
6. Celebration V1 có **size, flavor, ngày cần bánh và lời nhắn/ghi chú**.
7. Admin Dashboard có **danh sách order** và **badge số Pending Orders**; Admin xác nhận order để chuyển `PENDING` → `CONFIRMED`.
8. V1 không có online payment. Payment vẫn thuộc Future V2.
9. Frontend chính thức dùng **React + Vite**; Backend/Data/Auth/Storage dùng **Supabase**.
10. Hosting provider, domain và staging chưa chốt; chỉ chọn sau khi prototype/frontend ổn định.
11. Ảnh upload/thay mới dùng filename hoặc Storage path unique. Content/data/image đổi qua Admin không cần redeploy.
12. Prototype/V1 được dùng demo data hợp lý, nhưng dữ liệu kinh doanh có thể thay đổi phải quản lý qua **Products, Categories, Homepage Settings, Site Settings hoặc Order Settings**, không hard-code.
13. Layout, component structure, route structure và system rule ít thay đổi có thể hard-code.

### 15.2 Assumptions đang dùng cho V1

Các giả định sau giúp tài liệu đủ cụ thể nhưng chưa được xem là quyết định kinh doanh cuối cùng:

1. Tên món hoặc thuật ngữ Pháp có thể được giữ nguyên trong VI/KO khi phù hợp và dễ hiểu.
2. Giá hiển thị bằng VND và là một giá cơ bản cho mỗi sản phẩm trong data model V1.
3. `PENDING` nghĩa là website đã tiếp nhận order nhưng Hlime chưa xác nhận; `CONFIRMED` nghĩa là Hlime đã xác nhận khả năng đáp ứng. Hai trạng thái này không mang nghĩa đã thanh toán.
4. Public website không có customer account; Supabase Auth chỉ phục vụ Admin.
5. V1 dùng một vai trò Admin chung, chưa cần editor/manager nhiều cấp.
6. Mỗi sản phẩm thuộc một category chính và có một ảnh đại diện trong data model tối thiểu.
7. Cấu trúc Homepage được cố định trong code; Admin quản lý nội dung VI/KO và lựa chọn sản phẩm, không có page builder.
8. Search không bắt buộc trong V1 vì category filter được giả định là đủ cho quy mô catalogue ban đầu.
9. Full Order Management ngoài `PENDING`/`CONFIRMED` không thuộc V1.

### 15.3 Quyết định vẫn cần owner xác nhận

| Quyết định | Tại sao cần chốt | Thời điểm chốt muộn nhất |
|---|---|---|
| Dịch vụ auto-translate và metadata kỹ thuật dùng để đánh dấu KO đã sửa tay | Ảnh hưởng secure integration và chi phí vận hành; hành vi bảo vệ KO đã được khóa | Trước Database/Admin |
| Customer/order information bắt buộc | Cần khớp quy trình thực tế và nguyên tắc data minimization | Trước Cart Prototype được duyệt |
| Delivery area, fee, thời gian giao và pickup time rules | Pickup/Delivery đã khóa nhưng chính sách vận hành chi tiết chưa có | Trước Cart Prototype được duyệt |
| Kênh thông báo order request mới cho Hlime | Supabase lưu đơn nhưng đội ngũ cần cách tiếp nhận/vận hành đáng tin cậy | Trước tích hợp order submission |
| Xử lý trường hợp Hlime không thể xác nhận order và status ngoài hai trạng thái V1 | V1 hiện chỉ khóa `PENDING` và `CONFIRMED` | Trước Testing hoặc để sang phiên bản sau |
| Có form liên hệ riêng ngoài Cart hay chỉ dùng kênh trực tiếp | Nếu có form cần nơi nhận dữ liệu, chống spam và xử lý lỗi | Trước HTML Prototype |
| Địa chỉ, map, phone và opening hours của chi nhánh duy nhất | Là dữ liệu production bắt buộc | Trước content production |
| Danh sách sản phẩm, giá và ảnh thật khi launch | Là nội dung cốt lõi để nghiệm thu catalogue | Trước Testing |
| Giá trị size/flavor, lead time và validation ngày cần bánh của Celebration | Bốn field V1 đã khóa nhưng giá trị/quy tắc thực tế chưa có | Trước Database/Content production |
| Nội dung **Why Hlime** và các claim thương hiệu | Cần bảo đảm đúng với vận hành thực tế | Trước Final content review |
| Hosting provider, domain và có staging riêng hay không | Cố ý hoãn đến khi prototype/frontend ổn định | Sau khi prototype/frontend ổn định, trước Deploy |
| Demo data cụ thể và production data thay thế | Prototype được phép tự tạo demo data; dữ liệu thật cần owner duyệt trước go-live | Trước Final content review |

Nếu owner chọn phương án khác với assumptions, cập nhật section liên quan và acceptance criteria trước khi triển khai.

---

## 16. Glossary ngắn

| Thuật ngữ | Giải thích |
|---|---|
| CTA | Call to Action — nút hoặc liên kết thúc đẩy hành động như Xem menu hoặc Đặt bánh. |
| Frontend | Phần giao diện khách hoặc Admin nhìn thấy và tương tác trong trình duyệt. |
| Database | Nơi lưu dữ liệu có cấu trúc như sản phẩm, category và settings. |
| Storage | Nơi lưu file, chủ yếu là ảnh trong V1. |
| Auth | Cơ chế xác thực người dùng; trong V1 dùng để đăng nhập Admin. |
| RLS | Row Level Security — quy tắc tại database quyết định ai được đọc hoặc sửa từng nhóm dữ liệu. |
| Deploy | Đưa phiên bản code lên môi trường để người dùng truy cập. |
| Redeploy | Deploy lại code sau một thay đổi kỹ thuật. Thay content/ảnh đúng thiết kế V1 không cần bước này. |
| Responsive | Giao diện thích nghi theo kích thước và cách sử dụng trên mobile, tablet, laptop và desktop. |
| Semantic HTML | Cấu trúc nội dung dùng đúng ý nghĩa, hỗ trợ accessibility và SEO. |
| Empty state | Giao diện khi chưa có dữ liệu phù hợp, ví dụ category chưa có sản phẩm. |
| Soft premium | Cảm giác chỉn chu và cao cấp nhẹ nhàng, không phô trương hoặc tạo khoảng cách. |
| Shopping Cart | Giỏ hàng tạm chứa sản phẩm và quantity trước khi khách gửi xác nhận đơn. |
| Order request | Yêu cầu đặt bánh được website tiếp nhận; chưa đồng nghĩa với đã thanh toán hoặc Hlime đã cam kết đáp ứng. |
| Locale | Ngôn ngữ và quy tắc hiển thị nội dung tương ứng, trong V1 là VI hoặc KO. |
| Auto-translate | Hỗ trợ dịch tự động VI → KO; kết quả vẫn cần khả năng review và sửa tay. |
| `PENDING` | Order đã được Supabase tiếp nhận nhưng Hlime chưa xác nhận khả năng đáp ứng. |
| `CONFIRMED` | Hlime đã review và xác nhận order; không đồng nghĩa đã thanh toán online. |
| Pickup | Khách nhận order tại chi nhánh duy nhất của Hlime trong V1. |
| Delivery | Hlime giao order đến thông tin giao hàng khách đã cung cấp, theo chính sách vận hành được duyệt. |
| Demo data | Dữ liệu giả dùng cho prototype/test, phải được đánh dấu và thay bằng production data trước go-live. |

---

## BUILD CHECKLIST

Checklist này theo đúng thứ tự từ Prototype đến Production. Chỉ đánh dấu hoàn thành khi có kết quả có thể review.

### A. Context và Scope

- [x] Owner Review = APPROVED cho Hlime V1 Specification.
- [ ] Định vị, tagline và tính cách thương hiệu được xác nhận.
- [x] VI mặc định, KO route `/ko/...` và fallback VI được khóa.
- [x] V1 chỉ có một chi nhánh được khóa.
- [x] Flow Product → Add to Cart → Cart → Customer Info → Pickup/Delivery → Submit Order → `PENDING` → Hlime xác nhận → `CONFIRMED` được khóa.
- [x] Pickup và Delivery đều thuộc V1.
- [x] Celebration size, flavor, ngày cần bánh và lời nhắn/ghi chú thuộc V1.
- [x] Dashboard Orders list và Pending Orders badge thuộc V1.
- [x] Online payment, customer account, loyalty và inventory phức tạp nằm ngoài V1.
- [x] React + Vite và Supabase được khóa làm stack V1.
- [x] Hosting/domain/staging được hoãn chọn đến khi prototype/frontend ổn định.
- [x] Unique image path và Admin update không redeploy được khóa.
- [x] Quy tắc demo data và ranh giới hard-code được khóa.
- [x] Assumptions và các mục cố ý quyết định sau đã được ghi rõ trong Section 15.
- [ ] Customer information field chi tiết và delivery/pickup policy được owner chốt.
- [ ] Cơ chế thông báo order request cho Hlime được owner chốt.
- [ ] Auto-translate service/technical metadata được chốt.

### B. Structure

- [ ] Sitemap được duyệt.
- [ ] 6 category V1 được duyệt.
- [ ] Navigation labels, VI default route, KO route và fallback VI được duyệt.
- [ ] Product fields VI/KO và translation metadata tối thiểu được duyệt.
- [ ] Quy tắc active, available, featured, best seller và display order được duyệt.
- [ ] Shopping Cart, Customer Info, Pickup/Delivery, Submit Order và status structure được duyệt.
- [ ] Celebration size/flavor/date/message structure được duyệt.
- [ ] Products/Categories/Homepage/Site/Order Settings ownership được duyệt.
- [ ] Data boundary giữa order request V1 và full Order Management V2 được duyệt.
- [ ] Những feature ngoài scope được ghi nhận và không đưa lén vào V1.

### C. Design Direction

- [ ] Primary/secondary color usage được duyệt.
- [ ] Một heading font và một body font được chọn.
- [ ] Image direction và tỷ lệ ảnh được chốt.
- [ ] Button, card, navigation, filter, form và state styles được định nghĩa.
- [ ] Language switcher, Cart badge, quantity control, cart summary và Confirmation states được định nghĩa.
- [ ] Pickup/Delivery controls và `PENDING`/`CONFIRMED` badges được định nghĩa.
- [ ] Spacing, border radius và shadow direction nhất quán.
- [ ] Accessibility contrast được kiểm tra.
- [ ] Desktop và mobile direction cùng được thiết kế.

### D. Storyboard

- [ ] Homepage flow và mục tiêu từng section được duyệt.
- [ ] Menu storyboard được duyệt.
- [ ] Product Detail storyboard được duyệt.
- [ ] Celebration storyboard được duyệt.
- [ ] About storyboard được duyệt.
- [ ] Contact / Order Support storyboard được duyệt.
- [ ] Shopping Cart, Pickup/Delivery và Order Status storyboard được duyệt.
- [ ] Celebration size/flavor/date/message flow được duyệt.
- [ ] Ba purchase flow chính và flow đổi VI/KO được review end-to-end.
- [ ] Loading, error, empty và unavailable states được mô tả.
- [ ] Price/availability changed và order submission failed states được mô tả.

### E. HTML Prototype

- [ ] Prototype Home hoàn thành.
- [ ] Prototype Menu hoàn thành.
- [ ] Prototype Product Detail hoàn thành.
- [ ] Prototype Celebration hoàn thành.
- [ ] Prototype About hoàn thành.
- [ ] Prototype Contact / Order Support hoàn thành.
- [ ] Prototype language switcher, VI default route, KO route và fallback VI hoàn thành.
- [ ] Prototype Shopping Cart, Customer Info, Pickup/Delivery, Submit Order và status hoàn thành.
- [ ] Prototype Celebration size/flavor/date/message hoàn thành.
- [ ] Prototype thể hiện desktop direction.
- [ ] Prototype thể hiện mobile direction.
- [ ] Demo data đủ thực tế để review và được đánh dấu **DEMO — NOT PRODUCTION DATA**.
- [ ] Demo business data được map vào Products, Categories, Homepage Settings, Site Settings hoặc Order Settings.
- [ ] Không bắt đầu Backend/Admin trong giai đoạn này.

### F. Review Prototype — Approval Gate

- [ ] Owner review cấu trúc trang và thứ tự section.
- [ ] Owner review visual direction và hình ảnh.
- [ ] Owner review nội dung, tone và CTA.
- [ ] Owner review mobile flow.
- [ ] Owner review VI/KO flow và hành vi khi thiếu/chỉnh bản dịch.
- [ ] Owner review Add to Cart, Pickup/Delivery, Submit Order và `PENDING`/`CONFIRMED` flow.
- [ ] Các vấn đề lớn được sửa trong prototype.
- [ ] Owner phê duyệt prototype/frontend direction bằng quyết định rõ ràng.
- [ ] Chỉ sau approval này mới chuyển sang Frontend implementation.

### G. Frontend

- [ ] Khởi tạo frontend theo stack đã khóa: React + Vite.
- [ ] Thiết lập design tokens và component patterns nhất quán.
- [ ] Xây Header, Footer và navigation.
- [ ] Xây Home theo storyboard đã duyệt.
- [ ] Xây Menu và category filter.
- [ ] Xây Product Detail.
- [ ] Xây language switcher, VI default route, KO route và fallback VI.
- [ ] Xây Add to Cart, Shopping Cart, quantity, subtotal và cart summary.
- [ ] Xây Customer Info, Pickup/Delivery, summary, Submit Order và status UI.
- [ ] Xây Celebration size/flavor/date/message flow.
- [ ] Xây Celebration.
- [ ] Xây About.
- [ ] Xây Contact / Order Support.
- [ ] Xây 404/not found behavior.
- [ ] Xử lý responsive cho từng trang.
- [ ] Xử lý loading, error, empty và unavailable states.
- [ ] Giữ Cart và dữ liệu trong flow khi điều hướng hoặc đổi ngôn ngữ.
- [ ] Không hard-code nội dung cần Admin quản lý.

### H. Database

- [ ] Data model chỉ gồm nhu cầu V1 đã duyệt.
- [ ] Products schema được tạo và kiểm tra.
- [ ] Categories schema được tạo và kiểm tra.
- [ ] Homepage content/settings schema được tạo và kiểm tra.
- [ ] Site Settings schema được tạo và kiểm tra.
- [ ] Order Settings schema được tạo và kiểm tra.
- [ ] Field VI/KO và translation metadata tối thiểu được tạo và kiểm tra.
- [ ] Orders, line items, fulfillment và `PENDING`/`CONFIRMED` schema được tạo và kiểm tra.
- [ ] Celebration size/flavor/date/message data được tạo và kiểm tra.
- [ ] Customer/order information chỉ gồm field owner đã duyệt.
- [ ] Quan hệ và quy tắc dữ liệu cần thiết được xác định.
- [ ] Seed/test data không làm lẫn production content.
- [ ] Demo data được đánh dấu rõ và đặt trong đúng nhóm Admin-managed data.
- [ ] Field mới ngoài spec có lý do và approval.

### I. Storage

- [ ] Bucket và cấu trúc đường dẫn ảnh được xác định.
- [ ] Quy tắc tên file và định dạng ảnh được xác định.
- [ ] Mỗi ảnh upload/thay mới dùng filename hoặc Storage path unique.
- [ ] Upload và thay ảnh hoạt động.
- [ ] Public read/private write behavior đúng với thiết kế.
- [ ] Ảnh lỗi và ảnh dự phòng được xử lý.
- [ ] Ảnh được tối ưu trước hoặc trong luồng upload/serve phù hợp.

### J. Auth

- [ ] Supabase Auth được cấu hình cho Admin.
- [ ] Luồng đăng nhập hoạt động.
- [ ] Luồng đăng xuất hoạt động.
- [ ] Session hết hạn được xử lý rõ ràng.
- [ ] Route/màn hình Admin được bảo vệ.
- [ ] Quy trình cấp và thu hồi quyền Admin được xác định.
- [ ] Public Cart/order flow hoạt động không cần customer account.

### K. Admin

- [ ] Dashboard có danh sách order và badge Pending Orders.
- [ ] Số Pending Orders trên badge khớp dữ liệu `PENDING`.
- [ ] Danh sách products hoàn thành.
- [ ] Thêm product hoàn thành.
- [ ] Sửa product hoàn thành.
- [ ] Field VI và KO hiển thị/chỉnh sửa song song.
- [ ] Auto-translate VI → KO có preview/review hoàn thành.
- [ ] KO sửa tay được và không bị ghi đè im lặng khi VI đổi.
- [ ] Trạng thái thiếu KO hoặc KO có thể đã cũ được hiển thị rõ.
- [ ] Active và available được phân biệt rõ.
- [ ] Featured, best seller và display order chỉnh được.
- [ ] Celebration size/flavor options chỉnh được.
- [ ] Category management tối thiểu hoàn thành.
- [ ] Homepage content management hoàn thành.
- [ ] Site Settings management hoàn thành.
- [ ] Order Settings management hoàn thành.
- [ ] Site Settings chỉ quản lý một chi nhánh.
- [ ] Admin xem order detail gồm Customer Info, line items, Pickup/Delivery và Celebration selections.
- [ ] Admin chuyển order `PENDING` → `CONFIRMED` được.
- [ ] Validation và feedback save/error hoàn thành.
- [ ] Thay content/ảnh phản ánh lên public website mà không redeploy.
- [ ] Demo business data có thể sửa qua Admin mà không sửa React code.

### L. Security và RLS

- [ ] Không có secret trong frontend hoặc repository.
- [ ] RLS được bật cho các bảng cần bảo vệ.
- [ ] Anonymous read chỉ trả dữ liệu public cần thiết.
- [ ] Anonymous write bị từ chối.
- [ ] Public chỉ có thể submit order request qua luồng được validate và không thể đọc order/customer data.
- [ ] Chỉ Admin chuyển được `PENDING` → `CONFIRMED`.
- [ ] Unauthorized admin access bị từ chối.
- [ ] Authorized admin CRUD hoạt động đúng.
- [ ] Storage upload/update/delete chỉ dành cho quyền phù hợp.
- [ ] Policy được kiểm thử trực tiếp, không chỉ dựa vào việc ẩn UI.
- [ ] Translation service secret và Supabase privileged secret không xuất hiện trong React frontend.
- [ ] Order submission có bảo vệ phù hợp trước duplicate retry và lạm dụng.
- [ ] Log/error không làm lộ dữ liệu nhạy cảm.

### M. Content và Production Data

- [ ] Tất cả demo data được đánh dấu **DEMO — NOT PRODUCTION DATA** trong giai đoạn Prototype/V1.
- [ ] Danh sách sản phẩm launch được owner duyệt.
- [ ] Tên, category, mô tả và giá bằng VI/KO được kiểm tra.
- [ ] Active/available/featured/best seller đúng ý định.
- [ ] Ảnh sản phẩm thật đủ chất lượng và đúng tỷ lệ.
- [ ] Hero image và Homepage content được duyệt.
- [ ] About content và Why Hlime claims được duyệt.
- [ ] Phone, address, email và opening hours chính xác.
- [ ] Address/map/opening hours đúng cho một chi nhánh duy nhất.
- [ ] Social links và order links chính xác.
- [ ] Không còn placeholder hoặc nội dung demo.
- [ ] Products, Categories, Homepage Settings, Site Settings và Order Settings chứa dữ liệu production đã duyệt.

### N. Testing

- [ ] Test Home trên desktop và mobile.
- [ ] Test Menu/filter trên desktop và mobile.
- [ ] Test Product Detail và link trực tiếp.
- [ ] Test Celebration flow đến Cart hoặc Contact tùy loại nhu cầu.
- [ ] Test language switcher trên mọi trang chính.
- [ ] Test VI là mặc định, KO dùng route `/ko/...` và thiếu KO fallback VI.
- [ ] Test đổi VI/KO không làm mất Cart hoặc dữ liệu đang nhập.
- [ ] Test thiếu KO, KO auto-translated, KO sửa tay và VI thay đổi sau khi KO sửa tay.
- [ ] Test add/remove product, quantity, subtotal và cart summary.
- [ ] Test Empty Cart và tiếp tục mua.
- [ ] Test Customer Info và order summary trước Submit Order.
- [ ] Test Pickup tại cửa hàng và Delivery với validation tương ứng.
- [ ] Test Celebration size, flavor, ngày cần bánh và lời nhắn/ghi chú.
- [ ] Test giá/availability thay đổi trước submit.
- [ ] Test submit thành công, submit thất bại, retry và chống order trùng ngoài ý muốn.
- [ ] Test order mới có trạng thái `PENDING`.
- [ ] Test Orders list, Pending Orders badge và chuyển `PENDING` → `CONFIRMED`.
- [ ] Xác nhận flow không có payment và không yêu cầu customer account.
- [ ] Test About và Contact information.
- [ ] Test navigation, back behavior và 404.
- [ ] Test active/inactive và available/unavailable.
- [ ] Test loading, empty, error và retry.
- [ ] Test Admin CRUD và validation.
- [ ] Test Auth/session/logout.
- [ ] Test RLS bằng user anonymous, unauthorized và authorized.
- [ ] Test image upload, replace, missing image và failed load.
- [ ] Test ảnh thay mới dùng unique path và không còn hiển thị ảnh cũ do cache URL.
- [ ] Test content/data/image đổi qua Admin không cần redeploy.
- [ ] Test keyboard navigation và visible focus.
- [ ] Test contrast, alt text, labels và heading hierarchy.
- [ ] Test responsive ở mobile nhỏ, mobile phổ biến, tablet, laptop và desktop rộng.
- [ ] Test trên ít nhất một thiết bị mobile thật nếu có thể.
- [ ] Test performance và xử lý bottleneck lớn.
- [ ] Kiểm tra console và network errors.
- [ ] Cross-browser smoke test trên các browser mục tiêu.

### O. SEO và Launch Readiness

- [ ] Page titles và meta descriptions VI/KO hoàn chỉnh.
- [ ] Heading hierarchy đúng.
- [ ] Social sharing metadata và ảnh chia sẻ đúng.
- [ ] Sitemap và robots behavior đúng.
- [ ] Admin/private routes không bị index.
- [ ] Canonical/URL behavior được kiểm tra nếu áp dụng.
- [ ] Locale URL và alternate-language behavior được kiểm tra.
- [ ] KO fallback VI không tạo trang trống hoặc lỗi metadata nghiêm trọng.
- [ ] Favicon và brand assets chính thức được dùng.
- [ ] Privacy/legal content được bổ sung nếu luồng dữ liệu thực tế yêu cầu.

### P. Deploy

- [ ] Chỉ bắt đầu chọn hosting/domain/staging sau khi prototype/frontend direction ổn định.
- [ ] Hosting provider, domain và quyết định staging được owner xác nhận.
- [ ] Production environment được cấu hình.
- [ ] HTTPS hoạt động.
- [ ] GitHub-to-host deployment flow hoạt động.
- [ ] Production kết nối đúng Supabase project.
- [ ] Environment variables được cấu hình an toàn.
- [ ] Cơ chế cập nhật content/data/image không redeploy được kiểm chứng.
- [ ] Unique image filename/path behavior được kiểm chứng trên môi trường deploy.
- [ ] Cách rollback hoặc quay lại phiên bản ổn định được xác định.
- [ ] Backup/recovery tối thiểu cho dữ liệu quan trọng được xác định.

### Q. Final Review và Production

- [ ] Smoke test sau deploy hoàn tất trên desktop.
- [ ] Smoke test sau deploy hoàn tất trên mobile.
- [ ] Ba purchase flow chính hoàn thành từ Product đến `PENDING`, sau đó Admin xác nhận thành `CONFIRMED`.
- [ ] Website production hoạt động đầy đủ bằng VI và KO.
- [ ] Cart/Pickup/Delivery/Submit Order/status hoạt động trên desktop và mobile, không có online payment.
- [ ] Pickup, Delivery và Celebration fields hoạt động với dữ liệu production.
- [ ] Toàn bộ Acceptance Criteria trong tài liệu này được kiểm tra.
- [ ] Không còn lỗi blocker hoặc lỗi bảo mật chưa xử lý.
- [ ] Các lỗi nhỏ được ghi nhận với owner và không cản trở launch.
- [ ] Owner review website production với dữ liệu thật.
- [ ] Owner chấp thuận go-live.
- [ ] Website Hlime V1 được công bố chính thức.
