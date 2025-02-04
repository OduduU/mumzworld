import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Favorite } from './favorite.schema';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field(() => [Favorite])
  favorites: Favorite[];
}

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
