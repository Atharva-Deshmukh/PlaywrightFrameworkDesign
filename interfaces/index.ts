/*
	What is a barrel file?
	A barrel file is an index.ts that re-exports everything from a folder, so the folder can be imported from one single path.

	Utility:

	Lets you write
		import type { RentalItem, SortOption } from "@interfaces";
		
	instead of one import per file
		import type { RentalItem } from "@interfaces/rentalItem";
		import type { SortOption } from "@interfaces/sortOption";

	The "@interfaces" alias in tsconfig.json points to this file ("interfaces/index").
	Add a re-export line here whenever a new interface file is created in this folder.
*/

export type { RentalItem } from "./rentalItem";
export type { SortOption } from "./sortOption";
