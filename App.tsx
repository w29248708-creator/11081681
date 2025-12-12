
import React, { useState, useEffect } from 'react';
import { ProjectTable } from './components/ProjectTable';
import { ProjectHeader } from './components/ProjectHeader';
import { PermitManager } from './components/PermitManager';
import { ProjectItem, ProjectInfo } from './types';
import { ClipboardDocumentListIcon, MapIcon, IdentificationIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'project' | 'permits'>('project');
  
  // 專案基本資料 (更新為截圖中的資料)
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "第一期10號機電梯安裝採購案",
    startDate: "2025-11-26",
    endDate: "2026-04-24",
    updatedDate: "2025-12-12",
    siteManager: "黃若舜",
    safetyOfficer: "吳孟陵, 鄭年春",
    qualityControl: "林漢耕"
  });

  // 工程項目資料 (更新為截圖中的項目)
  const [items, setItems] = useState<ProjectItem[]>([
    { id: '1', category: '機電工程', name: 'CCTV系統線路配置作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 2900, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '2', category: '機電工程', name: 'CCTV系統設定作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 6000, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '3', category: '裝修工程', name: '不鏽鋼導盲釘增設費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 2000, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '4', category: '機電工程', name: '消防系統線路配置作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 2900, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '5', category: '機電工程', name: '消防系統設定作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 6000, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '6', category: '機電工程', name: '消防電力系統作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 6000, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '7', category: '設備', name: '10電梯拆除作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 3800, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '8', category: '設備', name: '10電梯更新安裝施工費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 8200, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '9', category: '裝修工程', name: '廳門開口作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 7800, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '10', category: '裝修工程', name: '防火門增設作業費用', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 5800, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
    { id: '11', category: '機電工程', name: '電梯10號機緊急對講機線路', status: '未開始', startDate: '2025-11-26', days: 150, endDate: '2026-04-24', progress: 0, amount: 2900, paymentStatus: '未請款', owner: '黃若舜', remark: '弱務' },
  ]);

  const [history, setHistory] = useState<ProjectItem[][]>([]);

  const sortItems = (itemsToSort: ProjectItem[]) => {
    return [...itemsToSort].sort((a, b) => {
      if (a.status === '已完成' && b.status !== '已完成') return -1;
      if (a.status !== '已完成' && b.status === '已完成') return 1;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  };

  useEffect(() => {
    setItems(prev => sortItems(prev));
  }, []);

  const saveToHistory = () => {
    setHistory(prev => {
      const newHistory = [...prev, items];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setItems(previousState);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleUpdateItem = (updatedItem: ProjectItem) => {
    saveToHistory();
    setItems(prev => {
      const start = new Date(updatedItem.startDate);
      const end = new Date(updatedItem.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const newItem = { ...updatedItem, days: diffDays > 0 ? diffDays : 1 };
      const newItems = prev.map(item => item.id === newItem.id ? newItem : item);
      return sortItems(newItems);
    });
  };

  const handleAddItem = (category?: string) => {
    saveToHistory();
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      category: category || '雜項',
      name: "新工程項目",
      status: '未開始',
      startDate: new Date().toISOString().split('T')[0],
      days: 1,
      endDate: new Date().toISOString().split('T')[0],
      progress: 0,
      amount: 0,
      paymentStatus: '未請款',
      owner: "黃若舜",
      remark: ""
    };
    
    setItems(prev => sortItems([...prev, newItem]));
  };

  const handleDeleteItem = (id: string) => {
    if(confirm('確定要刪除此項目嗎？')) {
      saveToHistory();
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden font-sans text-slate-800">
      {/* 頂部全域導航 */}
      <div className="h-16 bg-blue-700 shadow-md flex items-center justify-between px-6 shrink-0 z-50 text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
              <BuildingStorefrontIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
               <span className="text-lg">工程專案管理系統</span>
               <span className="text-[10px] text-blue-200 font-light tracking-widest">智慧進度管控與分析</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-blue-600 mx-2"></div>
          
          {/* 視圖切換器 */}
          <div className="flex bg-blue-800/50 rounded p-1 border border-blue-600/50">
             <button
               onClick={() => setCurrentView('project')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-all ${
                 currentView === 'project' 
                   ? 'bg-white text-blue-700 shadow-sm' 
                   : 'text-blue-100 hover:bg-blue-700/50'
               }`}
             >
               <ClipboardDocumentListIcon className="w-4 h-4" />
               工程管控表
             </button>
             <button
               onClick={() => setCurrentView('permits')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-all ${
                 currentView === 'permits' 
                   ? 'bg-white text-purple-700 shadow-sm' 
                   : 'text-blue-100 hover:bg-blue-700/50'
               }`}
             >
               <IdentificationIcon className="w-4 h-4" />
               人證/車證管理
             </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="text-xs text-blue-200 font-mono">Build v3.0.1 (Light)</div>
           <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-blue-400 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm">
             黃
           </div>
        </div>
      </div>

      {/* 主內容區域 */}
      <div className="flex-1 overflow-hidden p-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
             style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
        </div>

        {currentView === 'project' ? (
          <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            {/* 專案資訊卡片 */}
            <div className="shrink-0">
              <ProjectHeader 
                info={projectInfo} 
                onUpdate={setProjectInfo} 
              />
            </div>
            
            {/* 專案表格 */}
            <div className="flex-1 min-h-0">
              <ProjectTable 
                items={items} 
                onUpdateItem={handleUpdateItem}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                onUndo={handleUndo}
                canUndo={history.length > 0}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-[1800px] mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
             <PermitManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
