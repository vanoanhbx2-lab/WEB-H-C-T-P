/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================
 * BỘ DỮ LIỆU MẪU HỆ THỐNG QUẢN TRỊ HỌC TẬP THPT - TRƯỜNG THPT SỐ 2 BÁT XÁT
 * Người quản trị: cô Vân Oanh
 * Đơn vị: Trường THPT số 2 Bát Xát, tỉnh Lào Cai
 * 
 * GIÁO VIÊN CÓ THỂ CHỈNH SỬA CÁC THÔNG TIN DƯỚI ĐÂY KHI CẦN THAY THẾ DỮ LIỆU THẬT:
 * 1. Tên trường và giáo viên quản trị (SYSTEM_CONFIG)
 * 2. Danh sách học sinh mẫu (INITIAL_STUDENTS)
 * 3. Danh sách nhiệm vụ và bài tập mẫu (INITIAL_TASKS)
 * 4. Dữ liệu điểm số và nhận xét mẫu (INITIAL_GRADES)
 * 5. Các thông báo của nhà trường (INITIAL_ANNOUNCEMENTS)
 * =========================================================================
 */

import { Student, Task, GradeRecord, Announcement } from '../types';

/** THÔNG TIN CHUNG HỆ THỐNG - Dễ dàng chỉnh sửa */
export const SYSTEM_CONFIG = {
  schoolName: 'Trường THPT số 2 Bát Xát',
  appName: 'QUẢN TRỊ HỌC TẬP THPT',
  teacherName: 'cô Vân Oanh',
  teacherRole: 'Giáo viên phụ trách quản trị học tập',
  teacherEmail: 'vanoanhbx2@gmail.com',
  currentStudentDefault: {
    id: 'hs-101',
    name: 'Nguyễn Văn An',
    gradeClass: '10A1' as const,
  }
};

/** DANH SÁCH 10 HỌC SINH MẪU (Bát Xát, Lào Cai) */
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'hs-101',
    name: 'Nguyễn Văn An',
    gradeClass: '10A1',
    completedTasks: 6,
    totalTasks: 7,
    completionRate: 86,
    phone: '0982.112.331',
    notes: 'Chăm chỉ, tích cực tham gia thảo luận nhóm Tin học và Toán.',
    lastActive: 'Hôm nay, 08:30'
  },
  {
    id: 'hs-102',
    name: 'Lò Thị Mai',
    gradeClass: '10A1',
    completedTasks: 7,
    totalTasks: 7,
    completionRate: 100,
    phone: '0973.445.662',
    notes: 'Hoàn thành xuất sắc mọi nhiệm vụ đúng hạn, bài làm chỉn chu.',
    lastActive: 'Hôm nay, 09:15'
  },
  {
    id: 'hs-103',
    name: 'Vàng A Tủa',
    gradeClass: '10A1',
    completedTasks: 5,
    totalTasks: 7,
    completionRate: 71,
    phone: '0912.883.994',
    notes: 'Có tiến bộ rõ rệt trong bài tập môn Vật lí, cần thêm thời gian môn Ngữ văn.',
    lastActive: 'Hôm qua, 16:45'
  },
  {
    id: 'hs-104',
    name: 'Trần Thị Lan',
    gradeClass: '10A2',
    completedTasks: 6,
    totalTasks: 7,
    completionRate: 86,
    phone: '0966.331.229',
    notes: 'Kỹ năng làm bài tự luận tốt, nộp bài đúng hạn.',
    lastActive: 'Hôm nay, 07:50'
  },
  {
    id: 'hs-105',
    name: 'Sùng Thị Dở',
    gradeClass: '10A2',
    completedTasks: 4,
    totalTasks: 7,
    completionRate: 57,
    phone: '0981.224.558',
    notes: 'Cần giáo viên hỗ trợ thêm phần thực hành bài tập Tin học ứng dụng.',
    lastActive: '2 ngày trước'
  },
  {
    id: 'hs-106',
    name: 'Đặng Hải Đăng',
    gradeClass: '11A1',
    completedTasks: 6,
    totalTasks: 6,
    completionRate: 100,
    phone: '0944.556.778',
    notes: 'Khả năng tư duy logic xuất sắc, đạt điểm tối đa bài kiểm tra Hóa học.',
    lastActive: 'Hôm nay, 10:00'
  },
  {
    id: 'hs-107',
    name: 'Lý Mẩy Phẩy',
    gradeClass: '11A1',
    completedTasks: 5,
    totalTasks: 6,
    completionRate: 83,
    phone: '0978.990.112',
    notes: 'Nhiệt tình trong hoạt động học tập nhóm, trình bày bài sạch đẹp.',
    lastActive: 'Hôm qua, 14:20'
  },
  {
    id: 'hs-108',
    name: 'Hoàng Trung Dũng',
    gradeClass: '11A2',
    completedTasks: 4,
    totalTasks: 6,
    completionRate: 67,
    phone: '0933.447.881',
    notes: 'Đang bổ sung nốt bài tập môn Tiếng Anh và Lịch sử địa phương.',
    lastActive: '3 ngày trước'
  },
  {
    id: 'hs-109',
    name: 'Đỗ Thu Hằng',
    gradeClass: '12A1',
    completedTasks: 6,
    totalTasks: 6,
    completionRate: 100,
    phone: '0988.667.119',
    notes: 'Ôn tập kiến thức tốt, chủ động hỏi bài giáo viên các câu hỏi phân hóa.',
    lastActive: 'Hôm nay, 08:05'
  },
  {
    id: 'hs-110',
    name: 'Trịnh Minh Đức',
    gradeClass: '12A1',
    completedTasks: 5,
    totalTasks: 6,
    completionRate: 83,
    phone: '0915.228.443',
    notes: 'Tiến độ ôn tập tốt, sẵn sàng cho các kỳ thi thử THPT Quốc gia.',
    lastActive: 'Hôm qua, 18:00'
  }
];

