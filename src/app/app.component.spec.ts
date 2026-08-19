import { AppComponent } from './app.component';
import { MedicalOrder } from './medical-order.model';

describe('AppComponent state machine', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  function item(code: string): MedicalOrder {
    return component.availableItems.find(candidate => candidate.medicalOrderCode === code)!;
  }

  function doubleClick(rowIndex: number): MouseEvent {
    const row = { getAttribute: () => String(rowIndex) };
    const target = {
      closest: (selector: string) => selector.indexOf('tr[') === 0 ? row : null
    };
    return { target } as any;
  }

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

  it('ignores right-grid double-clicks in view mode', () => {
    component.onRightGridDoubleClick(doubleClick(4));

    expect(component.displayedLeftItems.map(row => row.medicalOrderCode)).toEqual(['25004']);
  });

  it('ignores left-grid double-clicks in view mode', () => {
    component.onLeftGridDoubleClick(doubleClick(0));

    expect(component.displayedLeftItems.map(row => row.medicalOrderCode)).toEqual(['25004']);
  });

  it('adds only the double-clicked right-grid row without changing checkbox selection', () => {
    component.enterEditMode();
    component.selectedRightIds.add('25001');

    component.onRightGridDoubleClick(doubleClick(4));

    expect(component.workingItems!.map(row => row.medicalOrderCode)).toEqual(['25004', '25024']);
    expect(Array.from(component.selectedRightIds)).toEqual(['25001']);
  });

  it('prevents duplicates when a right-grid row is double-clicked', () => {
    component.enterEditMode();

    component.onRightGridDoubleClick(doubleClick(3));

    expect(component.workingItems!.map(row => row.medicalOrderCode)).toEqual(['25004']);
  });

  it('removes only the double-clicked left-grid row without using other checked rows', () => {
    component.enterEditMode();
    ['25002', '25024'].forEach(code => component.selectedRightIds.add(code));
    component.addSelectedItems();
    component.selectedLeftIds.add('25002');
    component.selectedLeftIds.add('25024');

    component.onLeftGridDoubleClick(doubleClick(0));

    expect(component.workingItems!.map(row => row.medicalOrderCode)).toEqual(['25002', '25024']);
    expect(Array.from(component.selectedLeftIds)).toEqual(['25002', '25024']);
  });

  it('ignores double-clicks on interactive controls inside a row', () => {
    component.enterEditMode();
    const event = {
      target: { closest: (selector: string) => selector.indexOf('input') === 0 ? {} : null }
    } as any;

    component.onRightGridDoubleClick(event);
    component.onLeftGridDoubleClick(event);

    expect(component.workingItems!.map(row => row.medicalOrderCode)).toEqual(['25004']);
  });

  it('saves double-click changes to the saved state and result content', () => {
    spyOn<any>(component, 'downloadResultFile').and.callFake((items: MedicalOrder[]) => {
      expect(component.buildResultText(items)).toContain('25024');
      expect(component.buildResultText(items)).not.toContain('25004C');
    });
    component.enterEditMode();
    component.onRightGridDoubleClick(doubleClick(4));
    component.onLeftGridDoubleClick(doubleClick(0));

    component.save();

    expect(component.savedItems.map(row => row.medicalOrderCode)).toEqual(['25024']);
    expect(component.mode).toBe('view');
  });

  it('discards double-click changes when closing without saving', () => {
    component.openWindow();
    component.enterEditMode();
    component.onRightGridDoubleClick(doubleClick(4));
    component.onLeftGridDoubleClick(doubleClick(0));
    component.closeWindow();

    component.openWindow();

    expect(component.displayedLeftItems.map(row => row.medicalOrderCode)).toEqual(['25004']);
  });
});
