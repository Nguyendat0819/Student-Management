package com.example.student_grade.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Báo cho Spring Boot biết đây là file chứa các cài đặt (cấu hình) hệ thống. Nó
               // sẽ được load lên bộ nhớ đầu tiên.
public class WebConfig implements WebMvcConfigurer {

    @Override // Ghi đè phương thức có sẵn của WebMvcConfigurer để tự mình tùy chỉnh luật CORS
              // (Cross-Origin).
    public void addCorsMappings(CorsRegistry registry) {

        // CORS là cơ chế bảo mật của trình duyệt, tự động chặn các web khác port (VD:
        // React chạy 3000, Java chạy 8080) nói chuyện với nhau.
        // Đoạn code dưới đây sẽ cấp "giấy thông hành" cho phép ReactJS (port 3000) được
        // phép truy cập lấy dữ liệu của Backend.

        registry.addMapping("/**") // 1. Áp dụng luật thông hành này cho TẤT CẢ các API (/** nghĩa là tất cả mọi
                                   // đường dẫn).
                .allowedOrigins("http://localhost:3000") // 2. Chỉ cho phép đúng 1 địa chỉ React này được gọi API. (Giúp
                                                         // chống lại các trang web lạ đánh cắp dữ liệu).
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 3. Cấp quyền cho React dùng 4 hành động
                                                                           // chuẩn RESTful.
                // (OPTIONS là phương thức ngầm trình duyệt dùng để gõ cửa hỏi thăm trước khi
                // gọi hàm chính).
                .allowedHeaders("*") // 4. Cho phép React gửi kèm bất kỳ thông tin nào trong Headers (Thường dùng để
                                     // gửi kèm Token đăng nhập).
                .allowCredentials(true) // 5. Cho phép React gửi các dữ liệu nhạy cảm qua lại (như Cookie, Session).
                .maxAge(3600); // 6. Trình duyệt sẽ ghi nhớ "giấy thông hành" này trong 3600 giây (1 tiếng) để
                               // những lần gọi API sau chạy nhanh hơn, không tốn thời gian check lại CORS nữa.
    }
}
