import map from 'lodash-es/map';
import { User } from 'src/store/users';

export interface ITask {
  id: number;
  title: string;
  description: string;
  value: number;
  users: User[];
}

export class Task implements ITask {
  public id: number;
  public title: string;
  public description: string;
  public value: number;
  public users: User[] = [];

  constructor(initial?: object) {
    map(initial, (val: any, key: string) => {
      if (key === 'users') {
        this[key] = val.map((user: Partial<User>) => new User(user));
        return;
      }
      this[key] = val;
    });
  }
}
