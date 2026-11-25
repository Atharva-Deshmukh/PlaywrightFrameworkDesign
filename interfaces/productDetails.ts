/* Expected values for a product detail page. Every field is optional: only the ones passed are asserted. */
export interface ProductDetails {
	name?: string;
	price?: number;
	tags?: string[];
	quantity?: number;
}
