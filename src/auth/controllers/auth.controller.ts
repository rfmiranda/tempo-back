import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { User } from '../entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Observable<User> {
    return this.authService.registerAccount(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() createUserDto: CreateUserDto): Observable<{ token: string }> {
    return this.authService
      .login(createUserDto)
      .pipe(map(({ token, user }) => ({ token, user })));
  }

  @UseGuards(JwtGuard)
  @Post('update-password')
  updatePassword(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Observable<User> {
    return this.authService.updatePassword(updateUserDto, req);
  }

  @Post('recovery-password')
  recoveryPassword(@Body() createUserDto: CreateUserDto): Observable<boolean> {
    return this.authService.recoveryPassword(createUserDto);
  }
}
