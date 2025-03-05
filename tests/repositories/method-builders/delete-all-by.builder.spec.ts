import { DeleteAllByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';
import { DeleteResult } from 'mongodb';

const DELETE_RESULT: DeleteResult = {
    acknowledged: true,
    deletedCount: 1
};

describe(DeleteAllByBuilder.name, () => {
    let builderUnderTest: DeleteAllByBuilder;

    beforeEach(() => {
        builderUnderTest = new DeleteAllByBuilder();
        builderUnderTest.setModifiers(utils.MODIFIERS);
    });

    describe('getVerb', () => {
        it(
            'should return verb name',
            () => utils.builderShouldReturnVerb(builderUnderTest)
        );
    });
    
    describe('buildMethod', () => {
        it('should return built method', () => {
            utils.mockedCollection.deleteMany.mockReturnValue(Promise.resolve(DELETE_RESULT));
            utils.builderShouldReturnBuiltMethod(builderUnderTest, DELETE_RESULT.deletedCount);
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});