import { Frequency } from "../_helpers/frequency";

export interface Site {
	id: number,
    userId: number,
    name: string,
    url: string,
	frequency: Frequency,
	nextDate: Date,
	toVisit: boolean,
	lastVisit: Date,
}
