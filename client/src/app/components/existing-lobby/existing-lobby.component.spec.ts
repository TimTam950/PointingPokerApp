import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingLobbyComponent } from './existing-lobby.component';

describe('ExistingLobbyComponent', () => {
  let component: ExistingLobbyComponent;
  let fixture: ComponentFixture<ExistingLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingLobbyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
