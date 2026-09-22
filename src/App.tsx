/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QUẢN TRỊ HỌC TẬP THPT – TRƯỜNG THPT SỐ 2 BÁT XÁT
 * Người xây dựng & quản trị nội dung: cô Vân Oanh
 * Đơn vị: Trường THPT số 2 Bát Xát, tỉnh Lào Cai
 * 
 * Ứng dụng quản trị học tập dành cho giáo viên và học sinh THPT.
 * Hoạt động độc lập, không yêu cầu server hay tài khoản, lưu trữ cục bộ qua localStorage.
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  MainTab, 
  Student, 
  Task, 
  GradeRecord, 
  Announcement, 
  ToastMessage 
} from './types';
import { 
  SYSTEM_CONFIG, 
  INITIAL_STUDENTS, 
  INITIAL_TASKS, 
  INITIAL_GRADES, 
  INITIAL_ANNOUNCEMENTS 
} from './data/initialData';
import { 
  playSuccessSound, 
  playClickSound, 
  playDeleteSound, 
  toggleBackgroundMusic 
} from './utils/audio';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { ProgressView } from './components/ProgressView';
import { GradesView } from './components/GradesView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ToastContainer } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { GraduationCap, Sparkles, Heart } from 'lucide-react';

const STORAGE_KEYS = {
  ROLE: 'qtht_role_v1',
  THEME: 'qtht_theme_v1',
  SOUND: 'qtht_sound_v1',
  STUDENTS: 'qtht_students_v1',
  TASKS: 'qtht_tasks_v1',
  GRADES: 'qtht_grades_v1',
  ANNOUNCEMENTS: 'qtht_announcements_v1',
};

