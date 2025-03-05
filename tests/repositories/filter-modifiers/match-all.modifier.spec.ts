import { MatchAllModifier } from '@src/repositories/filter-modifiers'
import { modifierShouldReturnConditionAndShiftArgsArray, modifierShouldReturnName } from './utils';

describe(MatchAllModifier.name, () => {
    let modifierUnderTest: MatchAllModifier;

    beforeEach(() => {
        modifierUnderTest = new MatchAllModifier();
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
            () => modifierShouldReturnConditionAndShiftArgsArray(modifierUnderTest, {$all: 1}, 1)
        );
    });
});
