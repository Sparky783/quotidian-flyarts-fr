import { Frequency } from './frequency';
import { FrequencyPipe } from './frequency.pipe';

describe('FrequencyPipe', () => {
    it('create an instance', () => {
        // Prepare
        const pipe = new FrequencyPipe();

        // Assert
        expect(pipe).toBeTruthy();
    });

    it('should return a short value', () => {
        // Prepare
        const pipe = new FrequencyPipe();

        // Run test
        let result = pipe.transform(Frequency.Monthly, true);

        // Assert
        expect(result).toEqual("monthly");
    });

    it('should return a long value', () => {
        // Prepare
        const pipe = new FrequencyPipe();

        // Run test
        let result = pipe.transform(Frequency.Weekly, false);

        // Assert
        expect(result).toEqual("Hebdomadaire");
    });
});
