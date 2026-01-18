
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import { generateIcon } from './services/geminiService';
import { saveHistory, getAllHistory, deleteHistoryItem, clearAllHistory } from './services/historyService';
import { STYLE_PRESETS } from './constants';
import { AspectRatio, StylePreset, GeneratedImage } from './types';

type Theme = 'light' | 'warm' | 'dark';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('youyeye');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{current: number, total: number} | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 批量管理相关状态
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      return (saved === 'light' || saved === 'warm' || saved === 'dark') ? saved : 'light';
    }
    return 'light';
  });
  
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'warm', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getAllHistory();
        setHistory(data);
      } catch (err) {
        console.error("加载历史记录失败", err);
      }
    };
    loadHistory();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'warm';
      if (prev === 'warm') return 'dark';
      return 'light';
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setBatchProgress(null);
    setError(null);
    try {
      const url = await generateIcon(inputText, selectedStyle.promptSuffix, aspectRatio);
      setGeneratedImageUrl(url);
      
      const newRecord: GeneratedImage = {
        id: crypto.randomUUID(),
        url,
        prompt: selectedStyle.promptSuffix,
        text: inputText,
        styleName: selectedStyle.name,
        aspectRatio: aspectRatio,
        timestamp: Date.now()
      };
      
      await saveHistory(newRecord);
      setHistory(prev => [newRecord, ...prev]);
      
    } catch (err: any) {
      setError(err.message || "生成图片失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedStyle, aspectRatio]);

  const handleBatchGenerate = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    const total = 5;
    try {
      for (let i = 1; i <= total; i++) {
        setBatchProgress({ current: i, total });
        const url = await generateIcon(inputText, selectedStyle.promptSuffix, aspectRatio);
        
        const newRecord: GeneratedImage = {
          id: crypto.randomUUID(),
          url,
          prompt: selectedStyle.promptSuffix,
          text: inputText,
          styleName: selectedStyle.name,
          aspectRatio: aspectRatio,
          timestamp: Date.now()
        };
        
        await saveHistory(newRecord);
        setHistory(prev => [newRecord, ...prev]);
        setGeneratedImageUrl(url);
      }
    } catch (err: any) {
      setError(err.message || "批量生成过程中出现错误。");
    } finally {
      setIsLoading(false);
      setBatchProgress(null);
    }
  }, [inputText, selectedStyle, aspectRatio, isLoading]);

  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedIds.has(id)) {
        const next = new Set(selectedIds);
        next.delete(id);
        setSelectedIds(next);
      }
    } catch (err) {
      console.error("删除失败", err);
    }
  };

  const handleClearHistoryAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    setIsClearing(true);
    try {
      await clearAllHistory();
      setHistory([]);
      setGeneratedImageUrl(null);
      setShowClearConfirm(false);
      setIsBatchMode(false);
      setSelectedIds(new Set());
    } catch (err) {
      console.error("清空失败", err);
      setError("清空数据失败，请重试。");
    } finally {
      setIsClearing(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setIsLoading(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => deleteHistoryItem(id)));
      setHistory(prev => prev.filter(item => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
      setIsBatchMode(false);
    } catch (err) {
      console.error("批量删除失败", err);
      setError("部分图片删除失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectFromHistory = (item: GeneratedImage) => {
    if (isBatchMode) return;
    setGeneratedImageUrl(item.url);
    setInputText(item.text);
    setAspectRatio(item.aspectRatio);
    const style = STYLE_PRESETS.find(s => s.name === item.styleName);
    if (style) setSelectedStyle(style);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadImage = (url: string = generatedImageUrl!) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `youyeye-图标-${Date.now()}.png`;
    link.click();
  };

  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '1:1': return 'aspect-square';
      case 'circle': return 'aspect-square rounded-full overflow-hidden';
      case '4:3': return 'aspect-[4/3]';
      case '16:9': return 'aspect-video';
      default: return 'aspect-video';
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左侧配置栏 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <div className="space-y-6">
                {/* 文字输入 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      图标内容
                    </label>
                  </div>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="请输入品牌或图标文字..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* 纵横比 */}
                <div>
                  <label className="block text-sm font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                    画面比例
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                    {(['1:1', '4:3', '16:9', 'circle'] as AspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                          aspectRatio === ratio
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {ratio === 'circle' ? '圆形' : ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 风格选择 - 仅文字展示 */}
                <div>
                  <label className="block text-sm font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                    设计风格
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`relative flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all group overflow-hidden ${
                          selectedStyle.id === style.id
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className={`text-sm font-bold transition-colors ${selectedStyle.id === style.id ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                          {style.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !inputText}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 group ${
                    isLoading || !inputText
                      ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] hover:shadow-indigo-500/25'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {batchProgress ? `批量生成 (${batchProgress.current}/${batchProgress.total})...` : '创作中...'}
                    </>
                  ) : (
                    <>
                      <span className="group-hover:translate-x-1 transition-transform">✨ 立即生成图标</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl text-xs flex items-start gap-2 animate-bounce">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* 右侧展示区 */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 min-h-[550px] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
              {!generatedImageUrl && !isLoading ? (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600 transition-colors border border-dashed border-slate-200 dark:border-slate-700">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="max-w-sm mx-auto">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors">开启您的品牌视觉之旅</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 transition-colors">
                      您可以尝试输入“{inputText}”，选择“{selectedStyle.name}”风格，看看 Gemini AI 会带来怎样的惊喜。
                    </p>
                  </div>
                </div>
              ) : isLoading && !batchProgress ? (
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-2xl animate-pulse">✨</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">正在构思设计方案...</h3>
                    <div className="flex justify-center gap-1">
                       <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col gap-8 animate-in fade-in zoom-in duration-700">
                  <div className={`relative group overflow-hidden border-[6px] border-slate-50 dark:border-slate-700/50 shadow-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-all ${aspectRatio === 'circle' ? 'rounded-full max-w-[400px] mx-auto' : 'rounded-[2rem]'} ${getAspectClass(aspectRatio)}`}>
                    <img
                      src={generatedImageUrl!}
                      alt="Generated Icon"
                      className={`max-w-full max-h-full object-contain ${aspectRatio === 'circle' ? 'rounded-full' : ''}`}
                    />
                    {isLoading && batchProgress && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl font-black tracking-widest">灵感连发 ({batchProgress.current}/{batchProgress.total})</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => downloadImage()}
                        className="px-8 py-3 bg-white text-indigo-600 rounded-full font-black hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        保存到本地
                      </button>
                    </div>
                  </div>
                  
                  {/* 操作按钮区 */}
                  <div className="flex items-center justify-end gap-3 px-2">
                    <button 
                      onClick={handleBatchGenerate}
                      disabled={isLoading}
                      className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-2xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                      <span className="text-xl">🎆</span>
                      灵感五连
                    </button>
                    <button 
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="px-8 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                      重新生成
                    </button>
                    <button 
                      onClick={() => downloadImage()}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-colors"
                    >
                      下载图片
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 管理面板 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">图片历史记录管理</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">本地已安全保存了 {history.length} 张创作图片</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-3">
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="py-3 px-6 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      查看本地历史教程
                    </button>

                    {showClearConfirm && (
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="py-3 px-6 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        取消
                      </button>
                    )}
                    <button
                      onClick={handleClearHistoryAction}
                      disabled={isClearing}
                      className={`py-3 px-8 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        showClearConfirm 
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20 active:scale-95' 
                        : 'text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/50'
                      }`}
                    >
                      {isClearing ? '正在清算...' : showClearConfirm ? '确定清空' : '清空本地历史记录'}
                    </button>
                 </div>
               </div>
            </div>
            
            {/* 历史记录网格 */}
            {history.length > 0 && (
              <div id="history-section" className="space-y-6 pt-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors tracking-tight">时光回廊</h3>
                  
                  {/* 批量管理按钮逻辑 */}
                  <div className="flex items-center gap-2">
                    {isBatchMode ? (
                      <>
                        <button 
                          onClick={() => { setIsBatchMode(false); setSelectedIds(new Set()); }}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          取消
                        </button>
                        <button 
                          onClick={handleBatchDelete}
                          disabled={selectedIds.size === 0}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            selectedIds.size > 0 
                            ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed'
                          }`}
                        >
                          删除 {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsBatchMode(true)}
                        className="px-6 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors uppercase tracking-wider"
                      >
                        批量管理
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {history.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => isBatchMode ? toggleSelectItem(item.id, e) : selectFromHistory(item)}
                        className={`group relative bg-white dark:bg-slate-800 border-2 overflow-hidden cursor-pointer hover:shadow-xl transition-all flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${
                          isSelected 
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                        } ${item.aspectRatio === 'circle' ? 'rounded-full aspect-square' : 'rounded-2xl aspect-video'}`}
                      >
                        <img 
                          src={item.url} 
                          alt={item.text}
                          className={`max-w-full max-h-full object-contain p-2 ${item.aspectRatio === 'circle' ? 'rounded-full' : ''} ${isSelected ? 'opacity-70 scale-95 transition-transform' : ''}`}
                        />
                        
                        {/* 批量模式下的选中指示器 */}
                        {isBatchMode && (
                          <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-indigo-500 border-indigo-500' 
                              : 'bg-white/50 dark:bg-black/50 border-white/80 dark:border-slate-500/80'
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        )}

                        {/* 非批量模式下的悬浮操作 */}
                        {!isBatchMode && (
                          <div className={`absolute inset-0 bg-indigo-950/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 text-center backdrop-blur-[1px] ${item.aspectRatio === 'circle' ? 'rounded-full' : ''}`}>
                            <p className="text-white text-xs font-black truncate w-full mb-1">{item.text}</p>
                            <p className="text-indigo-300 text-[10px] mb-3">{item.styleName}</p>
                            <div className="flex gap-2">
                               <button 
                                onClick={(e) => { e.stopPropagation(); downloadImage(item.url); }}
                                className="p-2 bg-white/10 hover:bg-white/30 rounded-full text-white transition-colors"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                 </svg>
                               </button>
                               <button 
                                onClick={(e) => handleDeleteHistory(item.id, e)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-200 transition-colors"
                               >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                 </svg>
                               </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 教程弹窗 */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowHelpModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col transition-colors">
             <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">如何查看本地 IndexedDB 存储？</h3>
               <button onClick={() => setShowHelpModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             
             <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
               <div className="space-y-6">
                 <h4 className="text-lg font-black uppercase text-indigo-600 dark:text-indigo-400">Google Chrome 浏览器</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-300">1. 右键检查 -> 2. Application -> 3. IndexedDB -> 4. YouyeyeIconDB -> history</p>
                 <h4 className="text-lg font-black uppercase text-orange-600 dark:text-orange-400">Firefox 浏览器</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-300">1. 右键检查 -> 2. 存储 (Storage) -> 3. IndexedDB -> 4. YouyeyeIconDB -> history</p>
               </div>
             </div>
             
             <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
                <p className="text-sm font-black uppercase">💡 存储在本地，清理数据后历史将消失</p>
                <button onClick={() => setShowHelpModal(false)} className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black hover:scale-105 transition-all">
                  明白啦
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
