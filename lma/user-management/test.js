import http from 'k6/http';
import { sleep } from 'k6';

// Hàm tự động sinh địa chỉ IP ngẫu nhiên
function randomIP() {
  return `${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}

// Cấu hình tăng tải dần (Ramp-up)
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Tăng dần từ 0 lên 20 user trong 30s
    { duration: '1m', target: 20 },  // Duy trì 20 user ổn định trong 1 phút
    { duration: '10s', target: 0 },  // Giảm dần về 0 user trong 10s
  ],
};

export default function () {
  // Tạo 1 IP duy nhất cho request này
  const fakeIP = randomIP();

  // Cấu hình Header chứa IP giả lập cho mỗi Request
  const params = {
    headers: {
      'X-Forwarded-For': fakeIP,
      'X-Real-IP': fakeIP,
    },
  };

  // Gửi request đến server local kèm theo header fake IP
  // Lưu ý: Nếu bạn test API, hãy đổi URL thành http://localhost/api
  http.get('http://localhost', params);

  sleep(1); // Nghỉ 1 giây trước khi gửi request tiếp theo
}

