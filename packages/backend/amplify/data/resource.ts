import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  GameSession: a
    .model({
      id: a.id().required(),
      startedAt: a.datetime().required()
    })
    .authorization((allow) => [allow.publicApiKey()])
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 7
    }
  }
});
