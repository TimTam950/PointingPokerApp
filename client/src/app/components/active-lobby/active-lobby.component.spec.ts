import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveLobbyComponent } from './active-lobby.component';

describe('ActiveLobbyComponent', () => {
  let component: ActiveLobbyComponent;
  let fixture: ComponentFixture<ActiveLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveLobbyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
