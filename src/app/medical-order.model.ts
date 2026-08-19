export interface MedicalOrder {
  orderCode: string;
  orderName: string;
  medicalOrderCode: string;
  medicalOrderName: string;
  quantity: number;
}

export type ScreenMode = 'view' | 'edit';
