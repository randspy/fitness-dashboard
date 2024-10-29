import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarLinkComponent } from './sidebar-link.component';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import { Component, viewChild } from '@angular/core';
import { DummyComponent } from '../../../../tests/dummy-component';

@Component({
  template: ` <fit-sidebar-link> Test content </fit-sidebar-link> `,
})
class TestComponent {
  child = viewChild<SidebarLinkComponent>(SidebarLinkComponent);
}

describe('SidebarLinkComponent', () => {
  let component: SidebarLinkComponent;
  let fixture: ComponentFixture<SidebarLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLinkComponent, TooltipModule],
      providers: [
        provideRouter([
          {
            path: 'link',
            component: DummyComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarLinkComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', {
      label: 'label text',
      icon: 'lucideHouse',
      routerLink: '/link',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render link with provided item', () => {
    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement.attributes['ng-reflect-router-link']).toBe('/link');
  });

  it('should apply active class when route is active', async () => {
    const router = TestBed.inject(Router);

    await router.navigate(['/link']);

    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement.classes['text-accent']).toBeTruthy();
  });

  it('should project content inside the link', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).toContain('Test content');
  });

  it('should show tooltip with item label', () => {
    const linkElement = fixture.debugElement.query(By.css('a'));

    expect(linkElement.attributes['ng-reflect-content']).toBe('label text');
    expect(linkElement.attributes['tooltipPosition']).toBe('right');
  });
});
