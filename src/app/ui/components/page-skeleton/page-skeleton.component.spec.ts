import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSkeletonComponent } from './page-skeleton.component';
import { Component } from '@angular/core';

@Component({
  selector: 'fit-test-page-skeleton',
  template: `<fit-page-skeleton title="Test Title">
    <div actions>Actions</div>
    <div content>Content</div></fit-page-skeleton
  >`,
})
class TestPageSkeletonComponent {}

describe('PageSkeletonComponent', () => {
  let component: TestPageSkeletonComponent;
  let fixture: ComponentFixture<TestPageSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSkeletonComponent],
      declarations: [TestPageSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPageSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Test Title');
  });

  it('should display the actions', () => {
    const actions = fixture.nativeElement.querySelector('div[actions]');
    expect(actions.textContent).toContain('Actions');
  });

  it('should display the content', () => {
    const content = fixture.nativeElement.querySelector('div[content]');
    expect(content.textContent).toContain('Content');
  });
});
