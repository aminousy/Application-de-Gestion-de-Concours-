import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('devrait creer le composant racine', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("devrait exposer le titre 'SunuXam'", () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.titre).toEqual('SunuXam');
  });
});
