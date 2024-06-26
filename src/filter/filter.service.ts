import { Injectable } from '@nestjs/common';
import { CreateFilterDto } from './dto/create-filter.dto';
import {
  FilterUpdateStatusDto,
  UpdateFilterDto,
} from './dto/update-filter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Filter, FilterDocument } from './schemas/filter.schema';
import { Model } from 'mongoose';
import {
  SearchQuery,
  SearchQueryDocument,
} from './schemas/search-query.schema';

@Injectable()
export class FilterService {
  constructor(
    @InjectModel(Filter.name) private filterModel: Model<FilterDocument>,
    @InjectModel('search_queries')
    private searchQueryModel: Model<SearchQueryDocument>,
  ) {}

  create(createFilterDto: CreateFilterDto) {
    const createdFilter = new this.filterModel(createFilterDto);

    if (
      !this.searchQueryModel.findOne({
        location: createFilterDto.location,
        keyword: createFilterDto.keyword,
        experience: createFilterDto.experience,
        time: createFilterDto.time,
        type: createFilterDto.type,
        workingMode: createFilterDto.workingMode,
        industry: createFilterDto.industry,
      })
    ) {
      this.searchQueryModel.create({
        location: createFilterDto.location,
        keyword: createFilterDto.keyword,
        experience: createFilterDto.experience,
        time: createFilterDto.time,
        type: createFilterDto.type,
        workingMode: createFilterDto.workingMode,
        industry: createFilterDto.industry,
      });
    }
    return createdFilter.save();
  }

  findAll(userId: string) {
    return this.filterModel.find({ user: userId }, { id: 1, name: 1 }).exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} filter`;
  }

  update(id: string, updateFilterDto: UpdateFilterDto) {
    return this.filterModel.findByIdAndUpdate(id, updateFilterDto).exec();
  }

  updateStatusById(id: string, dto: FilterUpdateStatusDto) {
    return this.filterModel.findOneAndUpdate({ _id: id }, dto);
  }

  remove(id: string) {
    return this.filterModel.findByIdAndDelete(id).exec();
  }
}