/** DANH SÁCH 7 NHIỆM VỤ / BÀI TẬP MẪU */
export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-01',
    title: 'Thực hành tạo biểu bảng và xử lý dữ liệu với phần mềm bảng tính',
    description: 'Học sinh thực hiện thu thập dữ liệu nhiệt độ, thời tiết Bát Xát trong 1 tuần, tạo bảng tính và vẽ biểu đồ so sánh.',
    subject: 'Tin học',
    gradeClass: '10A1',
    dueDate: '2026-09-28',
    status: 'active',
    assignedDate: '2026-09-20',
    maxPoints: 10,
    totalStudents: 35,
    submittedCount: 28,
    isSubmittedByCurrentStudent: true,
  },
  {
    id: 'task-02',
    title: 'Phân tích vẻ đẹp thiên nhiên Tây Bắc qua đoạn trích văn học',
    description: 'Viết bài thu hoạch ngắn (khoảng 400 - 500 chữ) cảm nhận về hình tượng con người và thiên nhiên miền núi Tây Bắc.',
    subject: 'Ngữ văn',
    gradeClass: '10A1',
    dueDate: '2026-09-30',
    status: 'active',
    assignedDate: '2026-09-21',
    maxPoints: 10,
    totalStudents: 35,
    submittedCount: 24,
    isSubmittedByCurrentStudent: false,
  },
  {
    id: 'task-03',
    title: 'Giải hệ phương trình bậc nhất ba ẩn và ứng dụng thực tiễn',
    description: 'Hoàn thành 5 bài toán thực tế về cân bằng phản ứng hóa học và bài toán phân phối kinh tế bằng hệ phương trình.',
    subject: 'Toán học',
    gradeClass: '10A2',
    dueDate: '2026-09-26',
    status: 'expiring',
    assignedDate: '2026-09-18',
    maxPoints: 10,
    totalStudents: 34,
    submittedCount: 30,
    isSubmittedByCurrentStudent: true,
  },
  {
    id: 'task-04',
    title: 'Thuyết trình ngắn bằng Tiếng Anh: Our Hometown Bat Xat',
    description: 'Ghi âm hoặc quay video 2-3 phút giới thiệu danh lam thắng cảnh Y Tý, ruộng bậc thang Bát Xát và ẩm thực đặc sắc.',
    subject: 'Tiếng Anh',
    gradeClass: 'Toàn khối 10',
    dueDate: '2026-10-05',
    status: 'active',
    assignedDate: '2026-09-19',
    maxPoints: 10,
    totalStudents: 120,
    submittedCount: 88,
    isSubmittedByCurrentStudent: false,
  },
  {
    id: 'task-05',
    title: 'Khảo sát chuyển động rơi tự do và gia tốc trọng trường',
    description: 'Báo cáo kết quả thí nghiệm đo gia tốc rơi tự do tại phòng thực hành Vật lí trường THPT số 2 Bát Xát.',
    subject: 'Vật lí',
    gradeClass: '10A1',
    dueDate: '2026-09-22',
    status: 'completed',
    assignedDate: '2026-09-15',
    maxPoints: 10,
    totalStudents: 35,
    submittedCount: 35,
    isSubmittedByCurrentStudent: true,
  },
  {
    id: 'task-06',
    title: 'Chuyên đề cân bằng hóa học và hằng số cân bằng Kc',
    description: 'Tính toán nồng độ các chất ở trạng thái cân bằng và dự đoán chiều dịch chuyển theo nguyên lý Le Chatelier.',
    subject: 'Hóa học',
    gradeClass: '11A1',
    dueDate: '2026-09-29',
    status: 'active',
    assignedDate: '2026-09-20',
    maxPoints: 10,
    totalStudents: 36,
    submittedCount: 31,
    isSubmittedByCurrentStudent: true,
  },
  {
    id: 'task-07',
    title: 'Tìm hiểu lịch sử và văn hóa các dân tộc anh em vùng Bát Xát',
    description: 'Sưu tầm tư liệu, tranh ảnh về trang phục truyền thống của đồng bào Hà Nhì, Dao đỏ và Giáy tại huyện Bát Xát.',
    subject: 'Lịch sử',
    gradeClass: 'Toàn khối 10',
    dueDate: '2026-10-10',
    status: 'active',
    assignedDate: '2026-09-22',
    maxPoints: 10,
    totalStudents: 120,
    submittedCount: 45,
    isSubmittedByCurrentStudent: false,
  }
];

