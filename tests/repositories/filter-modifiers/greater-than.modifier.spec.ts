import { GreaterThanModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnConditionAndShiftArgsArray, modifierShouldReturnName } from './utils';

describe(GreaterThanModifier.name, () => {
    let modifierUnderTest: GreaterThanModifier;

    beforeEach(() => {
        modifierUnderTest = new GreaterThanModifier();
    });

    describe('getModifier', () => {
        it(
            'should return modifier name',
            () => modifierShouldReturnName(modifierUnderTest)
        );
    });

    describe('getCondition', () => {
        it(
            'should return condition and shift arguments array',
            () => modifierShouldReturnConditionAndShiftArgsArray(modifierUnderTest, {$gt: 1}, 1)
        );
    });
});
