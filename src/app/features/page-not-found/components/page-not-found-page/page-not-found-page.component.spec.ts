import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundPageComponent } from './page-not-found-page.component';
import { provideRouter } from '@angular/router';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { By } from '@angular/platform-browser';

describe('PageNotFoundPageComponent', () => {
  let component: PageNotFoundPageComponent;
  let fixture: ComponentFixture<PageNotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundPageComponent, LinkComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to dashboard on link click', () => {
    const linkElement = fixture.debugElement.query(By.css('a'));

    expect(linkElement.nativeElement.getAttribute('href')).toBe(
      '/app/dashboard',
    );
  });
});
