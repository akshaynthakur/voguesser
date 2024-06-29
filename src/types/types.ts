export interface ImageResult {
	fashionShowV2: {
		galleries: {
			collection: {
				slidesV2: {
					edges: NestedImageResult[];
				};
			};
		};
	};
}

interface NestedImageResult {
	node: {
		photosTout: {
			url: string;
		};
	};
}

export interface CollectionSlugResult {
	brand: {
		fashionShows: {
			fashionShow: NestedCollectionSlugResult[];
		};
	};
}

interface NestedCollectionSlugResult {
	slug: string;
}

export interface GameRound {
	brand_name: string;
	brand_slug: string;
	collection_slug: string;
	season: string;
	url: string;
}
