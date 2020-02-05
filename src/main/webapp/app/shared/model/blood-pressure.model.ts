import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IBloodPressure {
  id?: number;
  datetime?: Moment;
  systolic?: number;
  diastolic?: number;
  user?: IUser;
}

export class BloodPressure implements IBloodPressure {
  constructor(public id?: number, public datetime?: Moment, public systolic?: number, public diastolic?: number, public user?: IUser) {}
}
