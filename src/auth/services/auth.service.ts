import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User, UserDocument } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Request } from 'express';
//import { User } from '../models/user.class';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 10));
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userModel.findOne({ email })).pipe(
      switchMap((user: CreateUserDto) => {
        return of(!!user);
      }),
    );
  }

  registerAccount(user: CreateUserDto): Observable<User> {
    const { email, pass } = user;

    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'Email já cadastrado',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(pass).pipe(
          switchMap(() => {
            const userm = new this.userModel(user);
            userm.createAt = new Date();
            return from(userm.save()).pipe(
              map((user: CreateUserDto) => {
                user.pass = undefined;
                return user;
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(email: string, pass: string): Observable<User> {
    return from(this.userModel.findOne({ email })).pipe(
      switchMap((user: CreateUserDto) => {
        if (!user) {
          throw new HttpException(
            { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
            HttpStatus.FORBIDDEN,
          );
        }
        return from(bcrypt.compare(pass, user.pass)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.pass;
              return user;
            } else {
              throw new HttpException(
                { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
                HttpStatus.FORBIDDEN,
              );
            }
          }),
        );
      }),
    );
  }

  login(
    createUserDto: CreateUserDto,
  ): Observable<{ token: string; user: CreateUserDto }> {
    const { email, pass } = createUserDto;
    return this.validateUser(email, pass).pipe(
      switchMap((user: CreateUserDto) => {
        if (user) {
          // create JWT - credentials
          return from(this.jwtService.signAsync({ user })).pipe(
            map((token: string) => {
              user.pass = undefined;
              user['__v'] = undefined;

              return { token, user };
            }),
          );
        }
      }),
    );
  }

  updatePassword(user: UpdateUserDto, req: Request): Observable<User> {
    const { pass } = user;
    if (req.user) {
      return this.doesUserExist(req.user['email']).pipe(
        tap((doesUserExist: boolean) => {
          if (!doesUserExist)
            throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        }),
        switchMap(() => {
          return this.hashPassword(pass).pipe(
            switchMap((hash: string) => {
              return from(
                this.userModel
                  .findByIdAndUpdate(req.user['_id'], {
                    $set: { pass: hash },
                  })
                  .exec(),
              ).pipe(
                map((user: User) => {
                  user.pass = undefined;
                  return user;
                }),
              );
            }),
          );
        }),
      );
    }
    throw new HttpException('Error', HttpStatus.BAD_REQUEST);
  }

  recoveryPassword(createUserDto: CreateUserDto): Observable<boolean> {
    return this.doesUserExist(createUserDto.email).pipe(
      tap((doesUserExist: boolean) => {
        if (!doesUserExist)
          throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }),
      map(() => {
        return true;
      }),
    );
  }

  getJwtUser(jwt: string): Observable<User | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: User }) => {
        return user;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }
}
