import { RepositoryMethodsBuilder } from './repo-method-builder'
import { MethodBuilder } from '../method-builders/method-builder'
import { ParsedMethodGroup } from './method-name-parser';
import { FilterModifier } from '../filter-modifiers';

const MOCk_MODIFIER = 'MockModifier';
const BUILDER_VERB = 'builderVerb';

class MockBuilder extends MethodBuilder{
    getVerb = jest.fn(() => BUILDER_VERB);
    buildFuction = jest.fn((methodName: string, groups: ParsedMethodGroup[]) =>{
        return async function (...args) {}
    });
}

class MockModifier extends FilterModifier{
    getModifier = jest.fn(() => MOCk_MODIFIER);
    getCondition =  jest.fn((args: any[]) => {
        return {mock: true}
    });
}

describe(RepositoryMethodsBuilder.name, () => {
    let builderUnderTest: RepositoryMethodsBuilder;
    const mockedMethodBuilder = new MockBuilder();
    const mockedFilterModifier = new MockModifier();

    beforeEach(() => {
        // mocks.forEach(mock => mock.mockClear());
        builderUnderTest = new RepositoryMethodsBuilder();
    });

    describe('registerBuilder', () => {
        it('should register new verb without error', () => {
            builderUnderTest.registerBuilder(mockedMethodBuilder);

            expect(mockedMethodBuilder.getVerb).toHaveBeenCalledTimes(1);
        });

        it('should throw an error when the verb already exist', () => {
            builderUnderTest.registerBuilder(mockedMethodBuilder);
            expect(() => builderUnderTest.registerBuilder(mockedMethodBuilder)).toThrow(`Builder for '${BUILDER_VERB}' already exist.`);
            expect(mockedMethodBuilder.getVerb).toHaveBeenCalledTimes(2);
        });
    });

    describe('registerModifier', () => {
        it('should register new modifier without error', () => {
            builderUnderTest.registerModifier(mockedFilterModifier);

            expect(mockedFilterModifier.getModifier).toHaveBeenCalledTimes(1);
        });
        
        it('should throw an error when the modifier already exist', () => {
            builderUnderTest.registerModifier(mockedFilterModifier);
            expect(() => builderUnderTest.registerModifier(mockedFilterModifier)).toThrow(`Modifier for '${MOCk_MODIFIER}' already exist.`);
            expect(mockedFilterModifier.getModifier).toHaveBeenCalledTimes(2);
        });
    });

    describe('buildRepositoryMethod', () => {
        it('', () => {
            
        })
    });
});
