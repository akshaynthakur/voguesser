import { CollectionSlugResult, GameRound, ImageResult } from "@/types/types";
import { gql } from "graphql-request";
import { graphQLClient } from "./graphql";
import supabase from "./supabase";

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
					!slug.includes("menswear") &&
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

export async function fetchRunway(numRounds: number) : Promise<GameRound[]> {
	let { data, error } = await supabase.rpc("get_game", {
		n: numRounds,
	});
	if (error) throw new Error('Cannot fetch game data');
	else return data;
}
