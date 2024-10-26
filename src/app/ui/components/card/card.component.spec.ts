import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { CardModule } from 'primeng/card';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <fit-card> Test content </fit-card> `,
})
class TestComponent {
  @ViewChild(CardComponent, { static: false }) child!: CardComponent;
}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent, CardModule],
      declarations: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render p-card component', () => {
    const cardElement = fixture.debugElement.query(By.css('p-card'));
    expect(cardElement).toBeTruthy();
  });

  it('should set header when provided', () => {
    fixture.componentRef.setInput('header', 'Test Header');

    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(By.css('.p-card-title'));
    expect(headerElement.nativeElement.textContent).toContain('Test Header');
  });

  it('should not render header when not provided', () => {
    fixture.componentRef.setInput('header', '');

    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(By.css('.p-card-title'));
    expect(headerElement).toBeNull();
  });

  it('should render content inside ng-content', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const contentElement = fixture.debugElement.query(
      By.css('.p-card-content'),
    );
    expect(contentElement.nativeElement.innerHTML).toContain('Test content');
  });
});
