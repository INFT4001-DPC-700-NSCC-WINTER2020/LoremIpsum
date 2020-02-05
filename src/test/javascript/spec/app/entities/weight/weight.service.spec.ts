import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { WeightService } from 'app/entities/weight/weight.service';
import { IWeight, Weight } from 'app/shared/model/weight.model';

describe('Service Tests', () => {
  describe('Weight Service', () => {
    let injector: TestBed;
    let service: WeightService;
    let httpMock: HttpTestingController;
    let elemDefault: IWeight;
    let expectedResult: IWeight | IWeight[] | boolean | null;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(WeightService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Weight(0, currentDate, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            datetime: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Weight', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            datetime: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            datetime: currentDate
          },
          returnedFromService
        );
        service
          .create(new Weight())
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp.body));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Weight', () => {
        const returnedFromService = Object.assign(
          {
            datetime: currentDate.format(DATE_FORMAT),
            weight: 1
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            datetime: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp.body));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Weight', () => {
        const returnedFromService = Object.assign(
          {
            datetime: currentDate.format(DATE_FORMAT),
            weight: 1
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            datetime: currentDate
          },
          returnedFromService
        );
        service
          .query()
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Weight', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
