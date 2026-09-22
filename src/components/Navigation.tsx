/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Thanh menu điều hướng chính với 5 chức năng trọng tâm
 */

import React from 'react';
import { MainTab } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  TrendingUp, 
  Award, 
  Bell 
} from 'lucide-react';

interface NavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  pendingTasksCount: number;
  unreadAnnouncementsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingTasksCount,
  unreadAnnouncementsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as MainTab,
      label: 'Tổng Quan',
      fullLabel: '1. Trang Tổng Quan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks' as MainTab,
      label: 'Nhiệm Vụ',
      fullLabel: '2. Nhiệm Vụ & Bài Tập',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'progress' as MainTab,
      label: 'Tiến Độ',
      fullLabel: '3. Theo Dõi Tiến Độ',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'grades' as MainTab,
      label: 'Điểm Số',
      fullLabel: '4. Điểm Số & Kết Quả',
      icon: Award,
      badge: null,
    },
    {
      id: 'announcements' as MainTab,
      label: 'Thông Báo',
      fullLabel: '5. Bảng Thông Báo',
      icon: Bell,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  return (
    <nav 
      id="main-navigation" 
      aria-label="Menu chức năng chính"
      className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[65px] sm:top-[69px] z-30 shadow-xs transition-colors"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-2 gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 min-h-[44px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="hidden md:inline">{item.fullLabel}</span>
                <span className="md:hidden">{item.label}</span>

                {item.badge !== null && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full transition-transform ${
                      isActive 
                        ? 'bg-white text-blue-700' 
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
