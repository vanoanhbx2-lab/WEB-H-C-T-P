/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 3. THEO DÕI TIẾN ĐỘ HỌC TẬP (Learning Progress Tracking)
 * Danh sách học sinh, thanh tiến độ trực quan, màu sắc tích cực khích lệ,
 * lọc theo lớp và tiến độ, xem chi tiết từng học sinh.
 */

import React, { useState } from 'react';
import { Student, UserRole, GradeClass } from '../types';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Plus, 
  Phone, 
  Sparkles,
  Award,
  X,
  User
} from 'lucide-react';

interface ProgressViewProps {
  role: UserRole;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'completionRate'>) => void;
  onUpdateStudent: (student: Student) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  role,
  students,
  onAddStudent,
  onUpdateStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Modal chi tiết học sinh
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Modal thêm học sinh mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState<GradeClass>('10A1');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentNotes, setNewStudentNotes] = useState('');
  const [addError, setAddError] = useState('');

  // Lọc danh sách học sinh
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.gradeClass === selectedClass;

    let matchesTier = true;
    if (selectedTier === 'high') {
      matchesTier = s.completionRate >= 80;
    } else if (selectedTier === 'mid') {
      matchesTier = s.completionRate >= 50 && s.completionRate < 80;
    } else if (selectedTier === 'support') {
      matchesTier = s.completionRate < 50;
    }

    return matchesSearch && matchesClass && matchesTier;
  });

  // Tính các chỉ số
  const avgCompletionRate = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.completionRate, 0) / students.length)
    : 0;

  const handleOpenAdd = () => {
    setNewStudentName('');
    setNewStudentClass('10A1');
    setNewStudentPhone('');
    setNewStudentNotes('');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      setAddError('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    onAddStudent({
      name: newStudentName.trim(),
      gradeClass: newStudentClass,
      completedTasks: 5,
      totalTasks: 7,
      phone: newStudentPhone.trim() || undefined,
      notes: newStudentNotes.trim() || 'Học sinh mới tiếp nhận vào hệ thống.',
      lastActive: 'Vừa mới tạo'
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tiêu đề & Nút Thêm học sinh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>Theo Dõi Tiến Độ Học Tập</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi tiến độ hoàn thành nhiệm vụ với gam màu sư phạm khích lệ tinh thần tự học
          </p>
        </div>

        {role === 'teacher' && (
          <button
            id="btn-add-student"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm học sinh</span>
          </button>
        )}
      </div>

      {/* Thẻ Thống kê Tiến độ Tổng thể */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tỷ lệ hoàn thành trung bình toàn trường</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold">
            {avgCompletionRate}% Mục tiêu học tập đạt được
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Học sinh trường THPT số 2 Bát Xát duy trì tinh thần tự giác cao trong việc nộp bài và trao đổi trực tuyến với giáo viên bộ môn.
          </p>
        </div>

        {/* Khối chỉ số nhanh */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">Xuất sắc (≥80%)</span>
            <strong className="text-xl font-extrabold text-emerald-400">
              {students.filter((s) => s.completionRate >= 80).length}
            </strong>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">Tiến bộ (50-79%)</span>
            <strong className="text-xl font-extrabold text-sky-400">
              {students.filter((s) => s.completionRate >= 50 && s.completionRate < 80).length}
            </strong>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl text-center border border-white/10">
            <span className="text-xs text-slate-300 block mb-1">Cần hỗ trợ</span>
            <strong className="text-xl font-extrabold text-amber-400">
              {students.filter((s) => s.completionRate < 50).length}
            </strong>
          </div>
        </div>
      </div>

      {/* Thanh Công cụ: Tìm kiếm & Bộ lọc */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Tìm kiếm */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-students"
            type="text"
            placeholder="Tìm theo họ tên học sinh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Lọc Lớp */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <select
            id="select-filter-progress-class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tất cả các lớp</option>
            <option value="10A1">Lớp 10A1</option>
            <option value="10A2">Lớp 10A2</option>
            <option value="11A1">Lớp 11A1</option>
            <option value="11A2">Lớp 11A2</option>
            <option value="12A1">Lớp 12A1</option>
          </select>

          {/* Lọc Mức tiến độ */}
          <select
            id="select-filter-tier"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Mọi mức tiến độ</option>
            <option value="high">Hoàn thành tốt (≥ 80%)</option>
            <option value="mid">Đang tiến bộ (50% - 79%)</option>
            <option value="support">Cần thêm hỗ trợ (&lt; 50%)</option>
          </select>
        </div>

      </div>

      {/* Danh sách Thẻ Học sinh & Thanh Tiến độ Trực quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
        {filteredStudents.map((student) => {
          const uncompleted = student.totalTasks - student.completedTasks;
          const isHigh = student.completionRate >= 80;
          const isMid = student.completionRate >= 50 && student.completionRate < 80;

          // Sử dụng bảng màu ấm áp, thân thiện và khích lệ
          const progressColorClass = isHigh
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
            : isMid
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
            : 'bg-gradient-to-r from-amber-400 to-amber-500';

          const badgeClass = isHigh
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : isMid
            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';

          return (
            <div
              key={student.id}
              id={`student-card-${student.id}`}
              onClick={() => setSelectedStudent(student)}
              className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {student.name.split(' ').pop()?.[0] || 'A'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {student.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Lớp {student.gradeClass}
                      </span>
                      {student.lastActive && (
                        <span className="text-[11px] text-slate-400">
                          {student.lastActive}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                    {isHigh ? 'Hoàn thành tốt' : isMid ? 'Đang tiến bộ' : 'Cần hỗ trợ'}
                  </span>
                </div>
              </div>

              {/* Thanh tiến độ trực quan */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Tiến độ hoàn thành bài tập
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {student.completionRate}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
                    style={{ width: `${Math.max(student.completionRate, 5)}%` }}
                  />
                </div>
              </div>

              {/* Số nhiệm vụ đã xong & chưa xong */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Đã xong: <strong>{student.completedTasks}</strong>/{student.totalTasks}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Còn lại: <strong>{uncompleted}</strong> bài</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CHI TIẾT HỌC SINH */}
      {selectedStudent && (
        <div
          id="modal-student-detail-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            id="modal-student-detail-content"
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedStudent.name.split(' ').pop()?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Lớp {selectedStudent.gradeClass} • {selectedStudent.lastActive}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tiến độ chi tiết */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>Tỷ lệ hoàn thành nhiệm vụ</span>
                <span className="text-emerald-600 font-extrabold">{selectedStudent.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${selectedStudent.completionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Đã nộp: {selectedStudent.completedTasks} nhiệm vụ</span>
                <span>Chưa nộp: {selectedStudent.totalTasks - selectedStudent.completedTasks} nhiệm vụ</span>
              </div>
            </div>

            {/* Nhận xét giáo viên */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Ghi chú / Nhận xét của giáo viên:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 leading-relaxed">
                {selectedStudent.notes || 'Học sinh có ý thức học tập tốt, chấp hành đúng nội quy lớp học.'}
              </p>
            </div>

            {selectedStudent.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Số liên hệ phụ huynh / học sinh: <strong>{selectedStudent.phone}</strong></span>
              </div>
            )}

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}

      {/* MODAL THÊM HỌC SINH MỚI */}
      {isAddModalOpen && (
        <div
          id="modal-add-student-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            id="modal-add-student-content"
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Thêm Học Sinh Mới</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Vàng A Sáng, Lý Mẩy Mẩy..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Lớp học <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value as GradeClass)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="10A1">Lớp 10A1</option>
                  <option value="10A2">Lớp 10A2</option>
                  <option value="11A1">Lớp 11A1</option>
                  <option value="11A2">Lớp 11A2</option>
                  <option value="12A1">Lớp 12A1</option>
                  <option value="12A2">Lớp 12A2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Số điện thoại liên lạc
                </label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0988.xxx.xxx"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Ghi chú ban đầu
                </label>
                <textarea
                  rows={2}
                  placeholder="Điểm mạnh, lưu ý học tập..."
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Thêm học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
