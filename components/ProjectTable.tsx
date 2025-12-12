
import React, { useState, useMemo } from 'react';
import { TrashIcon, ArrowUturnLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ProjectItem } from '../types';

interface ProjectTableProps {
  items: ProjectItem[];
  onUpdateItem: (item: ProjectItem) => void;
  onAddItem: (category?: string) => void;
  onDeleteItem: (id: string) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ 
  items, 
  onUpdateItem, 
  onAddItem, 
  onDeleteItem,
  onUndo,
  canUndo
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // 固定分類列表 + 實際上有的分類
  const categories = useMemo(() => {
    const fixedCategories = ['全部', '假設工程', '基礎工程', '土方工程', '結構工程', '裝修工程', '機電工程', '景觀工程', '勞務', '設備', '職安', '外牆工程', '驗收交付'];
    const existingCategories = Array.from(new Set(items.map(i => i.category)));
    return Array.from(new Set([...fixedCategories, ...existingCategories]));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === '全部') return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const totalAmount = useMemo(() => filteredItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [filteredItems]);
  const paidAmount = useMemo(() => filteredItems.filter(i => i.paymentStatus === '已請款').reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [filteredItems]);
  const unpaidAmount = useMemo(() => filteredItems.filter(i => i.paymentStatus === '未請款').reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [filteredItems]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val);

  // 判斷是否逾期：結束日期 < 今天 且 狀態 != 已完成
  const isOverdue = (item: ProjectItem) => {
    if (item.status === '已完成') return false;
    const today = new Date();
    const end = new Date(item.endDate);
    return end < today;
  };

  const getProgressColor = (item: ProjectItem) => {
    if (item.progress === 100) return 'bg-emerald-500';
    if (isOverdue(item)) return 'bg-red-500';
    return 'bg-blue-600';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case '已完成': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case '進行中': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case '暫停': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-zinc-400 bg-zinc-800/50 border-zinc-700/30';
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* 工具列：分類按鈕與操作 */}
      <div className="p-2 border-b border-zinc-800 bg-zinc-900/80 flex flex-col gap-2">
         <div className="flex items-center justify-between">
            <div className="flex-1 overflow-x-auto pb-1 scrollbar-hide flex gap-1.5 items-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 pl-4 border-l border-zinc-800 shrink-0">
               <button 
                 onClick={onUndo}
                 disabled={!canUndo}
                 className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    canUndo 
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                 }`}
               >
                 <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                 復原 (Undo)
               </button>
               <button 
                 onClick={() => onAddItem(selectedCategory === '全部' ? undefined : selectedCategory)}
                 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20"
               >
                 <PlusIcon className="w-3.5 h-3.5" />
                 新增工項
               </button>
            </div>
         </div>
      </div>

      {/* 表格主體 */}
      <div className="flex-1 overflow-auto bg-zinc-950/30">
        <div className="min-w-[1400px] h-full flex flex-col">
            {/* Header Row */}
            <div className="sticky top-0 z-10 grid grid-cols-[40px_80px_100px_1fr_90px_60px_90px_140px_100px_90px_90px_40px] gap-px bg-zinc-800 border-y border-zinc-800 text-xs font-bold text-zinc-400">
               <div className="p-3 bg-zinc-900 text-center">#</div>
               <div className="p-3 bg-zinc-900 text-center">狀態</div>
               <div className="p-3 bg-zinc-900 text-center">分類</div>
               <div className="p-3 bg-zinc-900 text-left pl-4">項目名稱</div>
               <div className="p-3 bg-zinc-900 text-center">開始日期</div>
               <div className="p-3 bg-zinc-900 text-center">工期</div>
               <div className="p-3 bg-zinc-900 text-center">完成日期</div>
               <div className="p-3 bg-zinc-900 text-center">進度 / 金額</div>
               <div className="p-3 bg-zinc-900 text-center">付款狀態</div>
               <div className="p-3 bg-zinc-900 text-center">負責人</div>
               <div className="p-3 bg-zinc-900 text-center">操作</div>
               <div className="p-3 bg-zinc-900"></div>
            </div>

            {/* Data Rows */}
            <div className="flex-1 relative">
               {filteredItems.map((item, index) => {
                 const isCompleted = item.status === '已完成';
                 return (
                   <div 
                     key={item.id} 
                     className={`grid grid-cols-[40px_80px_100px_1fr_90px_60px_90px_140px_100px_90px_90px_40px] gap-px border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors group text-xs ${isCompleted ? 'bg-zinc-900/20' : ''}`}
                   >
                     {/* Index */}
                     <div className="flex items-center justify-center text-zinc-600 bg-zinc-900/20">
                       {index + 1}
                     </div>

                     {/* Status */}
                     <div className="p-1">
                       <select 
                         value={item.status}
                         onChange={(e) => onUpdateItem({ ...item, status: e.target.value as any })}
                         className={`w-full h-full text-center rounded border bg-transparent outline-none cursor-pointer appearance-none ${getStatusColor(item.status)}`}
                       >
                         <option value="未開始" className="bg-zinc-900 text-zinc-400">未開始</option>
                         <option value="進行中" className="bg-zinc-900 text-blue-400">進行中</option>
                         <option value="已完成" className="bg-zinc-900 text-emerald-400">已完成</option>
                         <option value="暫停" className="bg-zinc-900 text-red-400">暫停</option>
                       </select>
                     </div>

                     {/* Category */}
                     <div className="p-1">
                        <input 
                          type="text" 
                          value={item.category}
                          onChange={(e) => onUpdateItem({ ...item, category: e.target.value })}
                          className={`w-full h-full bg-transparent text-center focus:bg-zinc-800 rounded outline-none text-zinc-400 ${isCompleted ? 'line-through opacity-50' : ''}`}
                        />
                     </div>

                     {/* Name */}
                     <div className="p-1">
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={(e) => onUpdateItem({ ...item, name: e.target.value })}
                          className={`w-full h-full bg-transparent px-3 focus:bg-zinc-800 rounded outline-none font-medium ${isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}
                        />
                     </div>

