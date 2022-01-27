import { Injectable, Param, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
//import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(@Param() createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    try {
      await user.save();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Verifique os valores informados.',
        },
        HttpStatus.BAD_REQUEST,
      );
      //return error;
    }
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  //update(id: string, updateUserDto: UpdateUserDto) {
  //  return `This action updates a #${id} user`;
  //}
}
