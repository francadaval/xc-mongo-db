import { RepositoryMethodsBuilder } from '@src/repositories/builder/repo-method-builder'
import { MethodBuilder } from '@src/repositories/method-builders/method-builder'
import { FilterModifier } from '@src/repositories/filter-modifiers';
import { ParsedMethodGroup } from '@src/repositories/builder/method-name-parser';

const MOCk_MODIFIER = 'MockModifier';
const BUILDER_VERB = 'builderVerb';

const METHOD_NAME = 'builderVerbValueMockModifier';
const WRONG_VERB_METHOD_NAME = 'wrongVerbValueMockModifier';
const PROPERTIES = ['value'];

class MockBuilder extends MethodBuilder{
    getVerb = jest.fn(() => BUILDER_VERB);
    buildFuction = jest.fn((methodName: string, groups: ParsedMethodGroup[]) =>{
        return async function (...args) {}
    });
    setModifiers = jest.fn(() => {});
}

class MockModifier extends FilterModifier{
    getModifier = jest.fn(() => MOCk_MODIFIER);
    getCondition =  jest.fn((args: any[]) => {
        return {mock: true}
    });
}

describe(RepositoryMethodsBuilder.name, () => {
    let builderUnderTest: RepositoryMethodsBuilder;
    let mockedMethodBuilder: MethodBuilder;
    let mockedFilterModifier: FilterModifier;
    
    beforeEach(() => {
        // mocks.forEach(mock => mock.mockClear());
        builderUnderTest = new RepositoryMethodsBuilder();
        mockedMethodBuilder = new MockBuilder();
        mockedFilterModifier = new MockModifier();
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
        it('should delegate method building to MethodBuilder', () => {
            builderUnderTest.registerBuilder(mockedMethodBuilder);
            builderUnderTest.registerModifier(mockedFilterModifier);

            let result = builderUnderTest.buildRepositoryMethod(METHOD_NAME, PROPERTIES);

            expect(mockedMethodBuilder.setModifiers).toHaveBeenCalledWith({
                'MockModifier': mockedFilterModifier
            });
            expect(mockedMethodBuilder.buildFuction).toHaveBeenCalledTimes(1);
            expect(typeof result).toBe('function');
        })

        it('should throw error when method name is not parseable', () => {
            builderUnderTest.registerBuilder(mockedMethodBuilder);
            builderUnderTest.registerModifier(mockedFilterModifier);

            expect(() => {
                builderUnderTest.buildRepositoryMethod(WRONG_VERB_METHOD_NAME, PROPERTIES);
            }).toThrow(`Function ${WRONG_VERB_METHOD_NAME}: Not parseable, verb doesn't match.`);

            expect(mockedMethodBuilder.buildFuction).toHaveBeenCalledTimes(0);
        })
    });
});