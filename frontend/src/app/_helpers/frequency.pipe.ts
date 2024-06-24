import { Pipe, PipeTransform } from '@angular/core';
import { Frequency } from './frequency';

@Pipe({
  name: 'frequencyPipe',
  standalone: true
})
export class FrequencyPipe implements PipeTransform {
  transform(value: string | Frequency, isShort = true): string {
    switch(value) {
        case Frequency.Daily:
            return isShort ? "daily" : "Quotidien";
            
        case Frequency.Weekly:
            return isShort ? "weekly" : "Hebdomadaire";
            
        case Frequency.Monthly:
            return isShort ? "monthly" : "Mensuel";
            
        case Frequency.Yearly:
            return isShort ? "yearly" : "Annuel";

        default:
            return value as string;
    }
  }
}
