/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 4. ĐIỂM SỐ & KẾT QUẢ (Grades & Results)
 * Khu vực nhập và xem kết quả học tập, điểm trung bình, nhận xét khích lệ,
 * bảng dữ liệu to rõ phù hợp trình chiếu trên màn hình lớn / máy chiếu.
 */

import React, { useState } from 'react';
import { GradeRecord, UserRole, Subject, GradeClass } from '../types';
import { 
  Award, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Info, 
  Maximize2, 
  Minimize2, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface GradesViewProps {
  role: UserRole;
  grades: GradeRecord[];
  onAddGrade: (grade: Omit<GradeRecord, 'id' | 'date'>) => void;
  onUpdateGrade: (grade: GradeRecord) => void;
  onDeleteGrade: (gradeId: string) => void;
}

const SUBJECT_LIST: Subject[] = [
  'Tin học',
  'Toán học',
  'Ngữ văn',
  'Tiếng Anh',
  'Vật lí',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lí',
  'GDKT & PL',
  'Công nghệ',
];

export const GradesView: React.FC<GradesViewProps> = ({
  role,
  grades,
  onAddGrade,
  onUpdateGrade,
  onDeleteGrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isLargeFont, setIsLargeFont] = useState(false);

  // Modal thêm / sửa điểm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeRecord | null>(null);

  const [formStudentName, setFormStudentName] = useState('');
  const [formClass, setFormClass] = useState<GradeClass>('10A1');
  const [formTaskTitle, setFormTaskTitle] = useState('');
  const [formSubject, setFormSubject] = useState<Subject>('Tin học');
  const [formScore, setFormScore] = useState(9.0);
  const [formFeedback, setFormFeedback] = useState('');
  const [formError, setFormError] = useState('');

  // Lọc điểm
  const filteredGrades = grades.filter((g) => {
    const matchesSearch =
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.feedback.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || g.gradeClass === selectedClass;
    const matchesSubject = selectedSubject === 'all' || g.subject === selectedSubject;

    return matchesSearch && matchesClass && matchesSubject;
  });

  // Tính thống kê điểm
  const averageScore = filteredGrades.length > 0
    ? (filteredGrades.reduce((acc, g) => acc + g.score, 0) / filteredGrades.length).toFixed(1)
    : '0.0';

  const maxScore = filteredGrades.length > 0
    ? Math.max(...filteredGrades.map((g) => g.score)).toFixed(1)
    : '0.0';

  const minScore = filteredGrades.length > 0
    ? Math.min(...filteredGrades.map((g) => g.score)).toFixed(1)
    : '0.0';

  const excellentCount = filteredGrades.filter((g) => g.score >= 9.0).length;
  const goodCount = filteredGrades.filter((g) => g.score >= 7.0 && g.score < 9.0).length;

  const handleOpenCreate = () => {
    setEditingGrade(null);
    setFormStudentName('');
    setFormClass('10A1');
    setFormTaskTitle('Thực hành tạo biểu bảng và xử lý dữ liệu với phần mềm bảng tính');
    setFormSubject('Tin học');
    setFormScore(9.0);
    setFormFeedback('Bài làm rất tốt, lập luận chặt chẽ và nộp bài đúng hạn.');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (grade: GradeRecord) => {
    setEditingGrade(grade);
    setFormStudentName(grade.studentName);
    setFormClass(grade.gradeClass);
    setFormTaskTitle(grade.taskTitle);
    setFormSubject(grade.subject);
    setFormScore(grade.score);
    setFormFeedback(grade.feedback);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentName.trim()) {
      setFormError('Vui lòng nhập họ và tên học sinh!');
      return;
    }
    if (!formTaskTitle.trim()) {
      setFormError('Vui lòng nhập tên bài / nhiệm vụ kiểm tra!');
      return;
    }

    if (editingGrade) {
      onUpdateGrade({
        ...editingGrade,
        studentName: formStudentName.trim(),
        gradeClass: formClass,
        taskTitle: formTaskTitle.trim(),
        subject: formSubject,
        score: Number(formScore),
        feedback: formFeedback.trim() || 'Đã hoàn thành bài tập.',
      });
    } else {
      onAddGrade({
        studentId: `hs-${Date.now().toString().slice(-4)}`,
        studentName: formStudentName.trim(),
        gradeClass: formClass,
        taskTitle: formTaskTitle.trim(),
        subject: formSubject,
        score: Number(formScore),
        maxScore: 10,
        feedback: formFeedback.trim() || 'Đã hoàn thành bài tập.',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tiêu đề & Nút Thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Điểm Số & Kết Quả Học Tập</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bảng kết quả học tập chi tiết, nhận xét khích lệ từng bài làm của học sinh
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Chuyển cỡ chữ to cho máy chiếu */}
          <button
            id="btn-toggle-large-font"
            onClick={() => setIsLargeFont(!isLargeFont)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all"
            title="Bật chế độ chữ to, rõ nét khi trình chiếu trên máy chiếu lớp học"
          >
            {isLargeFont ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isLargeFont ? 'Chữ vừa' : 'Chế độ máy chiếu'}</span>
          </button>

          {role === 'teacher' && (
            <button
              id="btn-add-grade"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nhập điểm mới</span>
            </button>
          )}
        </div>
      </div>

      {/* CẢNH BÁO SƯ PHẠM QUAN TRỌNG THEO YÊU CẦU */}
      <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed shadow-xs">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Lưu ý sư phạm quan trọng:</strong> Hệ thống lưu trữ điểm số theo từng bài tập nhằm theo dõi tiến trình và khích lệ sự cố gắng của học sinh. 
          Theo quy định giáo dục THPT, <em>không tự động đưa ra kết luận xếp loại học lực</em> nếu chưa có đầy đủ dữ liệu điểm đánh giá thường xuyên và định kỳ cả học kỳ.
        </div>
      </div>

      {/* Thẻ Thống kê Điểm số */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Điểm trung bình
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{averageScore}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Từ {filteredGrades.length} kết quả lọc</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Điểm cao nhất
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{maxScore}</span>
            <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md font-bold">Xuất sắc</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{excellentCount} bài đạt điểm ≥ 9.0</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Điểm đạt & khá
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{goodCount}</span>
            <span className="text-xs text-slate-400">bài làm</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Điểm từ 7.0 đến 8.9</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Điểm thấp nhất
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{minScore}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Có nhận xét động viên bổ sung</p>
        </div>
      </div>

      {/* Thanh Bộ Lọc & Tìm Kiếm */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-grades"
            type="text"
            placeholder="Tìm theo tên học sinh, bài làm hoặc nhận xét..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả các lớp</option>
            <option value="10A1">Lớp 10A1</option>
            <option value="10A2">Lớp 10A2</option>
            <option value="11A1">Lớp 11A1</option>
            <option value="11A2">Lớp 11A2</option>
            <option value="12A1">Lớp 12A1</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả môn học</option>
            {SUBJECT_LIST.map((subj) => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
        </div>
      </div>

      {/* BẢNG KẾT QUẢ DỄ ĐỌC (Tối ưu cho cả máy chiếu & thiết bị di động) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-left ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Họ và tên học sinh</th>
                <th className="px-4 py-4">Lớp</th>
                <th className="px-5 py-4">Bài / Nhiệm vụ kiểm tra</th>
                <th className="px-4 py-4">Môn học</th>
                <th className="px-4 py-4 text-center">Điểm số</th>
                <th className="px-5 py-4">Nhận xét của giáo viên</th>
                {role === 'teacher' && <th className="px-5 py-4 text-right">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGrades.map((grade) => {
                const isHigh = grade.score >= 9.0;
                const isGood = grade.score >= 7.0 && grade.score < 9.0;

                return (
                  <tr
                    key={grade.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {grade.studentName}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {grade.gradeClass}
                    </td>
                    <td className="px-5 py-4 text-slate-800 dark:text-slate-200 max-w-xs">
                      {grade.taskTitle}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {grade.subject}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl font-extrabold ${
                          isHigh
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isGood
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {grade.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                      {grade.feedback}
                    </td>
                    {role === 'teacher' && (
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(grade)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Sửa điểm & nhận xét"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteGrade(grade.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Xóa bản ghi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / SỬA ĐIỂM SỐ */}
      {isModalOpen && (
        <div
          id="modal-grade-form-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="modal-grade-form-content"
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{editingGrade ? 'Chỉnh Sửa Điểm & Nhận Xét' : 'Nhập Điểm Số Mới'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Họ tên học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={formStudentName}
                    onChange={(e) => setFormStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Lớp <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value as GradeClass)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="10A1">Lớp 10A1</option>
                    <option value="10A2">Lớp 10A2</option>
                    <option value="11A1">Lớp 11A1</option>
                    <option value="11A2">Lớp 11A2</option>
                    <option value="12A1">Lớp 12A1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tên bài / Nhiệm vụ kiểm tra <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Báo cáo thực hành Tin học Bát Xát..."
                  value={formTaskTitle}
                  onChange={(e) => setFormTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Môn học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as Subject)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {SUBJECT_LIST.map((subj) => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Điểm số (0 - 10) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formScore}
                    onChange={(e) => setFormScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nhận xét & Lời khuyên của giáo viên
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi nhận xét tích cực, động viên hoặc hướng dẫn sửa bài..."
                  value={formFeedback}
                  onChange={(e) => setFormFeedback(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  {editingGrade ? 'Lưu cập nhật' : 'Thêm kết quả'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
