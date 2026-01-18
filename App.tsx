
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import { generateIcon } from './services/geminiService';
import { STYLE_PRESETS } from './constants';
import { AspectRatio, StylePreset } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('youyeye');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const url = await generateIcon(inputText, selectedStyle.promptSuffix, aspectRatio);
      setGeneratedImageUrl(url);
    } catch (err: any) {
      setError(err.message || "生成图片失败，请重试。");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedStyle, aspectRatio]);

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `youyeye-图标-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">配置参数</h2>
              
              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    图标文字内容
                  </label>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="请输入文字..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    纵横比
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1:1', '4:3', '16:9'] as AspectRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 text-xs font-medium rounded-md border transition-all ${
                          aspectRatio === ratio
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    设计风格
                  </label>
                  <div className="space-y-2">
                    {STYLE_PRESETS.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`w-full p-3 text-left rounded-xl border transition-all group ${
                          selectedStyle.id === style.id
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{style.name}</div>
                        <div className={`text-xs ${selectedStyle.id === style.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {style.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !inputText}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isLoading || !inputText
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在设计中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      生成图标
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
              {!generatedImageUrl && !isLoading ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">尚未生成图标</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      调整左侧设置并点击“生成图标”，为“{inputText}”创建专业的品牌图标。
                    </p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-xl">
                      AI
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">正在精心打磨设计...</h3>
                    <p className="text-slate-500 animate-pulse">正在运行高级神经网路进行排版分析</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
                  <div className="relative group overflow-hidden rounded-2xl border-4 border-slate-100 shadow-xl bg-slate-200 aspect-video flex items-center justify-center">
                    <img
                      src={generatedImageUrl!}
                      alt="Generated Icon"
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={downloadImage}
                        className="p-3 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-lg"
                        title="下载"
                      >
                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">生成结果</div>
                      <h4 className="text-lg font-semibold text-slate-900 capitalize">{selectedStyle.name} 风格</h4>
                      <p className="text-sm text-slate-500">已针对横向显示和网页标题优化</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleGenerate}
                        className="px-6 py-2 bg-slate-100 text-slate-700 rounded-full font-medium hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        重新生成
                      </button>
                      <button 
                        onClick={downloadImage}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 shadow-md transition-colors"
                      >
                        下载图片
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tips Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">专业提示</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    尝试不同的风格，例如“赛博朋克霓虹”可获得高科技感，或“极简主义”可获得干净的初创公司外观。
                  </p>
               </div>
               <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 text-sm mb-1">适用场景</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    非常适合网站导航栏、移动应用启动页和社交媒体横幅。16:9 的比例最能发挥横向视觉冲击力。
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Youyeye 图标设计师. 由 Gemini AI 提供动力.</p>
      </footer>
    </div>
  );
};

export default App;
