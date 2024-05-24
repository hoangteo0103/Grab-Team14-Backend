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
  // parse sort field, input: field1.asc_field2_descs
  if (_.isEmpty(filterParams.time)) {
    filterParams.time = null;
  }
  if (_.isEmpty(filterParams.type)) {
    filterParams.type = null;
  }
  if (_.isEmpty(filterParams.experience)) {
    filterParams.experience = null;
  }
  if (_.isEmpty(filterParams.workingMode)) {
    filterParams.workingMode = null;
  }
  if (_.isEmpty(filterParams.industry)) {
    filterParams.industry = null;
  }
  if (_.isEmpty(filterParams.location)) {
    filterParams.location = null;
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
