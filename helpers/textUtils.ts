/* "$1,234.50" / " $73.59 " / "73.59" -> number */
export function parsePrice(text: string): number {
	const price = Number(text.replace(/[^0-9.]/g, ''));
	if (Number.isNaN(price) || text.trim() === '') {
		throw new Error(`Could not parse a price from "${text}"`);
	}
	return price;
}

/* Collapses the surrounding/inner whitespace Angular templates leave in text nodes (e.g. " Belt Sander ") */
export function normalizeText(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}
