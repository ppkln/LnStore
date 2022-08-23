import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUploadfileComponent } from './test-uploadfile.component';

describe('TestUploadfileComponent', () => {
  let component: TestUploadfileComponent;
  let fixture: ComponentFixture<TestUploadfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestUploadfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestUploadfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
