
import React from 'react';
import { ProjectInfo } from '../types';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ProjectHeaderProps {
  info: ProjectInfo;
  onUpdate: (info: ProjectInfo) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ info, onUpdate }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 font-sans">
      {/* Title Row */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
           <BuildingOfficeIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">專案名稱</label>
            <input 
              type="text" 
              value={info.projectName}
              onChange={(e) => onUpdate({ ...info, projectName: e.target.value })}
              className="w-full text-xl font-bold text-slate-800 border-none focus:ring-0 p-0 placeholder-slate-300 bg-transparent"
              placeholder="輸入專案名稱..."
            />
        </div>
      </div>

      {/* Grid Layout for Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
         {/* Left Column */}
         <div className="space-y-3">
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
               <span className="text-sm font-medium text-slate-500">工程起始日期</span>
               <input 
                 type="date" 
                 value={info.startDate} 
                 onChange={(e) => onUpdate({...info, startDate: e.target.value})} 
                 className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
               />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
               <span className="text-sm font-medium text-slate-500">工程完工日期</span>
               <input 
                 type="date" 
                 value={info.endDate} 
                 onChange={(e) => onUpdate({...info, endDate: e.target.value})} 
                 className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
               />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
               <span className="text-sm font-medium text-slate-500">製表/更新日期</span>
               <input 
                 type="date" 
                 value={info.updatedDate} 
                 onChange={(e) => onUpdate({...info, updatedDate: e.target.value})} 
                 className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
               />
            </div>
         </div>

         {/* Right Column */}
         <div className="space-y-3">
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
               <span className="text-sm font-medium text-slate-500">工地負責人</span>
               <input 
                 value={info.siteManager} 
                 onChange={(e) => onUpdate({...info, siteManager: e.target.value})} 
                 className="bg-transparent border-b border-slate-200 hover:border-blue-400 px-2 py-1 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                 placeholder="姓名"
               />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
               <span className="text-sm font-medium text-slate-500">職安人員</span>
               <input 
                 value={info.safetyOfficer} 
                 onChange={(e) => onUpdate({...info, safetyOfficer: e.target.value})} 
                 className="bg-transparent border-b border-slate-200 hover:border-blue-400 px-2 py-1 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                 placeholder="姓名"
               />
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
               <span className="text-sm font-medium text-slate-500">品管人員</span>
               <input 
                 value={info.qualityControl} 
                 onChange={(e) => onUpdate({...info, qualityControl: e.target.value})} 
                 className="bg-transparent border-b border-slate-200 hover:border-blue-400 px-2 py-1 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors"
                 placeholder="姓名"
               />
            </div>
         </div>
      </div>
    </div>
  );
};
