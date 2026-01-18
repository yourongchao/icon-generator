
import React from 'react';

interface HeaderProps {
  theme: 'light' | 'warm' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const scrollToHistory = (e: React.MouseEvent) => {
    e.preventDefault();
    const historySection = document.getElementById('history-section');
    if (historySection) {
      historySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') {
      return (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
        </svg>
      );
    }
    if (theme === 'warm') {
      return (
        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1.323l.395-.132a1 1 0 01.632 1.897l-.394.132.856.285a1 1 0 11-.633 1.897l-.855-.285V10a1 1 0 11-2 0V8.317l-.855.285a1 1 0 01-.633-1.897l.856-.285-.394-.132a1 1 0 01.632-1.897l.395.132V3a1 1 0 011-1z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 112 0v2a1 1 0 11-2 0v-2z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 dark:shadow-none shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Youyeye <span className="text-indigo-600 dark:text-indigo-400">图标设计师</span>
          </span>
        </div>
        
        <nav className="flex items-center gap-3 sm:gap-6">
          <a 
            href="#history-section" 
            onClick={scrollToHistory}
            className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            历史记录
          </a>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2"
            title={`当前主题: ${theme === 'light' ? '浅色' : theme === 'warm' ? '暖色' : '深色'}`}
          >
            {getThemeIcon()}
          </button>

          <button className="bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors shadow-md">
            分享
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
