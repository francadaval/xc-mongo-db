import { FindAllByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';

const FIND_RESULT = [{},{}];
const EXPECTED = [{created: true},{created: true}];

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
        it('should return built method', async () => {
            utils.mockedFindCursor.toArray.mockReturnValue(Promise.resolve(FIND_RESULT));
            utils.mockedCollection.find.mockReturnValue(utils.mockedFindCursor);
            utils.mockedBaseRepository.createEntity.mockReturnValue({created: true});
            
            await utils.builderShouldReturnBuiltMethod(builderUnderTest, EXPECTED);

            expect(utils.mockedBaseRepository.createEntity).toHaveBeenCalledTimes(2);
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});
