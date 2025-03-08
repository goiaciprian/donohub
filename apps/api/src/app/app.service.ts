import { type User } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import { TestDto } from '@donohub/shared';

@Injectable()
export class AppService {
  getData(user: User): TestDto {
    return { message: `Hello ${user.fullName}` };
  }
}
