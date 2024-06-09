import { CollectionSlugResult, ImageResult } from "@/types/graphql";
import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient("https://graphql.vogue.com/graphql", {
	headers: {
		"Content-Type": "application/json",
		Host: "graphql.vogue.com",
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
	},
});

export async function fetchImage(collectionSlug: string) {
	try {
		const query =
			gql`
                { 
					fashionShowV2 (slug: "` +
			collectionSlug +
			`") { 
						galleries { 
							collection { 
								slidesV2 { 
									edges { 
										node { 
											... on CollectionSlide { 
												photosTout { 
													... on Image { 
														url 
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}`;
		const result: ImageResult = await graphQLClient.request(query);
		const images = result.fashionShowV2.galleries.collection.slidesV2.edges.map(
			(entry) => entry.node.photosTout.url
		);
		const shuffled = images.sort(() => 0.5 - Math.random());
		return shuffled[0];
	} catch (error) {
		throw new Error(
			`An error occurred when trying to fetch image: ${
				error instanceof Error ? error.message : error
			}`
		);
	}
}

export async function fetchCollectionSlug(brandSlug: string) {
	try {
		const query =
			gql`
			{
				brand(slug: "` +
			brandSlug +
			`") {
					fashionShows(first: 500) {
						fashionShow {
							slug
						}
					}
				}
			}
		`;
		const result: CollectionSlugResult = await graphQLClient.request(query);
		const collectionSlugs = result.brand.fashionShows.fashionShow
			.map((entry) => entry.slug)
			.filter(
				(slug) =>
					!slug.includes("resort") &&
					!slug.includes("pre-fall") &&
					!slug.includes("bridal")
			);
		const shuffled = collectionSlugs.sort(() => 0.5 - Math.random());
		return shuffled[0];
	} catch (error) {
		throw new Error(
			`An error occurred when trying to fetch collection slug: ${
				error instanceof Error ? error.message : error
			}`
		);
	}
}
