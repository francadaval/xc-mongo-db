import { LessThanModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnName } from './utils';

describe(LessThanModifier.name, () => {
    let modifierUnderTest: LessThanModifier;

    beforeEach(() => {
        modifierUnderTest = new LessThanModifier();
    });

    describe('getModifier', () => {
        it('should return modifier name', () => modifierShouldReturnName(modifierUnderTest))
    });

    describe('getCondition', () => {
        it('should return condition and shift arguments array', () => {
            const args = [1, 2, 3, 4];
            const condition = modifierUnderTest.getCondition(args);

            expect(condition).toEqual({$lt: 1});
            expect(args).toEqual([2, 3, 4]);
        });
    });
});