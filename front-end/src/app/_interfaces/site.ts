import { Frequency } from "../_helpers/frequency";

export interface Site {
	idSite: number,
    idUser: number,
    name: string,
    url: string,
	frequency: Frequency,
	nextDate: Date,
	toVisit: boolean,
	lastVisit: Date,
}
