
export interface ProjectItem {
  id: string;
  category: string; // 新增分類欄位
  name: string;
  status: '未開始' | '進行中' | '已完成' | '暫停';
  startDate: string;
  days: number;
  endDate: string;
  progress: number;
  amount: number; // 金額
  paymentStatus: '已請款' | '未請款'; // 付款狀態
  owner: string;
}

export interface ProjectInfo {
  projectName: string;
  projectCode: string;
  contractor: string;
  startDate: string;
  endDate: string;
  duration: number;
  lastUpdated: string;
}

// 人員資料介面
export interface Personnel {
  id: string;
  company: string;       // 所屬公司
  name: string;          // 姓名
  role: string;          // 職稱/工種
  hasLaborInsurance: boolean; // 勞保
  hasIdCard: boolean;    // 身分證影本
  hasPhysicalExam: boolean;   // 體檢表
  hasSafetyTraining: boolean; // 一般工安教育訓練
  hasSpecialLicense: boolean; // 特殊作業證照
  applicationDate: string;    // 申請日期
  entryDate: string;          // 預計進場
  status: '審核中' | '合格' | '退件';
  note: string;
}

// 車輛資料介面
export interface Vehicle {
  id: string;
  company: string;       // 所屬公司
  plateNumber: string;   // 車牌號碼
  type: string;          // 車種 (吊車、貨車...)
  driver: string;        // 駕駛姓名
  hasRegistration: boolean; // 行照
  hasLicense: boolean;   // 駕照
  hasInsurance: boolean; // 保險卡
  hasPhoto: boolean;     // 車輛照片
  applicationDate: string;
  entryDate: string;
  accessArea: string;    // 申請進入區域
  status: '審核中' | '合格' | '退件';
}
