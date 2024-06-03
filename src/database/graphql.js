import { gql, GraphQLClient } from "graphql-request";

export default async function fetchImage(slug) {
	try {
		const graphQLClient = new GraphQLClient(
			"https://graphql.vogue.com/graphql",
			{
				headers: {
					"Content-Type": "application/json",
					Host: "graphql.vogue.com",
					"User-Agent":
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
				},
			}
		);
		const query =
			gql`
                { fashionShowV2 (slug: "` +
			slug +
			`") { galleries { collection { slideCount slidesV2 { edges { node { ... on CollectionSlide { photosTout { ... on Image { url }}}}}}}}}}`;
		const results = await graphQLClient.request(query);
		const count =
			results["fashionShowV2"]["galleries"]["collection"]["slideCount"];
		const images = results["fashionShowV2"]["galleries"]["collection"][
			"slidesV2"
		]["edges"].map((entry) => entry["node"]["photosTout"]["url"]);
		return {
			count: count,
			images: images,
		};
	} catch (e) {
		throw new Error("Unable to fetch runway image.");
	}
}