export default function App() {
  // Vai trò người dùng (Giáo viên / Học sinh)
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved === 'student' || saved === 'teacher') ? saved : 'teacher';
  });

  // Tab chức năng hiện tại
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');

  // Cài đặt âm thanh & giao diện Sáng / Tối
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'dark';
  });

  // Dữ liệu quản trị (Lưu trữ cục bộ vào localStorage)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
      return saved ? JSON.parse(saved) : INITIAL_GRADES;
    } catch {
      return INITIAL_GRADES;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: Announcement) => ({
            ...item,
            author: typeof item.author === 'string'
              ? item.author.replace(/Cô Đinh Thị Vân Oanh|Đinh Thị Vân Oanh/g, 'cô Vân Oanh')
              : item.author
          }));
        }
      }
      return INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Trạng thái modal tạo nhiệm vụ dùng chung (kích hoạt từ Dashboard hoặc Tasks)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Hệ thống thông báo Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hộp thoại xác nhận (Xóa hoặc Đặt lại dữ liệu)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDanger?: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
  });

  // Áp dụng chế độ Sáng / Tối vào thẻ <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  // Lưu trữ các thay đổi dữ liệu vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      localStorage.setItem(STORAGE_KEYS.SOUND, String(isSoundEnabled));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch {
      // Bỏ qua lỗi hạn ngạch localStorage nếu có
    }
  }, [role, isSoundEnabled, students, tasks, grades, announcements]);

  // Hàm hiển thị Toast thông báo
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Tự động đóng sau 3.5 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Điều khiển âm thanh
  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    if (next) {
      playSuccessSound(true);
      addToast('info', 'Đã bật hiệu ứng âm thanh tương tác.');
    } else {
      addToast('info', 'Đã tắt hiệu ứng âm thanh.');
    }
  };

  const handleToggleMusic = () => {
    const next = !isMusicPlaying;
    const ok = toggleBackgroundMusic(next);
    if (ok) {
      setIsMusicPlaying(true);
      addToast('success', 'Đang phát nhạc nền nhẹ nhàng thư giãn học tập.');
    } else {
      setIsMusicPlaying(false);
      addToast('info', 'Đã tạm dừng nhạc nền.');
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    playClickSound(isSoundEnabled);
    if (newRole === 'teacher') {
      addToast('info', `Đã chuyển sang chế độ Giáo viên (${SYSTEM_CONFIG.teacherName}).`);
    } else {
      addToast('info', `Đã chuyển sang chế độ Học sinh (${SYSTEM_CONFIG.currentStudentDefault.name} - 10A1).`);
    }
  };

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    playClickSound(isSoundEnabled);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý Nhiệm Vụ
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'assignedDate' | 'submittedCount'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      submittedCount: 0,
      isSubmittedByCurrentStudent: false,
    };
    setTasks([newTask, ...tasks]);
    playSuccessSound(isSoundEnabled);
    addToast('success', `Đã giao nhiệm vụ: "${newTask.title}" thành công!`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    playSuccessSound(isSoundEnabled);
    addToast('success', 'Đã cập nhật thông tin nhiệm vụ thành công!');
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa nhiệm vụ?',
      message: `Bạn có chắc chắn muốn xóa bài tập "${taskToDelete?.title || 'này'}" không? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xác nhận xóa',
      isDanger: true,
      action: () => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        playDeleteSound(isSoundEnabled);
        addToast('info', 'Đã xóa nhiệm vụ khỏi danh sách.');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Học sinh nộp bài hoặc hủy nộp
  const handleToggleStudentSubmit = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isSubmitted = !t.isSubmittedByCurrentStudent;
          return {
            ...t,
            isSubmittedByCurrentStudent: isSubmitted,
            submittedCount: isSubmitted ? t.submittedCount + 1 : Math.max(0, t.submittedCount - 1),
          };
        }
        return t;
      })
    );

    const task = tasks.find((t) => t.id === taskId);
    if (!task?.isSubmittedByCurrentStudent) {
      playSuccessSound(isSoundEnabled);
      addToast('success', `Em đã nộp bài tập "${task?.title}" thành công!`);
    } else {
      playClickSound(isSoundEnabled);
      addToast('info', `Đã thu hồi trạng thái nộp bài "${task?.title}".`);
    }
  };

  // Xử lý Học Sinh
  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'completionRate'>) => {
    const compRate = Math.round((newStudentData.completedTasks / newStudentData.totalTasks) * 100);
    const newStudent: Student = {
      ...newStudentData,
      id: `hs-${Date.now()}`,
      completionRate: compRate,
    };
    setStudents([...students, newStudent]);
    playSuccessSound(isSoundEnabled);
    addToast('success', `Đã thêm học sinh ${newStudent.name} vào Lớp ${newStudent.gradeClass}!`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    playSuccessSound(isSoundEnabled);
    addToast('success', `Đã cập nhật thông tin học sinh ${updatedStudent.name}!`);
  };

  // Xử lý Điểm Số
  const handleAddGrade = (newGradeData: Omit<GradeRecord, 'id' | 'date'>) => {
    const newGrade: GradeRecord = {
      ...newGradeData,
      id: `gr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setGrades([newGrade, ...grades]);
    playSuccessSound(isSoundEnabled);
    addToast('success', `Đã nhập kết quả điểm ${newGrade.score}đ cho học sinh ${newGrade.studentName}!`);
  };

  const handleUpdateGrade = (updatedGrade: GradeRecord) => {
    setGrades(grades.map((g) => (g.id === updatedGrade.id ? updatedGrade : g)));
    playSuccessSound(isSoundEnabled);
    addToast('success', `Đã cập nhật kết quả điểm cho học sinh ${updatedGrade.studentName}!`);
  };

  const handleDeleteGrade = (gradeId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa bản ghi kết quả điểm?',
      message: 'Bạn có chắc chắn muốn xóa bản ghi điểm này không?',
      confirmText: 'Xóa kết quả',
      isDanger: true,
      action: () => {
        setGrades((prev) => prev.filter((g) => g.id !== gradeId));
        playDeleteSound(isSoundEnabled);
        addToast('info', 'Đã xóa bản ghi kết quả điểm.');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Xử lý Thông Báo
  const handleAddAnnouncement = (newAnnData: Omit<Announcement, 'id' | 'isRead'>) => {
    const newAnn: Announcement = {
      ...newAnnData,
      id: `ann-${Date.now()}`,
      isRead: false,
    };
    setAnnouncements([newAnn, ...announcements]);
    playSuccessSound(isSoundEnabled);
    addToast('success', `Đã đăng thông báo: "${newAnn.title}"!`);
  };

  const handleToggleRead = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === announcementId ? { ...a, isRead: !a.isRead } : a))
    );
    playClickSound(isSoundEnabled);
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa thông báo nhà trường?',
      message: 'Bạn có chắc chắn muốn xóa thông báo này khỏi bảng tin?',
      confirmText: 'Xóa thông báo',
      isDanger: true,
      action: () => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
        playDeleteSound(isSoundEnabled);
        addToast('info', 'Đã xóa thông báo.');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Khôi phục dữ liệu mẫu ban đầu
  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Khôi phục dữ liệu mẫu ban đầu?',
      message: 'Hệ thống sẽ tải lại danh sách học sinh, bài tập, điểm số và thông báo chuẩn của Trường THPT số 2 Bát Xát. Các dữ liệu bạn vừa nhập sẽ được đặt lại.',
      confirmText: 'Khôi phục dữ liệu mẫu',
      isDanger: false,
      action: () => {
        setStudents(INITIAL_STUDENTS);
        setTasks(INITIAL_TASKS);
        setGrades(INITIAL_GRADES);
        setAnnouncements(INITIAL_ANNOUNCEMENTS);
        playSuccessSound(isSoundEnabled);
        addToast('success', 'Đã khôi phục thành công bộ dữ liệu mẫu THPT số 2 Bát Xát!');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const unreadAnnouncementsCount = announcements.filter((a) => !a.isRead).length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'active' || t.status === 'expiring').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header chính */}
      <Header
        role={role}
        onRoleChange={handleRoleChange}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onResetData={handleResetData}
      />

      {/* Menu điều hướng 5 chức năng */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingTasksCount={pendingTasksCount}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Khu vực nội dung chính */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            role={role}
            students={students}
            tasks={tasks}
            announcements={announcements}
            onNavigate={handleTabChange}
            onOpenTaskModal={() => {
              setActiveTab('tasks');
              setIsTaskModalOpen(true);
            }}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            role={role}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleStudentSubmit={handleToggleStudentSubmit}
            isTaskModalOpen={isTaskModalOpen}
            onCloseTaskModal={() => setIsTaskModalOpen(false)}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            role={role}
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {activeTab === 'grades' && (
          <GradesView
            role={role}
            grades={grades}
            onAddGrade={handleAddGrade}
            onUpdateGrade={handleUpdateGrade}
            onDeleteGrade={handleDeleteGrade}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsView
            role={role}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onToggleRead={handleToggleRead}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}
      </main>

      {/* Footer chân trang */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block sm:inline">
                {SYSTEM_CONFIG.schoolName}
              </strong>
              <span className="hidden sm:inline"> • </span>
              <span>{SYSTEM_CONFIG.appName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Người xây dựng & Quản trị: <strong className="text-slate-700 dark:text-slate-300">{SYSTEM_CONFIG.teacherName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Dành cho giáo viên & học sinh THPT</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>Năm học 2026 – 2027</span>
          </div>
        </div>
      </footer>

      {/* Thông báo Toast dạng nổi */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Hộp thoại xác nhận */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
