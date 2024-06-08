import { ImageResult } from "@/app/types/graphql";
import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient("https://graphql.vogue.com/graphql", {
	headers: {
		"Content-Type": "application/json",
		Host: "graphql.vogue.com",
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
	},
});

export async function fetchImage(slug: string) {
	try {
		const query =
			gql`
                { fashionShowV2 (slug: "` +
			slug +
			`") { galleries { collection { slidesV2 { edges { node { ... on CollectionSlide { photosTout { ... on Image { url }}}}}}}}}}`;
		const result: ImageResult = await graphQLClient.request(query);
		const images = result["fashionShowV2"]["galleries"]["collection"][
			"slidesV2"
		]["edges"].map((entry) => entry["node"]["photosTout"]["url"]);
		const shuffled = images.sort(() => 0.5 - Math.random());
		return shuffled[0];
	} catch (e) {
		throw new Error("Unable to fetch runway image.");
	}
}

export async function fetchCollectionSlugs(brandSlugs: string[]) {
	try {
	} catch (e) {
		throw new Error("Unable to fetch collection slugs.");
	}
}
