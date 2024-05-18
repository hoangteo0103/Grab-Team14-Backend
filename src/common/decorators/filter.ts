import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';
import { TimeFilters } from 'src/filter/filter.constant';

export const handleFilter = (request) => {
  const filterParams = {
    time: request.query.time,
    type: request.query.type,
    experience: request.query.experience,
    workingMode: request.query.workingMode,
    industry: request.query.industry,
    location: request.query.location,
  };
  // parse sort field, input: field1.asc_field2_desc
  if (_.isEmpty(filterParams.time)) {
    filterParams.time = NaN;
  }
  if (_.isEmpty(filterParams.type)) {
    filterParams.type = NaN;
  }
  if (_.isEmpty(filterParams.experience)) {
    filterParams.experience = NaN;
  }
  if (_.isEmpty(filterParams.workingMode)) {
    filterParams.workingMode = NaN;
  }
  if (_.isEmpty(filterParams.industry)) {
    filterParams.industry = NaN;
  }
  if (_.isEmpty(filterParams.location)) {
    filterParams.location = NaN;
  }
  return filterParams;
};

/**
 * decorator get filter params
 */
export const filter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return handleFilter(request);
  },
);
