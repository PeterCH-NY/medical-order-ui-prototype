import { AppComponent } from './app.component';

describe('AppComponent state machine', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  it('opens in view mode with the initial saved item', () => {
    component.openWindow();
    expect(component.windowOpen).toBe(true);
    expect(component.mode).toBe('view');
    expect(component.displayedLeftItems.map(item => item.medicalOrderCode)).toEqual(['25004']);
  });

  it('creates an isolated working copy in edit mode', () => {
    component.enterEditMode();
    expect(component.mode).toBe('edit');
    expect(component.workingItems).not.toBe(component.savedItems);
    expect(component.workingItems![0]).not.toBe(component.savedItems[0]);
  });

  it('adds multiple items and prevents duplicates by medical order code', () => {
    component.enterEditMode();
    ['25001', '25003', '25004', '25025'].forEach(code => component.selectedRightIds.add(code));
    component.addSelectedItems();

    expect(component.workingItems!.map(item => item.medicalOrderCode)).toEqual(['25004', '25001', '25003', '25025']);
    expect(component.selectedRightIds.size).toBe(0);
  });

  it('deletes only selected working-copy items', () => {
    component.enterEditMode();
    ['25003', '25024'].forEach(code => component.selectedRightIds.add(code));
    component.addSelectedItems();
    ['25003', '25024'].forEach(code => component.selectedLeftIds.add(code));
    component.deleteSelectedItems();

    expect(component.workingItems!.map(item => item.medicalOrderCode)).toEqual(['25004']);
    expect(component.savedItems.map(item => item.medicalOrderCode)).toEqual(['25004']);
  });

  it('discards unsaved edits when closing and preserves saved state', () => {
    component.openWindow();
    component.enterEditMode();
    component.selectedRightIds.add('25024');
    component.addSelectedItems();
    component.closeWindow();
    component.openWindow();

    expect(component.mode).toBe('view');
    expect(component.displayedLeftItems.map(item => item.medicalOrderCode)).toEqual(['25004']);
  });

  it('creates UTF-8 tab-separated RESULT.TXT content', () => {
    const result = component.buildResultText(component.savedItems);
    expect(result).toContain('醫囑代碼\t醫囑名稱\t醫令代碼\t醫令名稱\t數量');
    expect(result).toContain('25004C\t外科病理檢查\t25004\tSurgical pathology Level IV\t1');
  });

  it('changes quantity only in the working copy and commits it on save', () => {
    spyOn<any>(component, 'downloadResultFile').and.stub();
    component.enterEditMode();
    component.updateQuantity(component.workingItems![0], 3);

    expect(component.workingItems![0].quantity).toBe(3);
    expect(component.savedItems[0].quantity).toBe(1);

    component.save();
    expect(component.savedItems[0].quantity).toBe(3);
    expect(component.mode).toBe('view');
  });

  it('normalizes invalid quantities and discards unsaved quantity changes', () => {
    component.enterEditMode();
    component.updateQuantity(component.workingItems![0], 0);
    expect(component.workingItems![0].quantity).toBe(1);

    component.updateQuantity(component.workingItems![0], 5);
    component.closeWindow();
    component.openWindow();
    expect(component.savedItems[0].quantity).toBe(1);
  });
});
