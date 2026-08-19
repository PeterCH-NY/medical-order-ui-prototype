import { Component } from '@angular/core';
import { MedicalOrder, ScreenMode } from './medical-order.model';

const INITIAL_SAVED_ITEMS: MedicalOrder[] = [
  {
    orderCode: '25004C',
    orderName: '外科病理檢查',
    medicalOrderCode: '25004',
    medicalOrderName: 'Surgical pathology Level IV',
    quantity: 1
  }
];

const AVAILABLE_ITEMS: MedicalOrder[] = [
  { orderCode: '25001C', orderName: '第一級外科病理,眼觀檢查', medicalOrderCode: '25001', medicalOrderName: 'Surgical pathology Level I', quantity: 1 },
  { orderCode: '25002C', orderName: '第二級外科病理,組織鏡檢確認', medicalOrderCode: '25002', medicalOrderName: 'Surgical pathology Level II', quantity: 1 },
  { orderCode: '25003C', orderName: '第三級外科病理,一般性', medicalOrderCode: '25003', medicalOrderName: 'Surgical pathology Level III', quantity: 1 },
  { orderCode: '25004C', orderName: '外科病理檢查', medicalOrderCode: '25004', medicalOrderName: 'Surgical pathology Level IV', quantity: 1 },
  { orderCode: '25024C', orderName: '第五級外科病理,中度複雜性', medicalOrderCode: '25024', medicalOrderName: 'Surgical pathology Level V', quantity: 1 },
  { orderCode: '25025C', orderName: '第六級外科病理,高度複雜性', medicalOrderCode: '25025', medicalOrderName: 'Surgical pathology Level VI', quantity: 1 },
  { orderCode: '25006B', orderName: '冰凍切片檢查', medicalOrderCode: '25006', medicalOrderName: 'Frozen section', quantity: 1 },
  { orderCode: '12195', orderName: '(健保)Her-2/neu 螢光原位雜交 FISH', medicalOrderCode: '12195', medicalOrderName: 'Her-2/neu in situ hybridization', quantity: 1 }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  windowOpen = false;
  mode: ScreenMode = 'view';
  selectedType = '25012';

  savedItems: MedicalOrder[] = this.cloneItems(INITIAL_SAVED_ITEMS);
  workingItems: MedicalOrder[] | null = null;
  readonly availableItems: MedicalOrder[] = this.cloneItems(AVAILABLE_ITEMS);

  selectedLeftIds = new Set<string>();
  selectedRightIds = new Set<string>();
  selectedLeftRowKeys: string[] = [];
  selectedRightRowKeys: string[] = [];

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get displayedLeftItems(): MedicalOrder[] {
    return this.isEditMode && this.workingItems ? this.workingItems : this.savedItems;
  }

  openWindow(): void {
    this.windowOpen = true;
    this.mode = 'view';
    this.workingItems = null;
    this.clearSelections();
  }

  closeWindow(): void {
    this.workingItems = null;
    this.mode = 'view';
    this.clearSelections();
    this.windowOpen = false;
  }

  enterEditMode(): void {
    if (this.isEditMode) {
      return;
    }
    this.workingItems = this.cloneItems(this.savedItems);
    this.mode = 'edit';
    this.clearSelections();
  }

  toggleLeft(item: MedicalOrder, checked: boolean): void {
    this.setChecked(this.selectedLeftIds, item.medicalOrderCode, checked);
  }

  toggleRight(item: MedicalOrder, checked: boolean): void {
    this.setChecked(this.selectedRightIds, item.medicalOrderCode, checked);
  }

  isLeftChecked(item: MedicalOrder): boolean {
    return this.selectedLeftIds.has(item.medicalOrderCode);
  }

  isRightChecked(item: MedicalOrder): boolean {
    return this.selectedRightIds.has(item.medicalOrderCode);
  }

  updateQuantity(item: MedicalOrder, value: number | string | null): void {
    if (!this.isEditMode) {
      return;
    }

    const quantity = Number(value);
    item.quantity = Number.isFinite(quantity) && quantity >= 1 ? Math.floor(quantity) : 1;
  }

  addSelectedItems(): void {
    if (!this.isEditMode || !this.workingItems) {
      return;
    }
    const existingCodes = new Set(this.workingItems.map(item => item.medicalOrderCode));
    const additions = this.availableItems
      .filter(item => this.selectedRightIds.has(item.medicalOrderCode) && !existingCodes.has(item.medicalOrderCode))
      .map(item => ({ ...item }));

    this.workingItems = [...this.workingItems, ...additions];
    this.selectedRightIds.clear();
  }

  deleteSelectedItems(): void {
    if (!this.isEditMode || !this.workingItems) {
      return;
    }
    this.workingItems = this.workingItems.filter(item => !this.selectedLeftIds.has(item.medicalOrderCode));
    this.selectedLeftIds.clear();
  }

  save(): void {
    if (!this.isEditMode || !this.workingItems) {
      return;
    }

    const committedItems = this.cloneItems(this.workingItems);
    this.downloadResultFile(committedItems);
    this.savedItems = committedItems;
    this.workingItems = null;
    this.clearSelections();
    this.mode = 'view';
  }

  buildResultText(items: MedicalOrder[]): string {
    const header = ['醫囑代碼', '醫囑名稱', '醫令代碼', '醫令名稱', '數量'];
    const rows = items.map(item => [
      item.orderCode,
      item.orderName,
      item.medicalOrderCode,
      item.medicalOrderName,
      String(item.quantity)
    ]);
    return [header, ...rows].map(row => row.join('\t')).join('\r\n');
  }

  private downloadResultFile(items: MedicalOrder[]): void {
    const text = this.buildResultText(items);
    const blob = new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RESULT.TXT';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private setChecked(selection: Set<string>, id: string, checked: boolean): void {
    if (!this.isEditMode) {
      return;
    }
    checked ? selection.add(id) : selection.delete(id);
  }

  private clearSelections(): void {
    this.selectedLeftIds.clear();
    this.selectedRightIds.clear();
    this.selectedLeftRowKeys = [];
    this.selectedRightRowKeys = [];
  }

  private cloneItems(items: MedicalOrder[]): MedicalOrder[] {
    return items.map(item => ({ ...item }));
  }
}
