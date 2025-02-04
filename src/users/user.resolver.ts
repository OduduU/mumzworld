import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from './user.schema';
import { CreateUserInput } from './user.schema';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => User)
  async createAuthor(@Args('params') user: CreateUserInput) {
    return this.userService.create(user);
  }
}
