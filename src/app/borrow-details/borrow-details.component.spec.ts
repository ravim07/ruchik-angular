import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowDetailsComponent } from './borrow-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute  } from '@angular/router';

describe('BorrowDetailsComponent', () => {
  let component: BorrowDetailsComponent;
  let fixture: ComponentFixture<BorrowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BorrowDetailsComponent ],
      imports: [MatDialogModule, HttpClientTestingModule, RouterModule, ActivatedRoute ],
      // providers: [ActivatedRoute ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
