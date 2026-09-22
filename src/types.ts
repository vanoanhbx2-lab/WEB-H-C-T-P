/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QUẢN TRỊ HỌC TẬP THPT – TRƯỜNG THPT SỐ 2 BÁT XÁT
 * Các định nghĩa kiểu dữ liệu TypeScript cho hệ thống
 */

export type UserRole = 'teacher' | 'student';

export type MainTab = 'dashboard' | 'tasks' | 'progress' | 'grades' | 'announcements';

export type Subject = 
  | 'Toán học'
  | 'Ngữ văn'
  | 'Tiếng Anh'
  | 'Vật lí'
  | 'Hóa học'
  | 'Sinh học'
  | 'Lịch sử'
  | 'Địa lí'
  | 'Tin học'
  | 'GDKT & PL'
  | 'Công nghệ';

export type GradeClass = '10A1' | '10A2' | '11A1' | '11A2' | '12A1' | '12A2';

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  gradeClass: GradeClass | 'Toàn khối 10' | 'Toàn khối 11' | 'Toàn khối 12' | 'Tất cả các lớp';
  dueDate: string;
  status: 'active' | 'expiring' | 'completed';
  assignedDate: string;
  maxPoints: number;
  totalStudents: number;
  submittedCount: number;
  // Trạng thái đối với học sinh hiện tại đang xem
  isSubmittedByCurrentStudent?: boolean;
}

export interface Student {
  id: string;
  name: string;
  gradeClass: GradeClass;
  completedTasks: number;
  totalTasks: number;
  completionRate: number; // 0 - 100
  phone?: string;
  notes?: string;
  lastActive?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeClass: GradeClass;
  taskTitle: string;
  subject: Subject;
  score: number; // 0 - 10
  maxScore: number;
  date: string;
  feedback: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  target: 'Toàn trường' | 'Khối 10' | 'Khối 11' | 'Khối 12' | 'Lớp 10A1' | 'Lớp 11A1' | 'Lớp 12A1';
  priority: 'normal' | 'important' | 'urgent';
  category: 'Học tập' | 'Lịch thi' | 'Ngoại khóa' | 'Khẩn cấp';
  author: string;
  isRead: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
