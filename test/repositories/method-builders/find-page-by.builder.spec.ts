import { FindPageByBuilder } from '@src/repositories/method-builders';
import * as utils from './utils';
import { Page, PageRequest } from '@src/pagination';

const COUNT_RESULT = 10;
const PAGE_REQUEST: PageRequest = {
    page_index: 2,
    page_size: 5
}
const FIND_RESULT: Page<any> = {
    items: [],
    total_size: 10,
    page_size: 5,
    page_index: 2
};
const DUMMY_PARAM = 14;

describe(FindPageByBuilder.name, () => {
    let builderUnderTest: FindPageByBuilder;

    beforeEach(() => {
        builderUnderTest = new FindPageByBuilder();
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
            utils.mockedCollection.countDocuments.mockReturnValue(Promise.resolve(COUNT_RESULT));
            utils.mockedFindCursor.toArray.mockReturnValue(Promise.resolve(FIND_RESULT.items));
            utils.mockedCollection.find.mockReturnValue(utils.mockedFindCursor);
            utils.mockedCollection.findOne.mockReturnValue(Promise.resolve(FIND_RESULT));

            utils.builderShouldReturnBuiltmethod(builderUnderTest, FIND_RESULT, DUMMY_PARAM, PAGE_REQUEST);
        });

        it(
            'should throw error if no parsed groups have been provided',
            () => utils.shouldThrowErrorIfNoprovidedGroups(builderUnderTest)
        );
    });
});
