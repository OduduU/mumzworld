import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';

@ObjectType()
export class Favorite {
  @Field()
  id: number;

  @Field()
  city: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => User)
  author: User;

  @Field()
  authorId: string;
}
