import { LessThanEqualModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnConditionAndShiftArgsArray, modifierShouldReturnName } from './utils';

describe(LessThanEqualModifier.name, () => {
    let modifierUnderTest: LessThanEqualModifier;

    beforeEach(() => {
        modifierUnderTest = new LessThanEqualModifier();
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
            () => modifierShouldReturnConditionAndShiftArgsArray(modifierUnderTest, {$lte: 1}, 1)
        );
    });
});