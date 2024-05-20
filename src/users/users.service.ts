import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCVDto, UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
const { spawnSync } = require('child_process');
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    const docs = await this.userModel
      .aggregate([
        {
          $match: {
            $and: [{ role: { $ne: 'admin' } }],
          },
        },
      ])
      .exec();
    return docs;
  }

  async findFilter(queryObj: any) {
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`,
    );
    const users = await this.userModel.find(queryObj);
    return users;
  }

  async findById(id: any): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
  async findByEmail(email: string): Promise<UserDocument> {
    //return this.userModel.findOne({ email }).exec();
    const data = await this.userModel
      .aggregate([{ $match: { email: email } }, { $project: { email: 1 } }])
      .exec();
    return data[0];
  }
  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async updateRefreshtoken(id: string, updateUserDto): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto.refreshToken, { new: true })
      .exec();
  }

  async updateOptions(id: string, opts: Object): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, opts, { new: true }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updateCV(id: string, dto: UpdateCVDto) {
    // await this.userModel.findByIdAndUpdate(id, dto).exec();
    console.log(dto);
    const pythonProcess = await spawnSync('python', [
      'src/users/scripts/cv_script.py',
      'process_cv',
      dto.cvURL,
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    const res = JSON.parse(result);
    let error = pythonProcess.stderr?.toString()?.trim();
    if (result) {
      error = null;
    } else {
      throw new Error(error);
    }
    this.userModel
      .findByIdAndUpdate(id, { cvURL: dto.cvURL, skills: res.skills })
      .exec();
    return { result: res };
  }
}
