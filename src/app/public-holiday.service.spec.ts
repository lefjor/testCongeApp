import { TestBed, inject } from '@angular/core/testing';

import { PublicHolidayService } from './public-holiday.service';

describe('PublicHolidayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicHolidayService]
    });
  });

  it('should ...', inject([PublicHolidayService], (service: PublicHolidayService) => {
    expect(service).toBeTruthy();
  }));
});
