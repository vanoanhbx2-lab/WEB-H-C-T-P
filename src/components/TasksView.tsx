/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 2. QUẢN LÝ NHIỆM VỤ / BÀI TẬP (Tasks Management)
 * Tạo, xem chi tiết, sửa, xóa nhiệm vụ; chế độ xem Thẻ / Bảng; học sinh nộp bài.
 */

import React, { useState } from 'react';
import { Task, UserRole, Subject, GradeClass } from '../types';
import { 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Eye, 
  Send, 
  Filter, 
  Grid, 
  Table as TableIcon,
  X,
  BookOpen
} from 'lucide-react';

interface TasksViewProps {
  role: UserRole;
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'assignedDate' | 'submittedCount'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStudentSubmit: (taskId: string) => void;
  isTaskModalOpen: boolean;
  onCloseTaskModal: () => void;
  onOpenTaskModal: () => void;
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

const CLASS_OPTIONS = [
  '10A1',
  '10A2',
  '11A1',
  '11A2',
  '12A1',
  'Toàn khối 10',
  'Toàn khối 11',
  'Toàn khối 12',
  'Tất cả các lớp',
];

export const TasksView: React.FC<TasksViewProps> = ({
  role,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleStudentSubmit,
  isTaskModalOpen,
  onCloseTaskModal,
  onOpenTaskModal,
}) => {
  // Bộ lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Trạng thái modal xem chi tiết & chỉnh sửa
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // State form tạo / chỉnh sửa nhiệm vụ
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubject, setFormSubject] = useState<Subject>('Tin học');
  const [formClass, setFormClass] = useState<string>('10A1');
  const [formDueDate, setFormDueDate] = useState('2026-10-01');
  const [formStatus, setFormStatus] = useState<'active' | 'expiring' | 'completed'>('active');
  const [formPoints, setFormPoints] = useState(10);
  const [formTotalStudents, setFormTotalStudents] = useState(35);
  const [formError, setFormError] = useState('');

