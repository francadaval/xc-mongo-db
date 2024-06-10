import { FindOneByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';

const FIND_RESULT = {};

describe(FindOneByBuilder.name, () => {
    let builderUnderTest: FindOneByBuilder;

    beforeEach(() => {
        builderUnderTest = new FindOneByBuilder();
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
            utils.mockedCollection.findOne.mockReturnValue(Promise.resolve(FIND_RESULT));
            utils.builderShouldReturnBuiltmethod(builderUnderTest, FIND_RESULT)
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});
