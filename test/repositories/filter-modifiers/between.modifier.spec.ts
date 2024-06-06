import { BetweenModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnName } from './utils';

describe(BetweenModifier.name, () => {
    let modifierUnderTest: BetweenModifier;

    beforeEach(() => {
        modifierUnderTest = new BetweenModifier();
    });

    describe('getModifier', () => {
        it('should return modifier name', () => modifierShouldReturnName(modifierUnderTest));
    });

    describe('getCondition', () => {
        it('should return condition and shift arguments array', () => {
            const args = [1, 2, 3, 4];
            const condition = modifierUnderTest.getCondition(args);

            expect(condition).toEqual({$gt: 1, $lt: 2});
            expect(args).toEqual([3, 4]);
        });
    });
});
