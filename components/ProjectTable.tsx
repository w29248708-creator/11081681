
import React, { useState, useMemo } from 'react';
import { TrashIcon, ArrowUturnLeftIcon, PlusIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/solid';
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

  // 固定分類列表
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

  const getStatusStyle = (status: string) => {
    switch(status) {
      case '已完成': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case '進行中': return 'text-blue-600 bg-blue-50 border-blue-200';
      case '暫停': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden font-sans">
      {/* Table Title Bar */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
         <div className="flex items-center gap-2 text-slate-700">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm tracking-wide">工程進度管控表</h3>
         </div>
         
         <div className="flex items-center gap-2">
            <button 
                onClick={onUndo}
                disabled={!canUndo}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                canUndo 
                    ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900' 
                    : 'text-slate-300 cursor-not-allowed'
                }`}
            >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                復原
            </button>
            <button 
                disabled
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded text-slate-300 cursor-not-allowed"
            >
                <ArrowUturnRightIcon className="w-3.5 h-3.5" />
                下一步
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button 
                onClick={() => onAddItem(selectedCategory === '全部' ? undefined : selectedCategory)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm shadow-blue-200 transition-colors"
            >
                <PlusIcon className="w-3.5 h-3.5" />
                新增工項
            </button>
         </div>
      </div>

      {/* Category Tabs (Optional/Secondary) */}
      <div className="px-2 py-2 border-b border-slate-100 bg-white overflow-x-auto whitespace-nowrap scrollbar-hide">
         <div className="flex gap-1">
            {categories.map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === cat 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
                {cat}
            </button>
            ))}
         </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto bg-white relative">
        <div className="min-w-[1500px]">
            {/* Header Row */}
            <div className="sticky top-0 z-10 grid grid-cols-[50px_1fr_100px_100px_60px_90px_60px_100px_90px_90px_120px_50px] gap-px bg-slate-200 border-b border-slate-200 text-xs font-bold text-slate-600">
               <div className="p-3 bg-slate-100/90 text-center">序號</div>
               <div className="p-3 bg-slate-100/90 text-left pl-4">工程項目</div>
               <div className="p-3 bg-slate-100/90 text-center">開始日期</div>
               <div className="p-3 bg-slate-100/90 text-center">完成日期</div>
               <div className="p-3 bg-slate-100/90 text-center">日數</div>
               <div className="p-3 bg-slate-100/90 text-center">狀態</div>
               <div className="p-3 bg-slate-100/90 text-center">進度%</div>
               <div className="p-3 bg-slate-100/90 text-center">金額</div>
               <div className="p-3 bg-slate-100/90 text-center">請款狀態</div>
               <div className="p-3 bg-slate-100/90 text-center">負責人</div>
               <div className="p-3 bg-slate-100/90 text-center">備註</div>
               <div className="p-3 bg-slate-100/90 text-center">操作</div>
            </div>

            {/* Rows */}
            <div className="flex-1">
               {filteredItems.map((item, index) => {
                 const isCompleted = item.status === '已完成';
                 return (
                   <div 
                     key={item.id} 
                     className={`grid grid-cols-[50px_1fr_100px_100px_60px_90px_60px_100px_90px_90px_120px_50px] gap-px border-b border-slate-100 hover:bg-blue-50/30 transition-colors text-xs group ${isCompleted ? 'bg-slate-50' : 'bg-white'}`}
                   >
                     {/* Index */}
                     <div className="flex items-center justify-center text-slate-400 bg-slate-50/50">
                       {index + 1}
                     </div>

                     {/* Name */}
                     <div className="p-1 relative">
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={(e) => onUpdateItem({ ...item, name: e.target.value })}
                          className={`w-full h-full bg-transparent px-3 rounded focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                        />
                     </div>

                     {/* Dates */}
                     <div className="p-1">
                        <input type="date" value={item.startDate} onChange={(e) => onUpdateItem({ ...item, startDate: e.target.value })} className="w-full h-full bg-transparent text-center text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded outline-none" />
                     </div>
                     <div className="p-1">
                        <input type="date" value={item.endDate} onChange={(e) => onUpdateItem({ ...item, endDate: e.target.value })} className="w-full h-full bg-transparent text-center text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded outline-none" />
                     </div>

                     {/* Days */}
                     <div className="flex items-center justify-center text-slate-500 font-mono">
                        {item.days}
                     </div>

                     {/* Status */}
                     <div className="p-1.5">
                       <select 
                         value={item.status}
                         onChange={(e) => onUpdateItem({ ...item, status: e.target.value as any })}
                         className={`w-full h-full text-center text-[10px] rounded border outline-none cursor-pointer appearance-none font-medium ${getStatusStyle(item.status)}`}
                       >
                         <option value="未開始">未開始</option>
                         <option value="進行中">進行中</option>
                         <option value="已完成">已完成</option>
                         <option value="暫停">暫停</option>
                       </select>
                     </div>

                     {/* Progress */}
                     <div className="p-2 flex items-center gap-1">
                         <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full ${getProgressColor(item)}`} style={{ width: `${item.progress}%` }}></div>
                         </div>
                         <input 
                             type="number" 
                             value={item.progress} 
                             onChange={(e) => onUpdateItem({ ...item, progress: Number(e.target.value) })}
                             className="w-6 text-right text-[10px] bg-transparent outline-none text-slate-600"
                         />
                     </div>

                     {/* Amount */}
                     <div className="p-1">
                        <input 
                             type="number"
                             value={item.amount}
                             onChange={(e) => onUpdateItem({ ...item, amount: Number(e.target.value) })}
                             className="w-full h-full bg-transparent text-right font-mono text-slate-600 px-2 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded outline-none"
                         />
                     </div>

                     {/* Payment Status */}
                     <div className="p-1.5 flex items-center justify-center">
                        <select 
                          value={item.paymentStatus}
                          onChange={(e) => onUpdateItem({ ...item, paymentStatus: e.target.value as any })}
                          className={`w-full text-[10px] py-1 text-center rounded outline-none cursor-pointer appearance-none font-medium ${
                             item.paymentStatus === '已請款' 
                               ? 'text-emerald-600' 
                               : 'text-slate-400'
                          }`}
                        >
                          <option value="未請款">未請款</option>
                          <option value="已請款">已請款</option>
                        </select>
                     </div>

                     {/* Owner */}
                     <div className="p-1">
                        <input 
                          type="text" 
                          value={item.owner}
                          onChange={(e) => onUpdateItem({ ...item, owner: e.target.value })}
                          className="w-full h-full bg-transparent text-center text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded outline-none"
                        />
                     </div>

                     {/* Remark */}
                     <div className="p-1">
                        <input 
                          type="text" 
                          value={item.remark || ''}
                          onChange={(e) => onUpdateItem({ ...item, remark: e.target.value })}
                          className="w-full h-full bg-transparent text-center text-slate-500 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded outline-none"
                          placeholder="..."
                        />
                     </div>

                     {/* Actions */}
                     <div className="flex items-center justify-center">
                        <button 
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
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

      {/* Footer */}
      <div className="h-10 bg-slate-50 border-t border-slate-200 flex items-center justify-end px-6 gap-6 text-xs font-mono text-slate-600">
         <div className="flex items-center gap-2">
            <span>已請款:</span>
            <span className="text-emerald-600 font-bold">{formatCurrency(paidAmount)}</span>
         </div>
         <div className="h-4 w-px bg-slate-300"></div>
         <div className="flex items-center gap-2">
            <span>未請款:</span>
            <span className="text-orange-500 font-bold">{formatCurrency(unpaidAmount)}</span>
         </div>
         <div className="h-4 w-px bg-slate-300"></div>
         <div className="flex items-center gap-2 bg-slate-200 px-3 py-1 rounded">
            <span>總金額:</span>
            <span className="text-slate-900 font-bold">{formatCurrency(totalAmount)}</span>
         </div>
      </div>
    </div>
  );
};
