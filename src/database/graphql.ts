import { GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient(
	"https://graphql.vogue.com/graphql",
	{
		headers: {
			"Content-Type": "application/json",
			Host: "graphql.vogue.com",
			// "User-Agent":
			// 	"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1",
		},
	}
);
