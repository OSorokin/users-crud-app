import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetLocaleComponent } from './set-locale.component';

describe('SetLocaleComponent', () => {
  let component: SetLocaleComponent;
  let fixture: ComponentFixture<SetLocaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetLocaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLocaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
