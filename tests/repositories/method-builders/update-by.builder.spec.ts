import { UpdateByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';

describe(UpdateByBuilder.name, () => {
    let builderUnderTest: UpdateByBuilder;

    beforeEach(() => {
        jest.clearAllMocks();
        builderUnderTest = new UpdateByBuilder();
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
            utils.mockedCollection.updateMany.mockReturnValue(Promise.resolve(void 0));
            utils.mockedBaseRepository.createEntityFromPlainObject.mockReturnValue({
                toDoc: () => ({newValue: 14})
            });

            utils.builderShouldReturnBuiltMethod(builderUnderTest, void 0, 15, {newValue: 14});
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});