/** DANH SÁCH KẾT QUẢ ĐIỂM SỐ MẪU */
export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'gr-01',
    studentId: 'hs-101',
    studentName: 'Nguyễn Văn An',
    gradeClass: '10A1',
    taskTitle: 'Thực hành tạo biểu bảng và xử lý dữ liệu với phần mềm bảng tính',
    subject: 'Tin học',
    score: 9.0,
    maxScore: 10,
    date: '2026-09-21',
    feedback: 'Bảng tính định dạng rất chuẩn, công thức dùng chính xác và biểu đồ đẹp mắt.'
  },
  {
    id: 'gr-02',
    studentId: 'hs-101',
    studentName: 'Nguyễn Văn An',
    gradeClass: '10A1',
    taskTitle: 'Khảo sát chuyển động rơi tự do và gia tốc trọng trường',
    subject: 'Vật lí',
    score: 8.5,
    maxScore: 10,
    date: '2026-09-22',
    feedback: 'Số liệu thực nghiệm chính xác, tính sai số cẩn thận, giải thích hiện tượng tốt.'
  },
  {
    id: 'gr-03',
    studentId: 'hs-102',
    studentName: 'Lò Thị Mai',
    gradeClass: '10A1',
    taskTitle: 'Thực hành tạo biểu bảng và xử lý dữ liệu với phần mềm bảng tính',
    subject: 'Tin học',
    score: 10.0,
    maxScore: 10,
    date: '2026-09-21',
    feedback: 'Bài làm xuất sắc, có sáng tạo trong cách phối màu biểu đồ và chú thích đầy đủ.'
  },
  {
    id: 'gr-04',
    studentId: 'hs-102',
    studentName: 'Lò Thị Mai',
    gradeClass: '10A1',
    taskTitle: 'Khảo sát chuyển động rơi tự do và gia tốc trọng trường',
    subject: 'Vật lí',
    score: 9.5,
    maxScore: 10,
    date: '2026-09-22',
    feedback: 'Báo cáo khoa học rõ ràng, bài viết mẫu mực để lớp tham khảo.'
  },
  {
    id: 'gr-05',
    studentId: 'hs-103',
    studentName: 'Vàng A Tủa',
    gradeClass: '10A1',
    taskTitle: 'Khảo sát chuyển động rơi tự do và gia tốc trọng trường',
    subject: 'Vật lí',
    score: 8.0,
    maxScore: 10,
    date: '2026-09-22',
    feedback: 'Thao tác thí nghiệm tốt, đã biết vận dụng công thức tính gia tốc rơi tự do.'
  },
  {
    id: 'gr-06',
    studentId: 'hs-104',
    studentName: 'Trần Thị Lan',
    gradeClass: '10A2',
    taskTitle: 'Giải hệ phương trình bậc nhất ba ẩn và ứng dụng thực tiễn',
    subject: 'Toán học',
    score: 9.0,
    maxScore: 10,
    date: '2026-09-20',
    feedback: 'Các bước biến đổi giải hệ chuẩn xác, lập luận chặt chẽ.'
  },
  {
    id: 'gr-07',
    studentId: 'hs-105',
    studentName: 'Sùng Thị Dở',
    gradeClass: '10A2',
    taskTitle: 'Giải hệ phương trình bậc nhất ba ẩn và ứng dụng thực tiễn',
    subject: 'Toán học',
    score: 7.5,
    maxScore: 10,
    date: '2026-09-20',
    feedback: 'Nắm được phương pháp giải, cần cẩn thận hơn ở bước tính nhẩm dấu âm dương.'
  },
  {
    id: 'gr-08',
    studentId: 'hs-106',
    studentName: 'Đặng Hải Đăng',
    gradeClass: '11A1',
    taskTitle: 'Chuyên đề cân bằng hóa học và hằng số cân bằng Kc',
    subject: 'Hóa học',
    score: 9.8,
    maxScore: 10,
    date: '2026-09-21',
    feedback: 'Tư duy xuất sắc, giải quyết bài toán cân bằng phức tạp rất nhanh.'
  },
  {
    id: 'gr-09',
    studentId: 'hs-107',
    studentName: 'Lý Mẩy Phẩy',
    gradeClass: '11A1',
    taskTitle: 'Chuyên đề cân bằng hóa học và hằng số cân bằng Kc',
    subject: 'Hóa học',
    score: 8.5,
    maxScore: 10,
    date: '2026-09-21',
    feedback: 'Trình bày rõ ràng, hiểu đúng nguyên lý chuyển dịch cân bằng Le Chatelier.'
  },
  {
    id: 'gr-10',
    studentId: 'hs-109',
    studentName: 'Đỗ Thu Hằng',
    gradeClass: '12A1',
    taskTitle: 'Đề ôn tập tổng hợp kiến thức THPT giai đoạn 1',
    subject: 'Toán học',
    score: 9.2,
    maxScore: 10,
    date: '2026-09-20',
    feedback: 'Tốc độ làm bài tốt, nắm chắc các dạng câu hỏi mức độ vận dụng cao.'
  }
];

