import { HttpStatus } from '@nestjs/common';

export enum Status {
  SAVED = 'SAVED',
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  INTERVIEWED = 'INTERVIEWED',
}
