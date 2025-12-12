
export interface ProjectItem {
  id: string;
  category: string;
  name: string;
  status: '未開始' | '進行中' | '已完成' | '暫停';
  startDate: string;
  days: number;
  endDate: string;
  progress: number;
  amount: number;
  paymentStatus: '已請款' | '未請款';
  owner: string;
  remark: string; // 新增備註欄位
}

export interface ProjectInfo {
  projectName: string;
  startDate: string;
  endDate: string;
  updatedDate: string; // 製表/更新日期
  siteManager: string; // 工地負責人
  safetyOfficer: string; // 職安人員
  qualityControl: string; // 品管人員
}

// 人員資料介面 (保持不變)
export interface Personnel {
  id: string;
  company: string;
  name: string;
  role: string;
  hasLaborInsurance: boolean;
  hasIdCard: boolean;
  hasPhysicalExam: boolean;
  hasSafetyTraining: boolean;
  hasSpecialLicense: boolean;
  applicationDate: string;
  entryDate: string;
  status: '審核中' | '合格' | '退件';
  note: string;
}

// 車輛資料介面 (保持不變)
export interface Vehicle {
  id: string;
  company: string;
  plateNumber: string;
  type: string;
  driver: string;
  hasRegistration: boolean;
  hasLicense: boolean;
  hasInsurance: boolean;
  hasPhoto: boolean;
  applicationDate: string;
  entryDate: string;
  accessArea: string;
  status: '審核中' | '合格' | '退件';
}
