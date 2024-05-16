import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app.exception';
import { STATUS } from 'src/common/common.constant';
import { FilterService } from '../filter.service';

@Injectable()
export class FilterUpdateStatusPipe implements PipeTransform<any> {
  constructor(private readonly filterService: FilterService) {}
  async transform(value) {
    const { status } = value;
    if ([STATUS.INACTIVE].includes(status)) {
      const exist = await this.filterService.findOne(value._id);
      if (!exist) {
        throw new AppException({
          error: 'Filter not found',
          httpStatus: HttpStatus.NOT_FOUND,
          message: 'Filter not found',
        });
      }
    }

    return {
      status: value.status,
    };
  }
}
