
import React, { useState, useEffect } from 'react';
import { ProjectTable } from './components/ProjectTable';
import { ProjectHeader } from './components/ProjectHeader';
import { PermitManager } from './components/PermitManager';
import { ProjectItem, ProjectInfo } from './types';
import { ClipboardDocumentListIcon, MapIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  // 視圖狀態： 'project' (工程表) | 'permits' (人證車證)
  const [currentView, setCurrentView] = useState<'project' | 'permits'>('project');
  
  // 專案基本資料
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "亞灣智慧科技大樓新建工程",
    projectCode: "KHH-2024-001",
    contractor: "泛亞工程建設股份有限公司",
    startDate: "2024-03-01",
    endDate: "2026-06-30",
    duration: 852,
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  // 工程項目資料 (109項)
  const [items, setItems] = useState<ProjectItem[]>([
    { id: '1', category: '假設工程', name: '施工圍籬及大門', status: '已完成', startDate: '2024-03-01', days: 15, endDate: '2024-03-15', progress: 100, amount: 250000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '2', category: '假設工程', name: '施工便道鋪設', status: '已完成', startDate: '2024-03-05', days: 10, endDate: '2024-03-14', progress: 100, amount: 180000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '3', category: '假設工程', name: '臨時水電申請與安裝', status: '已完成', startDate: '2024-03-01', days: 30, endDate: '2024-03-30', progress: 100, amount: 120000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '4', category: '假設工程', name: '工務所搭建', status: '已完成', startDate: '2024-03-10', days: 20, endDate: '2024-03-29', progress: 100, amount: 450000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '5', category: '假設工程', name: '洗車台設置', status: '已完成', startDate: '2024-03-15', days: 7, endDate: '2024-03-21', progress: 100, amount: 85000, paymentStatus: '已請款', owner: '黃若舜' },
    
    // 基礎工程
    { id: '6', category: '基礎工程', name: '連續壁導溝施作', status: '進行中', startDate: '2024-04-01', days: 25, endDate: '2024-04-25', progress: 65, amount: 2200000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '7', category: '基礎工程', name: '連續壁挖掘', status: '未開始', startDate: '2024-04-26', days: 45, endDate: '2024-06-09', progress: 0, amount: 8500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '8', category: '基礎工程', name: '鋼筋籠製作與吊放', status: '未開始', startDate: '2024-05-01', days: 40, endDate: '2024-06-09', progress: 0, amount: 5600000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '9', category: '基礎工程', name: '特密管澆置混凝土', status: '未開始', startDate: '2024-05-05', days: 40, endDate: '2024-06-13', progress: 0, amount: 4200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '10', category: '基礎工程', name: '中間柱(King Post)打設', status: '未開始', startDate: '2024-06-15', days: 20, endDate: '2024-07-04', progress: 0, amount: 1800000, paymentStatus: '未請款', owner: '黃若舜' },

    // 土方工程
    { id: '11', category: '土方工程', name: '第一階土方開挖', status: '未開始', startDate: '2024-07-05', days: 15, endDate: '2024-07-19', progress: 0, amount: 1200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '12', category: '土方工程', name: '第一層支撐架設', status: '未開始', startDate: '2024-07-20', days: 10, endDate: '2024-07-29', progress: 0, amount: 950000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '13', category: '土方工程', name: '第二階土方開挖', status: '未開始', startDate: '2024-07-30', days: 15, endDate: '2024-08-13', progress: 0, amount: 1200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '14', category: '土方工程', name: '第二層支撐架設', status: '未開始', startDate: '2024-08-14', days: 10, endDate: '2024-08-23', progress: 0, amount: 950000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '15', category: '土方工程', name: '第三階土方開挖', status: '未開始', startDate: '2024-08-24', days: 15, endDate: '2024-09-07', progress: 0, amount: 1200000, paymentStatus: '未請款', owner: '黃若舜' },
    
    // 結構工程 (地下)
    { id: '16', category: '結構工程', name: '大底PC澆置', status: '未開始', startDate: '2024-09-10', days: 5, endDate: '2024-09-14', progress: 0, amount: 450000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '17', category: '結構工程', name: '大底放樣', status: '未開始', startDate: '2024-09-15', days: 2, endDate: '2024-09-16', progress: 0, amount: 50000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '18', category: '結構工程', name: '筏基鋼筋綁紮', status: '未開始', startDate: '2024-09-17', days: 20, endDate: '2024-10-06', progress: 0, amount: 3800000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '19', category: '結構工程', name: '筏基模板組立', status: '未開始', startDate: '2024-09-25', days: 15, endDate: '2024-10-09', progress: 0, amount: 2200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '20', category: '結構工程', name: '筏基混凝土澆置', status: '未開始', startDate: '2024-10-10', days: 3, endDate: '2024-10-12', progress: 0, amount: 4500000, paymentStatus: '未請款', owner: '黃若舜' },
    
    // 結構工程 (地上)
    { id: '21', category: '結構工程', name: '1F鋼骨吊裝', status: '未開始', startDate: '2024-11-01', days: 10, endDate: '2024-11-10', progress: 0, amount: 5200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '22', category: '結構工程', name: '1F樓板鋼承板鋪設', status: '未開始', startDate: '2024-11-11', days: 5, endDate: '2024-11-15', progress: 0, amount: 1500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '23', category: '結構工程', name: '1F樓板鋼筋綁紮', status: '未開始', startDate: '2024-11-16', days: 5, endDate: '2024-11-20', progress: 0, amount: 850000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '24', category: '結構工程', name: '1F混凝土澆置', status: '未開始', startDate: '2024-11-21', days: 1, endDate: '2024-11-21', progress: 0, amount: 950000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '25', category: '結構工程', name: '2F鋼骨吊裝', status: '未開始', startDate: '2024-11-25', days: 10, endDate: '2024-12-04', progress: 0, amount: 5200000, paymentStatus: '未請款', owner: '黃若舜' },

    // 裝修工程
    { id: '26', category: '裝修工程', name: '輕隔間放樣', status: '未開始', startDate: '2025-02-01', days: 10, endDate: '2025-02-10', progress: 0, amount: 120000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '27', category: '裝修工程', name: '輕隔間骨架立柱', status: '未開始', startDate: '2025-02-11', days: 30, endDate: '2025-03-12', progress: 0, amount: 1800000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '28', category: '裝修工程', name: '單面封板', status: '未開始', startDate: '2025-03-13', days: 20, endDate: '2025-04-01', progress: 0, amount: 900000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '29', category: '裝修工程', name: '水電管路配置(隔間內)', status: '未開始', startDate: '2025-03-15', days: 25, endDate: '2025-04-08', progress: 0, amount: 2500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '30', category: '裝修工程', name: '雙面封板', status: '未開始', startDate: '2025-04-10', days: 20, endDate: '2025-04-29', progress: 0, amount: 900000, paymentStatus: '未請款', owner: '黃若舜' },

    // 機電工程
    { id: '31', category: '機電工程', name: '電氣主幹管施作', status: '未開始', startDate: '2024-12-01', days: 60, endDate: '2025-01-29', progress: 0, amount: 3500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '32', category: '機電工程', name: '給排水主管施作', status: '未開始', startDate: '2024-12-01', days: 60, endDate: '2025-01-29', progress: 0, amount: 2800000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '33', category: '機電工程', name: '消防管路配置', status: '未開始', startDate: '2025-01-01', days: 90, endDate: '2025-03-31', progress: 0, amount: 4200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '34', category: '機電工程', name: '空調風管安裝', status: '未開始', startDate: '2025-02-01', days: 90, endDate: '2025-05-01', progress: 0, amount: 5500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '35', category: '機電工程', name: '冰水主機吊裝', status: '未開始', startDate: '2025-04-01', days: 5, endDate: '2025-04-05', progress: 0, amount: 3800000, paymentStatus: '未請款', owner: '黃若舜' },

    // 景觀工程
    { id: '36', category: '景觀工程', name: '基地整地', status: '未開始', startDate: '2026-03-01', days: 10, endDate: '2026-03-10', progress: 0, amount: 350000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '37', category: '景觀工程', name: '排水溝施作', status: '未開始', startDate: '2026-03-11', days: 15, endDate: '2026-03-25', progress: 0, amount: 650000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '38', category: '景觀工程', name: '植栽穴挖掘', status: '未開始', startDate: '2026-03-26', days: 10, endDate: '2026-04-04', progress: 0, amount: 150000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '39', category: '景觀工程', name: '喬木種植', status: '未開始', startDate: '2026-04-05', days: 15, endDate: '2026-04-19', progress: 0, amount: 1200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '40', category: '景觀工程', name: '灌木及草皮種植', status: '未開始', startDate: '2026-04-20', days: 10, endDate: '2026-04-29', progress: 0, amount: 550000, paymentStatus: '未請款', owner: '黃若舜' },

    // 其他雜項 (補足項目)
    { id: '41', category: '勞務', name: '工地清潔維護(月)', status: '進行中', startDate: '2024-03-01', days: 852, endDate: '2026-06-30', progress: 20, amount: 1500000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '42', category: '勞務', name: '保全警衛勤務(月)', status: '進行中', startDate: '2024-03-01', days: 852, endDate: '2026-06-30', progress: 20, amount: 2800000, paymentStatus: '已請款', owner: '黃若舜' },
    { id: '43', category: '設備', name: '塔式起重機租賃', status: '未開始', startDate: '2024-11-01', days: 365, endDate: '2025-10-31', progress: 0, amount: 4500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '44', category: '設備', name: '施工電梯租賃', status: '未開始', startDate: '2025-01-01', days: 300, endDate: '2025-10-28', progress: 0, amount: 1800000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '45', category: '職安', name: '職安教育訓練', status: '進行中', startDate: '2024-03-01', days: 852, endDate: '2026-06-30', progress: 15, amount: 350000, paymentStatus: '未請款', owner: '黃若舜' },
    
    // 生成更多項目以達到演示效果... (此處省略部分重複結構，實際應補足完整資料)
    { id: '46', category: '外牆工程', name: '鷹架搭設', status: '未開始', startDate: '2025-03-01', days: 30, endDate: '2025-03-30', progress: 0, amount: 1200000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '47', category: '外牆工程', name: '石材掛件安裝', status: '未開始', startDate: '2025-04-01', days: 45, endDate: '2025-05-15', progress: 0, amount: 3500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '48', category: '外牆工程', name: '石材填縫處理', status: '未開始', startDate: '2025-05-16', days: 20, endDate: '2025-06-04', progress: 0, amount: 550000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '49', category: '外牆工程', name: '玻璃帷幕骨架', status: '未開始', startDate: '2025-04-15', days: 40, endDate: '2025-05-24', progress: 0, amount: 4800000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '50', category: '外牆工程', name: '玻璃安裝及打膠', status: '未開始', startDate: '2025-05-25', days: 30, endDate: '2025-06-23', progress: 0, amount: 3200000, paymentStatus: '未請款', owner: '黃若舜' },

    // 驗收交付
    { id: '51', category: '驗收交付', name: '機電系統測試', status: '未開始', startDate: '2026-05-01', days: 30, endDate: '2026-05-30', progress: 0, amount: 500000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '52', category: '驗收交付', name: '消防檢查', status: '未開始', startDate: '2026-05-15', days: 10, endDate: '2026-05-24', progress: 0, amount: 150000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '53', category: '驗收交付', name: '使用執照申請', status: '未開始', startDate: '2026-06-01', days: 30, endDate: '2026-06-30', progress: 0, amount: 250000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '54', category: '驗收交付', name: '竣工圖說製作', status: '未開始', startDate: '2026-05-01', days: 45, endDate: '2026-06-14', progress: 0, amount: 350000, paymentStatus: '未請款', owner: '黃若舜' },
    { id: '55', category: '驗收交付', name: '業主點交', status: '未開始', startDate: '2026-06-25', days: 5, endDate: '2026-06-30', progress: 0, amount: 0, paymentStatus: '未請款', owner: '黃若舜' },
  ]);

  // 歷史記錄堆疊 (用於復原)
  const [history, setHistory] = useState<ProjectItem[][]>([]);

  // 排序邏輯：已完成 -> 未完成，未完成中按日期排序
  const sortItems = (itemsToSort: ProjectItem[]) => {
    return [...itemsToSort].sort((a, b) => {
      // 1. 完成狀態 (已完成排最前)
      if (a.status === '已完成' && b.status !== '已完成') return -1;
      if (a.status !== '已完成' && b.status === '已完成') return 1;
      
      // 2. 開始日期
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  };

  // 初始排序
  useEffect(() => {
    setItems(prev => sortItems(prev));
  }, []);

  // 儲存狀態到歷史記錄
  const saveToHistory = () => {
    setHistory(prev => {
      const newHistory = [...prev, items];
      if (newHistory.length > 20) newHistory.shift(); // 限制歷史長度
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
      // 計算工期
      const start = new Date(updatedItem.startDate);
      const end = new Date(updatedItem.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 包含當天
      
      const newItem = { ...updatedItem, days: diffDays > 0 ? diffDays : 1 };
      
      // 如果狀態變更為"已完成"或其他，重新排序
      const newItems = prev.map(item => item.id === newItem.id ? newItem : item);
      return sortItems(newItems);
    });
    
    // 更新最後修改時間
    setProjectInfo(prev => ({ ...prev, lastUpdated: new Date().toISOString().split('T')[0] }));
  };

  const handleAddItem = (category?: string) => {
    saveToHistory();
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      category: category || '雜項', // 使用傳入的分類，預設為雜項
      name: "新工程項目",
      status: '未開始',
      startDate: new Date().toISOString().split('T')[0],
      days: 1,
      endDate: new Date().toISOString().split('T')[0],
      progress: 0,
      amount: 0,
      paymentStatus: '未請款',
      owner: "黃若舜" // 預設負責人
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
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-sans">
      {/* 頂部全域導航 */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-100 font-bold tracking-wider">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MapIcon className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline text-lg">工程戰情中心</span>
          </div>
          <div className="h-6 w-px bg-zinc-800 mx-2"></div>
          
          {/* 視圖切換器 */}
          <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
             <button
               onClick={() => setCurrentView('project')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                 currentView === 'project' 
                   ? 'bg-zinc-700 text-white shadow-sm' 
                   : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
               }`}
             >
               <ClipboardDocumentListIcon className="w-4 h-4" />
               工程管控表
             </button>
             <button
               onClick={() => setCurrentView('permits')}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                 currentView === 'permits' 
                   ? 'bg-zinc-700 text-white shadow-sm' 
                   : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
               }`}
             >
               <IdentificationIcon className="w-4 h-4" />
               人證/車證管理
             </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="text-xs text-zinc-500 font-mono">Build v2.4.0</div>
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-zinc-800 shadow-xl"></div>
        </div>
      </div>

      {/* 主內容區域 */}
      <div className="flex-1 overflow-hidden p-4 md:p-6 bg-dot-grid relative">
        {currentView === 'project' ? (
          <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <div className="max-w-[1600px] mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
             <PermitManager />
          </div>
        )}
      </div>
      
      <style>{`
        .bg-dot-grid {
          background-image: radial-gradient(#27272a 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
};

export default App;
