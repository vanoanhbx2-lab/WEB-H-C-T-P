/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Header chính của ứng dụng
 * Hiển thị tên trường, tên giáo viên quản trị, chuyển đổi vai trò (GV / HS),
 * điều khiển âm thanh, nhạc nền, giao diện Sáng/Tối.
 */

import React from 'react';
import { UserRole } from '../types';
import { SYSTEM_CONFIG } from '../data/initialData';
import { 
  GraduationCap, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  Music, 
  Moon, 
  Sun, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  isSoundEnabled,
  onToggleSound,
  isMusicPlaying,
  onToggleMusic,
  isDarkMode,
  onToggleDarkMode,
  onResetData,
}) => {
  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          
          {/* Logo & Tên Hệ thống */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                  {SYSTEM_CONFIG.schoolName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Quản trị: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{SYSTEM_CONFIG.teacherName}</strong>
                </span>
              </div>
              
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                {SYSTEM_CONFIG.appName}
              </h1>
            </div>
          </div>

          {/* Công cụ điều khiển: Vai trò, Âm thanh, Chế độ xem */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Chuyển đổi Vai trò: Giáo viên / Học sinh */}
            <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl flex items-center border border-slate-200/80 dark:border-slate-700">
              <button
                id="btn-role-teacher"
                onClick={() => onRoleChange('teacher')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  role === 'teacher'
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Chuyển sang góc nhìn Giáo viên"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Giáo viên</span>
              </button>

              <button
                id="btn-role-student"
                onClick={() => onRoleChange('student')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  role === 'student'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Chuyển sang góc nhìn Học sinh"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </button>
            </div>

            {/* Bật/Tắt Nhạc Nền */}
            <button
              id="btn-toggle-music"
              onClick={onToggleMusic}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isMusicPlaying
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
              title={isMusicPlaying ? 'Tắt nhạc nền thư giãn' : 'Bật nhạc nền êm dịu học tập'}
            >
              <Music className={`w-4 h-4 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
              <span className="hidden md:inline">{isMusicPlaying ? 'Nhạc: Bật' : 'Nhạc'}</span>
            </button>

            {/* Bật/Tắt Âm thanh tương tác */}
            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isSoundEnabled
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
              title={isSoundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
              aria-label="Điều khiển âm thanh"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Sáng / Tối */}
            <button
              id="btn-toggle-theme"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all"
              title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              aria-label="Chuyển chế độ sáng tối"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Khôi phục dữ liệu mẫu */}
            <button
              id="btn-reset-data"
              onClick={onResetData}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all hidden sm:flex items-center gap-1 text-xs"
              title="Khôi phục lại dữ liệu mẫu ban đầu của trường"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Dữ liệu mẫu</span>
            </button>

          </div>
        </div>

        {/* Thông tin giáo viên trên màn hình điện thoại */}
        <div className="sm:hidden pb-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Người quản trị: <strong>{SYSTEM_CONFIG.teacherName}</strong></span>
          <span>Đang xem: <strong className={role === 'teacher' ? 'text-blue-600' : 'text-emerald-600'}>{role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</strong></span>
        </div>
      </div>
    </header>
  );
};
