
import { CountByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';

const COUNT_RESULT = 0;

describe(CountByBuilder.name, () => {
    let builderUnderTest: CountByBuilder;

    beforeEach(() => {
        builderUnderTest = new CountByBuilder();
        builderUnderTest.setModifiers(utils.MODIFIERS);
    })

    describe('getModifier', () => {
        it(
            'should return modifier name',
            () => utils.builderShouldReturnVerb(builderUnderTest)
        );
    });

    describe('buildMethod', () => {
        it('should return built method', () => {
            utils.mockedCollection.countDocuments.mockReturnValue(Promise.resolve(COUNT_RESULT));
            utils.builderShouldReturnBuiltMethod(builderUnderTest, COUNT_RESULT);
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});
