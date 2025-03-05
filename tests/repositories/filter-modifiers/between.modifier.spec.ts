import { BetweenModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnConditionAndShiftArgsArray, modifierShouldReturnName } from './utils';

describe(BetweenModifier.name, () => {
    let modifierUnderTest: BetweenModifier;

    beforeEach(() => {
        modifierUnderTest = new BetweenModifier();
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
            () => modifierShouldReturnConditionAndShiftArgsArray(modifierUnderTest, {$gt: 1, $lt: 2}, 2)
        );
    });
});
