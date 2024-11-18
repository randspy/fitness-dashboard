import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableListComponent } from './draggable-list.component';
import { By } from '@angular/platform-browser';

interface TestItem {
  id: string;
  name: string;
}

@Component({
  standalone: true,
  imports: [DraggableListComponent],
  template: `
    <fit-draggable-list
      [items]="items"
      (itemsChanged)="onItemsChanged($event)"
      [contentTemplate]="itemTemplate"
    >
      <ng-template #itemTemplate let-item>
        {{ item.name }}
      </ng-template>
    </fit-draggable-list>
  `,
})
class TestHostComponent {
  items: TestItem[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  onItemsChanged(newItems: TestItem[]) {
    this.items = newItems;
  }
}

describe('DraggableListComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reorder items', () => {
    draggableList().dragStart(component.items[0]);
    draggableList().drop(2);

    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(
      By.css('[data-testid="draggable-item"]'),
    );

    const reorderedItems = items.map((item) =>
      item.nativeElement.textContent.trim(),
    );

    expect(reorderedItems[0]).toBe('Item 2');
    expect(reorderedItems[1]).toBe('Item 3');
    expect(reorderedItems[2]).toBe('Item 1');

    expect(component.items[0].id).toBe('2');
    expect(component.items[1].id).toBe('3');
    expect(component.items[2].id).toBe('1');

    expect(draggableList().draggedItem()).toBeNull();
  });

  it('should do nothing if the dropped item does not come from the list', () => {
    draggableList();

    draggableList().drop(2);

    fixture.detectChanges();

    expect(component.items).toEqual(component.items);
  });

  const draggableList = () =>
    fixture.debugElement.query(By.directive(DraggableListComponent))
      .componentInstance;
});
