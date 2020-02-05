import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IWeight } from 'app/shared/model/weight.model';

type EntityResponseType = HttpResponse<IWeight>;
type EntityArrayResponseType = HttpResponse<IWeight[]>;

@Injectable({ providedIn: 'root' })
export class WeightService {
  public resourceUrl = SERVER_API_URL + 'api/weights';

  constructor(protected http: HttpClient) {}

  create(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .post<IWeight>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .put<IWeight>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWeight>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWeight[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(weight: IWeight): IWeight {
    const copy: IWeight = Object.assign({}, weight, {
      datetime: weight.datetime && weight.datetime.isValid() ? weight.datetime.format(DATE_FORMAT) : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.datetime = res.body.datetime ? moment(res.body.datetime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((weight: IWeight) => {
        weight.datetime = weight.datetime ? moment(weight.datetime) : undefined;
      });
    }
    return res;
  }
}
