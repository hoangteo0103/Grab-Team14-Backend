import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationCustomInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        let { limit, page } = request.query;
        limit = Number(limit) > 0 ? Number(limit) : 10;
        page = Number(page) > 0 ? Number(page) : 1;

        const count = data[0].totalDocs;
        const pages = limit > 0 ? Math.ceil(count / limit) || 1 : null;

        return {
          docs: data[0].docs,
          totalDocs: count,
          limit: limit,
          totalPages: Math.ceil(count / limit) || 1,
          page: page,
          pagingCounter: (page - 1) * limit + 1,
          hasPrevPage: page > 1,
          hasNextPage: page < pages,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < pages ? page + 1 : null,
        };
      }),
    );
  }
}
