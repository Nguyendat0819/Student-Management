package com.example.student_grade.Controller;

import java.util.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController // Đánh dấu Class này là một "Trạm phát API". Mọi hàm trong đây mặc định sẽ trả
                // về dữ liệu kiểu JSON cho React.
@RequestMapping("/api/messages") // Tạo một "đường dẫn gốc". Từ giờ các hàm bên dưới không cần viết lại khúc này
                                 // nữa.
public class MessageController {

    // Đây là "Database thu nhỏ" chạy bằng RAM. Ta dùng một cái mảng (List) để có
    // thể lưu được nhiều tin nhắn.
    private List<String> currentMessage = new ArrayList<>();

    // 1. CHỨC NĂNG ĐỌC (READ): Ứng với lệnh axios.get() bên React.
    // Hàm này sẽ tự động chạy khi có ai đó truy cập đường dẫn GET /api/messages.
    @GetMapping
    public Map<String, Object> getMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        int totalItems = currentMessage.size();
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalItems);

        List<String> paginatedList;
        if (startIndex >= totalItems) {
            paginatedList = new ArrayList<>();
        } else {
            paginatedList = currentMessage.subList(startIndex, endIndex);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", paginatedList);
        response.put("totalPages", (int) Math.ceil((double) totalItems / size));
        response.put("currentPages", page);

        return response;
    }

    // 2. CHỨC NĂNG THÊM MỚI (CREATE): Ứng với lệnh axios.post() bên React.
    // @PostMapping: Chuyên dùng để tạo mới dữ liệu.
    @PostMapping
    public String createMessage(@RequestBody Map<String, String> dataNhanTuReact) {
        // @RequestBody: Yêu cầu Spring Boot moi cục JSON mà React gởi lén trong phần
        // Body ra.
        String newMessage = dataNhanTuReact.get("home"); // Lấy cái nội dung tương ứng với chữ "home" bên React.

        this.currentMessage.add(newMessage); // Bơm nội dung đó vào cuối mảng.

        // Trả lại nguyên cái mảng (đã có thêm phần tử mới) cho React.
        return newMessage;
    }

    // 3. CHỨC NĂNG CẬP NHẬT (UPDATE): Ứng với lệnh axios.put() bên React.
    // Cập nhật thì phải biết là cập nhật dòng nào, nên React bắt buộc phải gởi kèm
    // cái {id} lên URL.
    @PutMapping("/{id}")
    public String updateMessage(@PathVariable int id,
            @RequestBody Map<String, String> dataNhanTuReact) {
        // @PathVariable: Bắt lấy cái con số {id} trên đường dẫn (Ví dụ /api/messages/2
        // thì bóp ra lấy số 2).
        String updatedMessage = dataNhanTuReact.get("home");

        // Kiểm tra xem số id đó có hợp lệ không (có bị âm hay vượt quá chiều dài mảng
        // không).
        if (id >= 0 && id < currentMessage.size()) {
            this.currentMessage.set(id, updatedMessage); // Cập nhật lại phần tử ở vị trí số id đó thành chữ mới.
        }

        return updatedMessage;
    }

    // 4. CHỨC NĂNG XÓA (DELETE): Ứng với lệnh axios.delete() bên React.
    // Tương tự Cập nhật, Xóa cũng cần truyền con số {id} lên URL để biết đường mà
    // xóa.
    @DeleteMapping("/{id}")
    public Integer deleteMessage(@PathVariable int id) {
        // Kiểm tra tính hợp lệ giống như ở hàm PUT.
        if (id >= 0 && id < currentMessage.size()) {
            this.currentMessage.remove(id); // Xóa sổ phần tử ở vị trí số id ra khỏi mảng.
            System.out.println("Đã xóa thành công tin nhắn thứ: " + id);
        }
        return id;
    }
}
//