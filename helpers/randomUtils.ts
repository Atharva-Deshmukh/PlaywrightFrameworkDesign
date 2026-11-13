/* Picks a random element; the caller should log/report the pick so a failing run can be reproduced */
export function pickRandom<T>(items: readonly T[]): T {
	if (items.length === 0) {
		throw new Error('pickRandom: cannot pick from an empty list');
	}
	return items[Math.floor(Math.random() * items.length)];
}

/* Random integer in [0, exclusiveMax) */
export function randomIndex(exclusiveMax: number): number {
	if (exclusiveMax <= 0) {
		throw new Error(`randomIndex: exclusiveMax must be > 0, got ${exclusiveMax}`);
	}
	return Math.floor(Math.random() * exclusiveMax);
}
