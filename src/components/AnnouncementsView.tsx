/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 5. BẢNG THÔNG BÁO (Announcements / Bulletin Board)
 * Giáo viên đăng thông báo, học sinh xem, đánh dấu đã đọc/chưa đọc, lọc theo đối tượng.
 */

import React, { useState } from 'react';
import { Announcement, UserRole } from '../types';
import { SYSTEM_CONFIG } from '../data/initialData';
import { 
  Bell, 
  Plus, 
  Search, 
  Calendar, 
  CheckCheck, 
  Eye, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  X,
  Megaphone
} from 'lucide-react';

interface AnnouncementsViewProps {
  role: UserRole;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'isRead'>) => void;
  onToggleRead: (announcementId: string) => void;
  onDeleteAnnouncement: (announcementId: string) => void;
}

const TARGET_OPTIONS = [
  'Toàn trường',
  'Khối 10',
  'Khối 11',
  'Khối 12',
  'Lớp 10A1',
  'Lớp 11A1',
  'Lớp 12A1',
] as const;

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  role,
  announcements,
  onAddAnnouncement,
  onToggleRead,
  onDeleteAnnouncement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');

  // Modal tạo thông báo mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<Announcement['target']>('Toàn trường');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');
  const [category, setCategory] = useState<Announcement['category']>('Học tập');
  const defaultAuthor = SYSTEM_CONFIG.teacherName;
  const [author, setAuthor] = useState(defaultAuthor);
  const [formError, setFormError] = useState('');

  // Modal xem toàn văn thông báo
  const [readingAnnouncement, setReadingAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.target.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'unread') return !ann.isRead;
    if (filterType === 'urgent') return ann.priority === 'urgent' || ann.priority === 'important';
    return true;
  });

  const handleOpenCreate = () => {
    setTitle('');
    setContent('');
    setTarget('Toàn trường');
    setPriority('normal');
    setCategory('Học tập');
    setAuthor(defaultAuthor);
    setFormError('');
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Vui lòng nhập tiêu đề thông báo!');
      return;
    }
    if (!content.trim()) {
      setFormError('Vui lòng nhập nội dung chi tiết thông báo!');
      return;
    }

    onAddAnnouncement({
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      target,
      priority,
      category,
      author: author.trim() || defaultAuthor,
    });

    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tiêu đề & Nút Tạo thông báo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-600" />
            <span>Bảng Tin & Thông Báo Nhà Trường</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cập nhật kế hoạch dạy học, lịch thi, thông điệp chung từ Ban Quản trị THPT số 2 Bát Xát
          </p>
        </div>

        {role === 'teacher' && (
          <button
            id="btn-create-announcement"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Đăng thông báo mới</span>
          </button>
        )}
      </div>

      {/* Thanh Tìm kiếm & Lọc */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-announcements"
            type="text"
            placeholder="Tìm kiếm thông báo..."
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

        {/* Nút lọc nhanh */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-xl font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Tất cả ({announcements.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-2 rounded-xl font-semibold transition-all ${
              filterType === 'unread'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Chưa đọc ({announcements.filter((a) => !a.isRead).length})
          </button>
          <button
            onClick={() => setFilterType('urgent')}
            className={`px-3 py-2 rounded-xl font-semibold transition-all ${
              filterType === 'urgent'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Quan trọng
          </button>
        </div>
      </div>

      {/* Danh sách các Thông báo */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center space-y-2">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">Không có thông báo nào</h4>
            <p className="text-xs text-slate-500">Thử đổi từ khóa hoặc bộ lọc ở trên.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isUrgent = ann.priority === 'urgent';
            const isImportant = ann.priority === 'important';

            return (
              <div
                key={ann.id}
                id={`announcement-item-${ann.id}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 transition-all space-y-3.5 ${
                  !ann.isRead
                    ? 'border-blue-300 dark:border-blue-700 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tag Mới */}
                    {!ann.isRead && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                        Mới
                      </span>
                    )}

                    {/* Danh mục */}
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                      {ann.category}
                    </span>

                    {/* Đối tượng */}
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Gửi: {ann.target}
                    </span>

                    {/* Mức độ ưu tiên */}
                    {isUrgent && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Khẩn cấp</span>
                      </span>
                    )}
                    {isImportant && !isUrgent && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                        Quan trọng
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{ann.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{ann.author}</span>
                  </div>
                </div>

                <div>
                  <h3 
                    onClick={() => {
                      setReadingAnnouncement(ann);
                      if (!ann.isRead) onToggleRead(ann.id);
                    }}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {ann.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {ann.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setReadingAnnouncement(ann);
                      if (!ann.isRead) onToggleRead(ann.id);
                    }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem toàn văn</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRead(ann.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{ann.isRead ? 'Đánh dấu chưa đọc' : 'Đã đọc xong'}</span>
                    </button>

                    {role === 'teacher' && (
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Xóa thông báo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL XEM CHI TIẾT THÔNG BÁO */}
      {readingAnnouncement && (
        <div
          id="modal-reading-announcement-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setReadingAnnouncement(null)}
        >
          <div
            id="modal-reading-announcement-content"
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                    {readingAnnouncement.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Gửi: {readingAnnouncement.target}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-1">
                  {readingAnnouncement.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingAnnouncement(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {readingAnnouncement.content}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>Đăng ngày: <strong>{readingAnnouncement.date}</strong></span>
              <span>Người đăng: <strong>{readingAnnouncement.author}</strong></span>
            </div>

            <button
              onClick={() => setReadingAnnouncement(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}

      {/* MODAL TẠO THÔNG BÁO MỚI */}
      {isCreateOpen && (
        <div
          id="modal-create-announcement-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            id="modal-create-announcement-content"
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <span>Đăng Thông Báo Mới</span>
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
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

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tiêu đề thông báo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhắc nhở lịch kiểm tra hoặc Hoạt động CLB..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Đối tượng nhận
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value as Announcement['target'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {TARGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Chuyên mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Announcement['category'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="Học tập">Học tập</option>
                    <option value="Lịch thi">Lịch thi</option>
                    <option value="Ngoại khóa">Ngoại khóa</option>
                    <option value="Khẩn cấp">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Announcement['priority'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="important">Quan trọng</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Người phát thông báo
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nội dung thông báo <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ghi rõ thông tin cần truyền đạt đến học sinh..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
