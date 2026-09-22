/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 1. TRANG TỔNG QUAN (Dashboard Overview)
 * Thống kê trực quan, biểu đồ tình hình học tập, lời chào giáo viên / học sinh.
 */

import React from 'react';
import { UserRole, Student, Task, Announcement, MainTab } from '../types';
import { SYSTEM_CONFIG } from '../data/initialData';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Calendar, 
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface DashboardViewProps {
  role: UserRole;
  students: Student[];
  tasks: Task[];
  announcements: Announcement[];
  onNavigate: (tab: MainTab) => void;
  onOpenTaskModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  role,
  students,
  tasks,
  announcements,
  onNavigate,
  onOpenTaskModal,
}) => {
  // Tính toán các chỉ số thống kê thực tế từ dữ liệu
  const totalStudents = students.length;
  const activeTasks = tasks.filter((t) => t.status === 'active' || t.status === 'expiring').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.completionRate, 0) / students.length)
    : 0;

  // Thống kê theo lớp
  const classProgressData = [
    { className: '10A1', students: students.filter((s) => s.gradeClass === '10A1') },
    { className: '10A2', students: students.filter((s) => s.gradeClass === '10A2') },
    { className: '11A1', students: students.filter((s) => s.gradeClass === '11A1') },
    { className: '11A2', students: students.filter((s) => s.gradeClass === '11A2') },
    { className: '12A1', students: students.filter((s) => s.gradeClass === '12A1') },
  ].map((c) => {
    const avg = c.students.length > 0
      ? Math.round(c.students.reduce((sum, s) => sum + s.completionRate, 0) / c.students.length)
      : 0;
    return {
      className: c.className,
      count: c.students.length,
      averageRate: avg,
    };
  });

  // 3 nhiệm vụ gần nhất
  const upcomingTasks = [...tasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // 2 thông báo mới nhất
  const recentAnnouncements = [...announcements].slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Lời chào mừng & Giới thiệu vai trò */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
        {/* Họa tiết trang trí chìm tinh tế */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none transform translate-x-12" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Năm học 2026 – 2027 • {SYSTEM_CONFIG.schoolName}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {role === 'teacher'
                ? `Kính chào ${SYSTEM_CONFIG.teacherName.toLowerCase().startsWith('cô') ? (SYSTEM_CONFIG.teacherName.charAt(0).toUpperCase() + SYSTEM_CONFIG.teacherName.slice(1)) : `Cô ${SYSTEM_CONFIG.teacherName}`}!`
                : `Xin chào Em ${SYSTEM_CONFIG.currentStudentDefault.name} (Lớp ${SYSTEM_CONFIG.currentStudentDefault.gradeClass})!`}
            </h2>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              {role === 'teacher'
                ? 'Hệ thống quản trị học tập đang ghi nhận tiến độ tích cực từ các khối lớp. Cô có thể kiểm tra bài nộp, giao nhiệm vụ mới hoặc xuất bảng điểm bên dưới.'
                : 'Em đang xem góc nhìn của học sinh. Hãy theo dõi các bài tập sắp đến hạn, tiến độ hoàn thành bài học và các thông báo mới từ thầy cô nhé.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {role === 'teacher' ? (
              <button
                id="dashboard-btn-create-task"
                onClick={onOpenTaskModal}
                className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>+ Giao nhiệm vụ mới</span>
              </button>
            ) : (
              <button
                id="dashboard-btn-view-tasks"
                onClick={() => onNavigate('tasks')}
                className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Xem bài tập cần làm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              id="dashboard-btn-view-progress"
              onClick={() => onNavigate('progress')}
              className="px-5 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Xem tiến độ học tập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Thẻ Thống kê Trực quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Thẻ 1: Số học sinh */}
        <div 
          id="stat-card-students"
          onClick={() => onNavigate('progress')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tổng số học sinh
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              4 khối lớp mẫu
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Bao gồm 10A1, 10A2, 11A1, 12A1</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
          </p>
        </div>

        {/* Thẻ 2: Nhiệm vụ đang giao */}
        <div 
          id="stat-card-active-tasks"
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Nhiệm vụ đang giao
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeTasks}
            </span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
              Đang mở nhận bài
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Theo dõi hạn nộp của học sinh</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
          </p>
        </div>

        {/* Thẻ 3: Nhiệm vụ đã hoàn thành */}
        <div 
          id="stat-card-completed-tasks"
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Nhiệm vụ hoàn thành
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedTasks}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
              Đã thu & chấm điểm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>100% học sinh đã hoàn tất nộp</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
          </p>
        </div>

        {/* Thẻ 4: Tiến độ trung bình */}
        <div 
          id="stat-card-average-progress"
          onClick={() => onNavigate('progress')}
          className="cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tiến độ trung bình
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {averageProgress}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Tích cực & đều tay
            </span>
          </div>
          {/* Thanh tiến độ trực quan */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Biểu đồ Đơn giản & Trực quan theo dõi tình hình học tập */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ Cột Tiến độ theo Từng Lớp */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Tiến độ hoàn thành nhiệm vụ theo Lớp</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tỷ lệ nộp bài trung bình của học sinh các khối lớp tại THPT số 2 Bát Xát
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              Cập nhật trực tiếp
            </span>
          </div>

          {/* Dãy thanh tiến độ so sánh rõ ràng, chữ to, dễ quan sát trên máy chiếu */}
          <div className="space-y-4 pt-2">
            {classProgressData.map((item) => (
              <div key={item.className} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Lớp {item.className} ({item.count} học sinh mẫu)
                  </span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-400">
                    {item.averageRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden flex items-center p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.averageRate >= 80 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                        : item.averageRate >= 60 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-400'
                    }`}
                    style={{ width: `${Math.max(item.averageRate, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                ≥ 80%: Hoàn thành tốt
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                60 - 79%: Đang tiến bộ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                &lt; 60%: Cần khích lệ
              </span>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Xem chi tiết học sinh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tóm tắt Phân bổ Môn học & Hoạt động */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Phân bổ Môn học đang giao</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Các bài tập trải đều các môn tự nhiên, xã hội và Tin học
            </p>

            <div className="space-y-3">
              {[
                { subject: 'Tin học & CNTT', count: 1, percent: 14, color: 'bg-sky-500' },
                { subject: 'Toán học', count: 1, percent: 14, color: 'bg-indigo-500' },
                { subject: 'Ngữ văn & Lịch sử', count: 2, percent: 29, color: 'bg-emerald-500' },
                { subject: 'Vật lí & Hóa học', count: 2, percent: 29, color: 'bg-violet-500' },
                { subject: 'Tiếng Anh', count: 1, percent: 14, color: 'bg-amber-500' },
              ].map((m) => (
                <div key={m.subject} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${m.color} shrink-0`} />
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{m.subject}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-200">{m.count} bài ({m.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
            <strong>Mẹo sư phạm:</strong> Giao bài tập dạng dự án thực tế tại địa phương Bát Xát giúp học sinh tăng 35% mức độ hứng thú học tập!
          </div>
        </div>

      </div>

      {/* 2 Khối Lưới Bên Dưới: Nhiệm vụ cần nộp gần nhất & Thông báo mới */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Nhiệm vụ cần nộp gần nhất */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Nhiệm vụ cần lưu ý</span>
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả ({tasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onNavigate('tasks')}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                      {task.subject}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {task.gradeClass}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {task.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Đã nộp: {task.submittedCount}/{task.totalStudents}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông báo mới nhất */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Bảng tin thông báo mới</span>
            </h3>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả ({announcements.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => onNavigate('announcements')}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                  }`}>
                    {ann.category} • {ann.target}
                  </span>
                  <span className="text-[11px] text-slate-400">{ann.date}</span>
                </div>

                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {ann.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
