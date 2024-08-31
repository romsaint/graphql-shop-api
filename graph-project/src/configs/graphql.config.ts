import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";

export const graphConnect = GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: 'schema.gql',
    sortSchema: true,
    buildSchemaOptions: {
        dateScalarMode: "timestamp"
    },
    context: ({req}) => ({req})
})