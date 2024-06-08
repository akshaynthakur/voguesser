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

export interface NestedImageResult {
	node: {
		photosTout: {
			url: string;
		};
	};
}
