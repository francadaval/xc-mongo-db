import { LessThanEqualModifier } from '@src/repositories/filter-modifiers'

describe(LessThanEqualModifier.name, () => {
    let modifierUnderTest: LessThanEqualModifier;

    beforeEach(() => {
        modifierUnderTest = new LessThanEqualModifier();
    });

    describe('getModifier', () => {
        it('should return modifier name', () => {
            const name = modifierUnderTest.getModifier();

            expect(typeof name).toBe('string');
            expect(name).not.toBe('');
            expect(name).not.toContain(' ');
        })
    });

    describe('getCondition', () => {
        it('should return condition and shift arguments array', () => {
            const args = [1, 2, 3, 4];
            const condition = modifierUnderTest.getCondition(args);

            expect(condition).toEqual({$lte: 1});
            expect(args).toEqual([2, 3, 4]);
        });
    });
});