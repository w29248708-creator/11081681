
import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Personnel, Vehicle } from '../types';

export const PermitManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personnel' | 'vehicle'>('personnel');

  // 預設模擬資料
  const [personnelList, setPersonnelList] = useState<Personnel[]>([
    {
      id: '1',
      company: '鴻海工程',
      name: '王小明',
      role: '電工',
      hasLaborInsurance: true,
      hasIdCard: true,
      hasPhysicalExam: true,
      hasSafetyTraining: true,
      hasSpecialLicense: false,
      applicationDate: new Date().toISOString().split('T')[0],
      entryDate: new Date().toISOString().split('T')[0],
      status: '合格',
      note: ''
    },
    {
      id: '2',
      company: '大立光電',
      name: '李大華',
      role: '監工',
      hasLaborInsurance: true,
      hasIdCard: true,
      hasPhysicalExam: false,
      hasSafetyTraining: true,
      hasSpecialLicense: true,
      applicationDate: new Date().toISOString().split('T')[0],
      entryDate: '',
      status: '審核中',
      note: '缺體檢表'
    }
  ]);

  const [vehicleList, setVehicleList] = useState<Vehicle[]>([
    {
      id: '1',
      company: '順風吊車',
      plateNumber: 'REA-8888',
      type: '25T吊車',
      driver: '張三瘋',
      hasRegistration: true,
      hasLicense: true,
      hasInsurance: true,
      hasPhoto: true,
      applicationDate: new Date().toISOString().split('T')[0],
      entryDate: new Date().toISOString().split('T')[0],
      accessArea: 'A區',
      status: '合格'
    }
  ]);

  // 人員操作
  const addPersonnel = () => {
    const newPerson: Personnel = {
      id: crypto.randomUUID(),
      company: '',
      name: '',
      role: '',
      hasLaborInsurance: false,
      hasIdCard: false,
      hasPhysicalExam: false,
      hasSafetyTraining: false,
      hasSpecialLicense: false,
      applicationDate: new Date().toISOString().split('T')[0],
      entryDate: '',
      status: '審核中',
      note: ''
    };
    setPersonnelList([...personnelList, newPerson]);
  };

  const updatePersonnel = (id: string, field: keyof Personnel, value: any) => {
    setPersonnelList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePersonnel = (id: string) => {
    if (confirm('確定要刪除此人員資料嗎？')) {
      setPersonnelList(prev => prev.filter(p => p.id !== id));
    }
  };

  // 車輛操作
  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      company: '',
      plateNumber: '',
      type: '',
      driver: '',
      hasRegistration: false,
      hasLicense: false,
      hasInsurance: false,
      hasPhoto: false,
      applicationDate: new Date().toISOString().split('T')[0],
      entryDate: '',
      accessArea: '',
      status: '審核中'
    };
    setVehicleList([...vehicleList, newVehicle]);
  };

  const updateVehicle = (id: string, field: keyof Vehicle, value: any) => {
    setVehicleList(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const deleteVehicle = (id: string) => {
    if (confirm('確定要刪除此車輛資料嗎？')) {
      setVehicleList(prev => prev.filter(v => v.id !== id));
    }
  };

  // 狀態樣式
  const getStatusColor = (status: string) => {
    switch (status) {
      case '合格': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case '退件': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  // 通用 Checkbox
  const CheckCell = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
    <div className="flex justify-center items-center h-full" onClick={() => onChange(!checked)}>
      <div className={`w-5 h-5 rounded border cursor-pointer transition-colors flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-500' : 'bg-zinc-800 border-zinc-600 hover:border-zinc-500'}`}>
        {checked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden shadow-2xl backdrop-blur-sm">
      
      {/* 頂部 Tab 切換 */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/80">
        <button
          onClick={() => setActiveTab('personnel')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            activeTab === 'personnel' 
              ? 'bg-zinc-800/50 text-blue-400 border-b-2 border-blue-500' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
          }`}
        >
          <UserGroupIcon className="w-5 h-5" />
          人員進場管理 ({personnelList.length})
        </button>
        <div className="w-px bg-zinc-800 my-3"></div>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
            activeTab === 'vehicle' 
              ? 'bg-zinc-800/50 text-purple-400 border-b-2 border-purple-500' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
          }`}
        >
          <TruckIcon className="w-5 h-5" />
          車輛進場管理 ({vehicleList.length})
        </button>
      </div>

      {/* 主要內容區 */}
      <div className="flex-1 overflow-auto p-4 bg-zinc-950/30">
        
        {/* 人員管理表格 */}
        {activeTab === 'personnel' && (
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[40px_1fr_100px_100px_60px_60px_60px_60px_60px_110px_110px_90px_1fr_40px] gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden text-xs">
              {/* Header */}
              <div className="contents font-bold text-zinc-400 bg-zinc-900 text-center">
                <div className="p-3">#</div>
                <div className="p-3">公司名稱</div>
                <div className="p-3">姓名</div>
                <div className="p-3">職稱</div>
                <div className="p-3" title="勞保">勞保</div>
                <div className="p-3" title="身分證">證件</div>
                <div className="p-3" title="體檢">體檢</div>
                <div className="p-3" title="一般工安">工安</div>
                <div className="p-3" title="特殊證照">特照</div>
                <div className="p-3">申請日期</div>
                <div className="p-3">預計進場</div>
                <div className="p-3">狀態</div>
                <div className="p-3">備註</div>
                <div className="p-3"></div>
              </div>

              {/* Rows */}
              {personnelList.map((p, idx) => (
                <div key={p.id} className="contents group hover:bg-zinc-800/50 transition-colors bg-zinc-900/40">
                  <div className="bg-zinc-900/30 p-2 flex items-center justify-center text-zinc-500">{idx + 1}</div>
                  <input 
                    value={p.company} 
                    onChange={e => updatePersonnel(p.id, 'company', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-300 focus:bg-zinc-800 outline-none" 
                    placeholder="公司名稱"
                  />
                  <input 
                    value={p.name} 
                    onChange={e => updatePersonnel(p.id, 'name', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-100 font-medium focus:bg-zinc-800 outline-none" 
                    placeholder="姓名"
                  />
                  <input 
                    value={p.role} 
                    onChange={e => updatePersonnel(p.id, 'role', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-300 focus:bg-zinc-800 outline-none" 
                    placeholder="職稱"
                  />
                  <div className="bg-zinc-900/30"><CheckCell checked={p.hasLaborInsurance} onChange={v => updatePersonnel(p.id, 'hasLaborInsurance', v)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={p.hasIdCard} onChange={v => updatePersonnel(p.id, 'hasIdCard', v)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={p.hasPhysicalExam} onChange={v => updatePersonnel(p.id, 'hasPhysicalExam', v)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={p.hasSafetyTraining} onChange={v => updatePersonnel(p.id, 'hasSafetyTraining', v)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={p.hasSpecialLicense} onChange={v => updatePersonnel(p.id, 'hasSpecialLicense', v)} /></div>
                  
                  <input 
                    type="date"
                    value={p.applicationDate}
                    onChange={e => updatePersonnel(p.id, 'applicationDate', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-400 focus:bg-zinc-800 outline-none"
                  />
                  <input 
                    type="date"
                    value={p.entryDate}
                    onChange={e => updatePersonnel(p.id, 'entryDate', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-400 focus:bg-zinc-800 outline-none"
                  />

                  <div className="p-1 flex items-center justify-center">
                    <select 
                      value={p.status}
                      onChange={e => updatePersonnel(p.id, 'status', e.target.value as any)}
                      className={`w-full text-center text-[10px] py-1 rounded border ${getStatusColor(p.status)} bg-transparent outline-none cursor-pointer appearance-none`}
                    >
                      <option value="審核中" className="bg-zinc-900 text-yellow-500">審核中</option>
                      <option value="合格" className="bg-zinc-900 text-emerald-500">合格</option>
                      <option value="退件" className="bg-zinc-900 text-red-500">退件</option>
                    </select>
                  </div>

                  <input 
                    value={p.note} 
                    onChange={e => updatePersonnel(p.id, 'note', e.target.value)}
                    className="bg-transparent p-2 text-left text-zinc-400 focus:bg-zinc-800 outline-none" 
                    placeholder="備註..."
                  />

                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => deletePersonnel(p.id)}
                      className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addPersonnel}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
            >
              <PlusIcon className="w-4 h-4" />
              新增人員資料
            </button>
          </div>
        )}

        {/* 車輛管理表格 */}
        {activeTab === 'vehicle' && (
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[40px_1fr_100px_100px_100px_60px_60px_60px_60px_110px_110px_100px_80px_40px] gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden text-xs">
              {/* Header */}
              <div className="contents font-bold text-zinc-400 bg-zinc-900 text-center">
                <div className="p-3">#</div>
                <div className="p-3">所屬公司</div>
                <div className="p-3">車牌號碼</div>
                <div className="p-3">車種</div>
                <div className="p-3">駕駛姓名</div>
                <div className="p-3" title="行照">行照</div>
                <div className="p-3" title="駕照">駕照</div>
                <div className="p-3" title="保險">保險</div>
                <div className="p-3" title="車輛照片">照片</div>
                <div className="p-3">申請日期</div>
                <div className="p-3">進場日期</div>
                <div className="p-3">管制區</div>
                <div className="p-3">狀態</div>
                <div className="p-3"></div>
              </div>

              {/* Rows */}
              {vehicleList.map((v, idx) => (
                <div key={v.id} className="contents group hover:bg-zinc-800/50 transition-colors bg-zinc-900/40">
                  <div className="bg-zinc-900/30 p-2 flex items-center justify-center text-zinc-500">{idx + 1}</div>
                  <input 
                    value={v.company} 
                    onChange={e => updateVehicle(v.id, 'company', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-300 focus:bg-zinc-800 outline-none" 
                    placeholder="公司"
                  />
                  <input 
                    value={v.plateNumber} 
                    onChange={e => updateVehicle(v.id, 'plateNumber', e.target.value)}
                    className="bg-transparent p-2 text-center text-yellow-500 font-mono font-bold focus:bg-zinc-800 outline-none" 
                    placeholder="車牌"
                  />
                  <input 
                    value={v.type} 
                    onChange={e => updateVehicle(v.id, 'type', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-300 focus:bg-zinc-800 outline-none" 
                    placeholder="車種"
                  />
                  <input 
                    value={v.driver} 
                    onChange={e => updateVehicle(v.id, 'driver', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-100 focus:bg-zinc-800 outline-none" 
                    placeholder="駕駛"
                  />
                  <div className="bg-zinc-900/30"><CheckCell checked={v.hasRegistration} onChange={val => updateVehicle(v.id, 'hasRegistration', val)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={v.hasLicense} onChange={val => updateVehicle(v.id, 'hasLicense', val)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={v.hasInsurance} onChange={val => updateVehicle(v.id, 'hasInsurance', val)} /></div>
                  <div className="bg-zinc-900/30"><CheckCell checked={v.hasPhoto} onChange={val => updateVehicle(v.id, 'hasPhoto', val)} /></div>
                  
                  <input 
                    type="date"
                    value={v.applicationDate}
                    onChange={e => updateVehicle(v.id, 'applicationDate', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-400 focus:bg-zinc-800 outline-none"
                  />
                  <input 
                    type="date"
                    value={v.entryDate}
                    onChange={e => updateVehicle(v.id, 'entryDate', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-400 focus:bg-zinc-800 outline-none"
                  />

                  <input 
                    value={v.accessArea} 
                    onChange={e => updateVehicle(v.id, 'accessArea', e.target.value)}
                    className="bg-transparent p-2 text-center text-zinc-300 focus:bg-zinc-800 outline-none" 
                    placeholder="區域"
                  />

                  <div className="p-1 flex items-center justify-center">
                    <select 
                      value={v.status}
                      onChange={e => updateVehicle(v.id, 'status', e.target.value as any)}
                      className={`w-full text-center text-[10px] py-1 rounded border ${getStatusColor(v.status)} bg-transparent outline-none cursor-pointer appearance-none`}
                    >
                      <option value="審核中" className="bg-zinc-900 text-yellow-500">審核中</option>
                      <option value="合格" className="bg-zinc-900 text-emerald-500">合格</option>
                      <option value="退件" className="bg-zinc-900 text-red-500">退件</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-center">
                    <button 
                      onClick={() => deleteVehicle(v.id)}
                      className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addVehicle}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
            >
              <PlusIcon className="w-4 h-4" />
              新增車輛資料
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
