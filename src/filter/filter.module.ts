import { Module } from '@nestjs/common';
import { FilterService } from './filter.service';
import { FilterController } from './filter.controller';
import { FilterOptionController } from './filter-option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Filter, FilterSchema } from './schemas/filter.schema';
import { SearchQuery, SearchQuerySchema } from './schemas/search-query.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Filter.name, schema: FilterSchema }]),
    MongooseModule.forFeature([
      { name: SearchQuery.name, schema: SearchQuerySchema },
    ]),
  ],
  controllers: [FilterController, FilterOptionController],
  providers: [FilterService],
})
export class FilterModule {}