                     {/* Dates & Duration */}
                     <div className="p-1">
                        <input type="date" value={item.startDate} onChange={(e) => onUpdateItem({ ...item, startDate: e.target.value })} className={`w-full h-full bg-transparent text-center text-zinc-400 focus:bg-zinc-800 rounded outline-none ${isCompleted ? 'opacity-50' : ''}`} />
                     </div>
                     <div className="flex items-center justify-center text-zinc-500 bg-zinc-900/10">
                        {item.days}
                     </div>
                     <div className="p-1">
                        <input type="date" value={item.endDate} onChange={(e) => onUpdateItem({ ...item, endDate: e.target.value })} className={`w-full h-full bg-transparent text-center text-zinc-400 focus:bg-zinc-800 rounded outline-none ${isCompleted ? 'opacity-50' : ''}`} />
                     </div>

                     {/* Progress & Amount */}
                     <div className="p-2 flex flex-col justify-center gap-1.5">
                        <div className="flex items-center gap-2">
                           <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className={`h-full ${getProgressColor(item)} transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
                           </div>
                           <input 
                             type="number" 
                             value={item.progress} 
                             onChange={(e) => onUpdateItem({ ...item, progress: Math.min(100, Math.max(0, Number(e.target.value))) })}
                             className="w-8 bg-transparent text-right text-[10px] text-zinc-400 focus:text-white outline-none"
                           />
                           <span className="text-[10px] text-zinc-600">%</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <span className="text-zinc-600 text-[10px]">$</span>
                           <input 
                             type="number"
                             value={item.amount}
                             onChange={(e) => onUpdateItem({ ...item, amount: Number(e.target.value) })}
                             className={`flex-1 bg-transparent text-right font-mono text-zinc-300 focus:text-white outline-none focus:bg-zinc-800 rounded px-1 ${isCompleted ? 'opacity-50' : ''}`}
                           />
                        </div>
                     </div>

                     {/* Payment Status */}
                     <div className="p-1 flex items-center justify-center">
                        <select 
                          value={item.paymentStatus}
                          onChange={(e) => onUpdateItem({ ...item, paymentStatus: e.target.value as any })}
                          className={`text-[10px] px-2 py-0.5 rounded border outline-none cursor-pointer appearance-none ${
                             item.paymentStatus === '已請款' 
                               ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
                               : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}
                        >
                          <option value="未請款" className="bg-zinc-900">未請款</option>
                          <option value="已請款" className="bg-zinc-900">已請款</option>
                        </select>
                     </div>

                     {/* Owner */}
                     <div className="p-1">
                        <input 
                          type="text" 
                          value={item.owner}
                          onChange={(e) => onUpdateItem({ ...item, owner: e.target.value })}
                          className={`w-full h-full bg-transparent text-center focus:bg-zinc-800 rounded outline-none ${isCompleted ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}
                        />
                     </div>

                     {/* Actions */}
                     <div className="flex items-center justify-center">
                        <button 
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                     </div>
                   </div>
                 );
               })}
            </div>
        </div>
      </div>

      {/* Footer Totals */}
      <div className="h-10 bg-zinc-900 border-t border-zinc-800 flex items-center justify-end px-6 gap-6 text-xs font-mono">
         <div className="flex items-center gap-2">
            <span className="text-zinc-500">總金額:</span>
            <span className="text-white font-bold">{formatCurrency(totalAmount)}</span>
         </div>
         <div className="h-4 w-px bg-zinc-700"></div>
         <div className="flex items-center gap-2">
            <span className="text-emerald-600">已請款:</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(paidAmount)}</span>
         </div>
         <div className="h-4 w-px bg-zinc-700"></div>
         <div className="flex items-center gap-2">
            <span className="text-zinc-500">未請款:</span>
            <span className="text-orange-400 font-bold">{formatCurrency(unpaidAmount)}</span>
         </div>
      </div>
    </div>
  );
};
