export type PouchSize = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Cat {
  name: string;
  subscriptionActive: boolean;
  breed: string;
  pouchSize: PouchSize;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cats: Cat[];
}
