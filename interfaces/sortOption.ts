import type { SortField, SortDirection } from "@constants/sortOptions";

export interface SortOption {
	readonly field: SortField;
	readonly direction: SortDirection;
	/* Visible text of the <option> */
	readonly label: string;
	/* <option value> and the `sort` key of the API request body, e.g. "name,asc" */
	readonly value: string;
}
