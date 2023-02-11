import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePieChartComponent } from './vote-pie-chart.component';

describe('PieChartComponent', () => {
  let component: VotePieChartComponent;
  let fixture: ComponentFixture<VotePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotePieChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
