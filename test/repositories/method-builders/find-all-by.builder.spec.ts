import { FindAllByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';

const FIND_RESULT = [];

describe(FindAllByBuilder.name, () => {
    let builderUnderTest: FindAllByBuilder;

    beforeEach(() => {
        builderUnderTest = new FindAllByBuilder();
        builderUnderTest.setModifiers(utils.MODIFIERS);
    });

    describe('getModifier', () => {
        it(
            'should return modifier name',
            () => utils.builderShouldReturnVerb(builderUnderTest)
        );
    });
    
    describe('buildMethod', () => {
        it('should return built method', () => {
            utils.mockedFindCursor.toArray.mockReturnValue(Promise.resolve(FIND_RESULT));
            utils.mockedCollection.find.mockReturnValue(utils.mockedFindCursor);
            utils.builderShouldReturnBuiltMethod(builderUnderTest, FIND_RESULT);
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});
