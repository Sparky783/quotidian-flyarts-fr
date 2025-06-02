import { Frequency } from "../_helpers/frequency";

export interface Site {
  // In database
  idSite: number,
  idUser: number,
  name: string,
  url: string,
  frequency: Frequency,
  nextDate: Date,
  lastVisit: Date,

  // Computed
  toVisit: boolean
}