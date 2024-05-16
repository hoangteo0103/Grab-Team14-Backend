import { Injectable } from '@nestjs/common';

@Injectable()
export class JobService {
  findAll() {
    return `This action returns all job`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }
}