  // Lọc dữ liệu
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || task.subject === selectedSubject;
    const matchesClass = selectedClass === 'all' || task.gradeClass === selectedClass;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesClass && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormDescription('');
    setFormSubject('Tin học');
    setFormClass('10A1');
    setFormDueDate('2026-10-05');
    setFormStatus('active');
    setFormPoints(10);
    setFormTotalStudents(35);
    setFormError('');
    onOpenTaskModal();
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormSubject(task.subject);
    setFormClass(task.gradeClass);
    setFormDueDate(task.dueDate);
    setFormStatus(task.status);
    setFormPoints(task.maxPoints);
    setFormTotalStudents(task.totalStudents);
    setFormError('');
    onOpenTaskModal();
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Vui lòng nhập tên nhiệm vụ / bài tập!');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Vui lòng nhập nội dung mô tả chi tiết yêu cầu bài tập!');
      return;
    }

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formTitle.trim(),
        description: formDescription.trim(),
        subject: formSubject,
        gradeClass: formClass as GradeClass,
        dueDate: formDueDate,
        status: formStatus,
        maxPoints: Number(formPoints),
        totalStudents: Number(formTotalStudents),
      });
    } else {
      onAddTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        subject: formSubject,
        gradeClass: formClass as GradeClass,
        dueDate: formDueDate,
        status: formStatus,
        maxPoints: Number(formPoints),
        totalStudents: Number(formTotalStudents),
      });
    }

    onCloseTaskModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tiêu đề mục & Nút Giao nhiệm vụ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Quản Lý Nhiệm Vụ & Bài Tập</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {role === 'teacher'
              ? 'Theo dõi, giao bài tập, cập nhật tiến độ nộp và chấm bài cho học sinh'
              : 'Danh sách bài tập và nhiệm vụ học tập thầy cô giao cho em'}
          </p>
        </div>

        {role === 'teacher' && (
          <button
            id="btn-add-task-header"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tạo nhiệm vụ mới</span>
          </button>
        )}
      </div>

      {/* Thanh Công cụ: Tìm kiếm, Bộ lọc & Đổi chế độ xem */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-tasks"
              type="text"
              placeholder="Tìm kiếm theo tên nhiệm vụ, môn học, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
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

          {/* Lọc Môn học */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              id="select-filter-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả môn học</option>
              {SUBJECT_LIST.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>

            {/* Lọc Lớp */}
            <select
              id="select-filter-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả lớp / khối</option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Chế độ xem Lưới / Bảng */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200/80 dark:border-slate-700 shrink-0">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Chế độ xem Thẻ (Grid)"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Chế độ xem Bảng (Table)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Thẻ đếm trạng thái nhanh */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedStatus === 'all'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedStatus('active')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedStatus === 'active'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Đang giao ({tasks.filter((t) => t.status === 'active').length})
          </button>
          <button
            onClick={() => setSelectedStatus('expiring')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedStatus === 'expiring'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Sắp hết hạn ({tasks.filter((t) => t.status === 'expiring').length})
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedStatus === 'completed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Đã kết thúc ({tasks.filter((t) => t.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Hiển thị danh sách kết quả */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Không tìm thấy nhiệm vụ nào phù hợp
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Vui lòng thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc phía trên để xem các bài tập khác.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* CHẾ ĐỘ XEM THẺ (GRID) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isExpiring = task.status === 'expiring';
            const submissionPercent = Math.round((task.submittedCount / task.totalStudents) * 100);

            return (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between p-5 space-y-4"
              >
                {/* Header Thẻ */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                        {task.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.gradeClass}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                          : isExpiring
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã đóng</span>
                        </>
                      ) : isExpiring ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Sắp hết hạn</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Đang mở</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Phần Thông số & Hạn hoàn thành */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Hạn: <strong>{task.dueDate}</strong></span>
                    </span>
                    <span>Thang điểm: <strong>{task.maxPoints}đ</strong></span>
                  </div>

                  {/* Thanh tiến độ nộp bài của cả lớp */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Đã nộp bài: <strong>{task.submittedCount}/{task.totalStudents}</strong></span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{submissionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${submissionPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Nút thao tác theo vai trò */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      id={`btn-view-task-${task.id}`}
                      onClick={() => setDetailTask(task)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>

                    {role === 'student' ? (
                      <button
                        id={`btn-submit-task-${task.id}`}
                        onClick={() => onToggleStudentSubmit(task.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                          task.isSubmittedByCurrentStudent
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {task.isSubmittedByCurrentStudent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Đã nộp bài</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Nộp bài ngay</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          id={`btn-edit-task-${task.id}`}
                          onClick={() => handleOpenEdit(task)}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title="Chỉnh sửa nhiệm vụ"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-task-${task.id}`}
                          onClick={() => onDeleteTask(task.id)}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Xóa nhiệm vụ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* CHẾ ĐỘ XEM BẢNG (TABLE) */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Tên nhiệm vụ / Môn học</th>
                  <th className="px-4 py-4">Lớp áp dụng</th>
                  <th className="px-4 py-4">Hạn hoàn thành</th>
                  <th className="px-4 py-4">Tiến độ nộp</th>
                  <th className="px-4 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  const isExpiring = task.status === 'expiring';
                  const submissionPercent = Math.round((task.submittedCount / task.totalStudents) * 100);

                  return (
                    <tr 
                      key={task.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {task.title}
                          </span>
                          <span className="inline-block text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                            {task.subject}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {task.gradeClass}
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {task.dueDate}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 w-32">
                          <div className="flex justify-between text-xs">
                            <span>{task.submittedCount}/{task.totalStudents}</span>
                            <span className="font-bold text-blue-600">{submissionPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${submissionPercent}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            isCompleted
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                              : isExpiring
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          }`}
                        >
                          {isCompleted ? 'Đã đóng' : isExpiring ? 'Sắp hết hạn' : 'Đang giao'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailTask(task)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {role === 'teacher' ? (
                            <>
                              <button
                                onClick={() => handleOpenEdit(task)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                title="Sửa"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onToggleStudentSubmit(task.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                task.isSubmittedByCurrentStudent
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {task.isSubmittedByCurrentStudent ? 'Đã nộp' : 'Nộp bài'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL TẠO / SỬA NHIỆM VỤ DÀNH CHO GIÁO VIÊN */}
      {isTaskModalOpen && (
        <div
          id="modal-task-form-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={onCloseTaskModal}
        >
          <div
            id="modal-task-form-content"
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {editingTask ? 'Chỉnh Sửa Nhiệm Vụ Học Tập' : 'Tạo Nhiệm Vụ / Bài Tập Mới'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Điền đầy đủ thông tin để học sinh các lớp tại Bát Xát nhận bài và nộp đúng hạn
                </p>
              </div>
              <button
                onClick={onCloseTaskModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Tên nhiệm vụ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tên nhiệm vụ / Bài tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Báo cáo thực hành Tin học ứng dụng hoặc Bài tập giải tích..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Môn học & Lớp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Môn học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as Subject)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {SUBJECT_LIST.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Lớp áp dụng <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hạn nộp, Trạng thái, Thang điểm */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Hạn nộp bài <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Trạng thái
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'expiring' | 'completed')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="active">Đang giao (Mở)</option>
                    <option value="expiring">Sắp hết hạn</option>
                    <option value="completed">Đã kết thúc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Thang điểm tối đa
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formPoints}
                    onChange={(e) => setFormPoints(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Mô tả & Hướng dẫn học sinh làm bài <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ghi rõ yêu cầu cần đạt, định dạng file nộp hoặc các bước thực hiện..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Nút thao tác */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onCloseTaskModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  {editingTask ? 'Lưu thay đổi' : 'Tạo nhiệm vụ ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT NHIỆM VỤ */}
      {detailTask && (
        <div
          id="modal-task-detail-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setDetailTask(null)}
        >
          <div
            id="modal-task-detail-content"
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                    {detailTask.subject}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {detailTask.gradeClass}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {detailTask.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailTask(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Yêu cầu & Nội dung chi tiết:
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {detailTask.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block mb-0.5">Hạn nộp</span>
                <strong className="text-slate-900 dark:text-white text-sm">{detailTask.dueDate}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block mb-0.5">Tiến độ nộp bài</span>
                <strong className="text-blue-600 text-sm">{detailTask.submittedCount}/{detailTask.totalStudents} học sinh</strong>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {role === 'student' && (
                <button
                  onClick={() => {
                    onToggleStudentSubmit(detailTask.id);
                    setDetailTask(null);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${
                    detailTask.isSubmittedByCurrentStudent
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {detailTask.isSubmittedByCurrentStudent ? 'Đã nộp bài (Bấm để hủy)' : 'Nộp bài ngay'}
                </button>
              )}

              <button
                onClick={() => setDetailTask(null)}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
