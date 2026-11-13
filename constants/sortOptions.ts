/* Sort options of the home page's `[data-test="sort"]` dropdown (values are what the <option> and the /products API body use) */

import type { SortOption } from "@interfaces/sortOption";

export enum SortField {
	NAME = 'name',
	PRICE = 'price',
	CO2_RATING = 'co2_rating',
}

export enum SortDirection {
	ASC = 'asc',
	DESC = 'desc',
}

function defineSortOption(field: SortField, direction: SortDirection, label: string): SortOption {
	return Object.freeze({ field, direction, label, value: `${field},${direction}` });
}

export const SORT_OPTIONS = Object.freeze({
	NAME_ASC: defineSortOption(SortField.NAME, SortDirection.ASC, 'Name (A - Z)'),
	NAME_DESC: defineSortOption(SortField.NAME, SortDirection.DESC, 'Name (Z - A)'),
	PRICE_DESC: defineSortOption(SortField.PRICE, SortDirection.DESC, 'Price (High - Low)'),
	PRICE_ASC: defineSortOption(SortField.PRICE, SortDirection.ASC, 'Price (Low - High)'),
	CO2_RATING_ASC: defineSortOption(SortField.CO2_RATING, SortDirection.ASC, 'CO₂ Rating (A - E)'),
	CO2_RATING_DESC: defineSortOption(SortField.CO2_RATING, SortDirection.DESC, 'CO₂ Rating (E - A)'),
});

/* Both directions of each field, handy for "pick one of the two" scenarios */
export const SORT_OPTIONS_BY_FIELD: Readonly<Record<SortField, readonly SortOption[]>> = Object.freeze({
	[SortField.NAME]: [SORT_OPTIONS.NAME_ASC, SORT_OPTIONS.NAME_DESC],
	[SortField.PRICE]: [SORT_OPTIONS.PRICE_DESC, SORT_OPTIONS.PRICE_ASC],
	[SortField.CO2_RATING]: [SORT_OPTIONS.CO2_RATING_ASC, SORT_OPTIONS.CO2_RATING_DESC],
});
