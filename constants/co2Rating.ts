/* CO₂ rating scale shown on product cards: A = most environmentally friendly, E = highest impact */
export enum Co2Rating {
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	E = 'E',
}

/* Best -> worst; the index is the rating's rank, so ratings can be compared numerically */
export const CO2_RATING_ORDER: readonly Co2Rating[] = Object.freeze([
	Co2Rating.A,
	Co2Rating.B,
	Co2Rating.C,
	Co2Rating.D,
	Co2Rating.E,
]);

export function co2RatingRank(rating: Co2Rating): number {
	return CO2_RATING_ORDER.indexOf(rating);
}

export function toCo2Rating(letter: string): Co2Rating {
	const rating = CO2_RATING_ORDER.find(r => r === letter.trim());
	if (!rating) {
		throw new Error(`Unknown CO₂ rating "${letter}", expected one of: ${CO2_RATING_ORDER.join(', ')}`);
	}
	return rating;
}