/** DANH SÁCH 4 THÔNG BÁO MẪU */
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Kế hoạch kiểm tra giữa học kỳ I năm học 2026 - 2027',
    content: 'Ban Giám hiệu Trường THPT số 2 Bát Xát thông báo lịch kiểm tra tập trung giữa kỳ từ ngày 15/10 đến 18/10. Yêu cầu các thầy cô bộ môn hoàn thành ôn tập và học sinh các khối lớp chủ động hệ thống hóa kiến thức.',
    date: '2026-09-21',
    target: 'Toàn trường',
    priority: 'urgent',
    category: 'Lịch thi',
    author: 'cô Vân Oanh',
    isRead: false
  },
  {
    id: 'ann-02',
    title: 'Phát động tuần lễ Chuyển đổi số và ứng dụng CNTT trong học tập',
    content: 'Nhà trường phát động cuộc thi thiết kế sản phẩm số, thuyết trình điện tử dành cho học sinh THPT. Các lớp đăng ký danh sách và sản phẩm dự thi trước ngày 05/10 tại phòng Tin học.',
    date: '2026-09-19',
    target: 'Toàn trường',
    priority: 'important',
    category: 'Học tập',
    author: 'cô Vân Oanh',
    isRead: true
  },
  {
    id: 'ann-03',
    title: 'Nhắc nhở hạn hoàn thành bài tập dự án Tin học Lớp 10A1',
    content: 'Các bạn học sinh lớp 10A1 lưu ý hạn nộp bài thực hành bảng tính là trước 23:59 ngày 28/09. Học sinh có thể nộp trực tiếp trên hệ thống hoặc gửi file qua phòng máy.',
    date: '2026-09-22',
    target: 'Lớp 10A1',
    priority: 'important',
    category: 'Học tập',
    author: 'cô Vân Oanh',
    isRead: false
  },
  {
    id: 'ann-04',
    title: 'Lịch sinh hoạt Câu lạc bộ Học tập & Ngoại khóa cuối tuần',
    content: 'CLB Tiếng Anh và CLB STEM Bát Xát sẽ tổ chức buổi giao lưu chuyên đề "Khám phá di sản Bát Xát" vào sáng Thứ Bảy lúc 8h00 tại Hội trường tầng 2.',
    date: '2026-09-18',
    target: 'Khối 10',
    priority: 'normal',
    category: 'Ngoại khóa',
    author: 'Đoàn trường THPT số 2 Bát Xát',
    isRead: true
  }
];
