
import React from 'react';
import { ProjectInfo } from '../types';
import { BuildingOfficeIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ProjectHeaderProps {
  info: ProjectInfo;
  onUpdate: (info: ProjectInfo) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ info, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl backdrop-blur-sm shadow-xl">
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
           <BuildingOfficeIcon className="w-4 h-4" />
           <span className="text-xs font-bold tracking-wider uppercase">Project Name</span>
        </div>
        <input 
          type="text" 
          value={info.projectName}
          onChange={(e) => onUpdate({ ...info, projectName: e.target.value })}
          className="w-full bg-transparent text-2xl font-bold text-white border-none focus:ring-0 p-0 placeholder-zinc-700"
          placeholder="Enter Project Name"
        />
        <div className="flex gap-4 text-sm">
           <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-md border border-zinc-700/50">
             <span className="text-zinc-500">編號:</span>
             <input 
                value={info.projectCode}
                onChange={(e) => onUpdate({ ...info, projectCode: e.target.value })}
                className="bg-transparent text-zinc-300 w-28 focus:outline-none"
             />
           </div>
           <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-md border border-zinc-700/50">
             <span className="text-zinc-500">承攬:</span>
             <input 
                value={info.contractor}
                onChange={(e) => onUpdate({ ...info, contractor: e.target.value })}
                className="bg-transparent text-zinc-300 w-40 focus:outline-none"
             />
           </div>
        </div>
      </div>

      <div className="md:col-span-2 grid grid-cols-2 gap-4">
         <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
               <CalendarDaysIcon className="w-4 h-4" />
               <span className="text-xs font-bold uppercase">Schedule</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Start:</span>
                  <input type="date" value={info.startDate} onChange={(e) => onUpdate({...info, startDate: e.target.value})} className="bg-transparent text-zinc-300 text-right focus:outline-none" />
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">End:</span>
                  <input type="date" value={info.endDate} onChange={(e) => onUpdate({...info, endDate: e.target.value})} className="bg-transparent text-zinc-300 text-right focus:outline-none" />
               </div>
            </div>
         </div>

         <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8"></div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2 relative z-10">
               <ClockIcon className="w-4 h-4" />
               <span className="text-xs font-bold uppercase">Duration</span>
            </div>
            <div className="flex items-end justify-between relative z-10">
               <span className="text-zinc-500 text-sm">Total Days</span>
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-white">{info.duration}</span>
                  <span className="text-xs text-zinc-500">days</span>
               </div>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-700/50 flex justify-between items-center text-[10px] text-zinc-500">
               <span>Last Update:</span>
               <span>{info.lastUpdated}</span>
            </div>
         </div>
      </div>
    </div>
  );
};
