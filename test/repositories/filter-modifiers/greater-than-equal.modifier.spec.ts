import { GreaterThanEqualModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnConditionAndShiftArgsArray, modifierShouldReturnName } from './utils';

describe(GreaterThanEqualModifier.name, () => {
    let modifierUnderTest: GreaterThanEqualModifier;

    beforeEach(() => {
        modifierUnderTest = new GreaterThanEqualModifier();
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
            () => modifierShouldReturnConditionAndShiftArgsArray(modifierUnderTest, {$gte: 1}, 1)
        );
    });
});
