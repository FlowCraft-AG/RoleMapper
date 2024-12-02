import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DataInputDTO {
    @Field(() => [DataInputDTO], { nullable: true })
    userId?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    processId?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    userType?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    userRole?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    orgUnit?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    active?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    users?: string[];

    @Field(() => [DataInputDTO], { nullable: true })
    functionName?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    name?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    roleId?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    roles?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    parentId?: string;

    @Field(() => [DataInputDTO], { nullable: true })
    supervisor?: string;
}
