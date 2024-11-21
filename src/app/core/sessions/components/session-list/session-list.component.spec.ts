import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';

import { SessionListComponent } from './session-list.component';
import { By } from '@angular/platform-browser';
import { Session } from '../../domain/session.model';
import { DatePipe } from '@angular/common';
import { generateSession } from '../../../../../../setup-jest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SessionStore } from '../../store/sessions.store';
import { Subject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { SessionStoreService } from '../../../../features/sessions/service/session-store.service';
import { Component, inject, signal } from '@angular/core';

@Component({
  standalone: true,
  template: `<fit-session-list
    [sessions]="sessions()"
    [contentTemplate]="contentTemplate"
  >
    <ng-template #contentTemplate let-session>
      <div data-testid="projected-content">
        {{ session.name }}
      </div>
    </ng-template>
  </fit-session-list>`,
  imports: [SessionListComponent],
})
export class TestComponent {
  sessionStore = inject(SessionStore);
  sessions = signal<Session[]>([]);
}

describe('SessionListComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    const mockConfirmationService = {
      requireConfirmation$: new Subject(),
      confirm: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SessionListComponent, NoopAnimationsModule, TestComponent],
      providers: [provideRouter([]), SessionStoreService],
    })
      .overrideProvider(ConfirmationService, {
        useValue: mockConfirmationService,
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('sessions', []);
    fixture.detectChanges();
  });

  it('should display empty state when no sessions', () => {
    const emptyState = fixture.debugElement.query(
      By.css('[data-testid="empty-state"]'),
    );
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toBe('No sessions');
  });

  it('should display sessions when available', () => {
    const session: Session = generateSession({
      id: '1',
    });

    component.sessions.set([session]);
    fixture.detectChanges();

    const sessionElements = sessionsQuery();

    expect(sessionElements.length).toBe(1);
    expect(sessionElements[0].nativeElement.textContent).toContain(
      session.name,
    );
    expect(sessionElements[0].nativeElement.textContent).toContain(
      new DatePipe('en-US').transform(session.date),
    );
  });

  it('should display sessions in descending order', () => {
    const session1: Session = generateSession({
      id: '1',
    });
    const session2: Session = generateSession({
      id: '2',
    });

    component.sessions.set([session1, session2]);
    fixture.detectChanges();

    const sessionElements = sessionsQuery();

    expect(sessionElements.length).toBe(2);
    expect(sessionElements[0].nativeElement.textContent).toContain(
      session2.name,
    );
    expect(sessionElements[1].nativeElement.textContent).toContain(
      session1.name,
    );
  });

  it('should display projected content', () => {
    const session: Session = generateSession({
      id: '1',
    });

    component.sessions.set([session]);
    fixture.detectChanges();

    const projectedContent = fixture.debugElement.query(
      By.css('[data-testid="projected-content"]'),
    );
    expect(projectedContent.nativeElement.textContent).toContain(session.name);
  });

  const sessionsQuery = () =>
    fixture.debugElement.queryAll(By.css('[data-testid="session-item"]'));
});
