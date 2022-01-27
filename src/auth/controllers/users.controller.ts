import {
  Controller,
  Get,
  Post,
  Body,
  //Patch,
  Param,
  //Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
//import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return req.user;
  }

  //@Get()
  //findAll() {
  //  return this.usersService.findAll();
  //}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }*/
}
