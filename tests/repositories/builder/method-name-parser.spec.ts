import { MethodNameParser } from '@src/repositories/builder/method-name-parser'

const VERBS = ['findBy', 'deleteBy'];
const MODIFIERS = ['GreaterThan', 'LessThan'];
const PROPERTIES = ['value', 'name', 'questionsAndAnswers', 'testValue', 'testValue.index'];
const PROPERTIES_DB_NAMES = ['value', 'name', 'questionsAndAnswers', 'test_value', 'test_value.index'];
const METHOD_NAME = 'findByValueGreaterThan';
const COMPLEX_METHOD_NAME = 'deleteByNameAndValueGreaterThan';
const AND_TEST_METHOD_NAME = 'findByQuestionsAndAnswersAndValue';
const DB_NAME_METHOD_NAME = 'findByTestValue';
const NESTED_PROP_METHOD_NAME = 'findByTestValueIndex';
const OF_NESTED_PROP_METHOD_NAME = 'findByIndexOfTestValue';

describe(MethodNameParser.name, () => {
    let parserUnderTest: MethodNameParser;

    beforeEach(() => {
        parserUnderTest = new MethodNameParser(
            VERBS,
            MODIFIERS
        );
    });

    describe(`parse ${METHOD_NAME}`, () => {
        it('getVerb should return the verb', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);

            expect(verb).toBe('findBy');
        });

        it('getMatchedGroups should return correct property and modifier', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            
            expect(matchedGroups.length).toBe(1);
            
            const firstGroup = matchedGroups[0];
            
            expect(firstGroup.attribute).toBe('Value');
            expect(firstGroup.modifier).toBe('GreaterThan');
            expect(firstGroup.matchedDbProperty).toBe('value');
        });

        it('getMatchedGroups should return correct properties and modifiers on complex name', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(COMPLEX_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const firstGroup = matchedGroups[0];
            const secondGroup = matchedGroups[1];
            
            expect(matchedGroups.length).toBe(2);

            expect(firstGroup.attribute).toBe('Name');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('name');

            expect(secondGroup.attribute).toBe('Value');
            expect(secondGroup.modifier).toBe('GreaterThan');
            expect(secondGroup.matchedDbProperty).toBe('value');
        });

        it('getMatchedGroups should recognize names attributes names with "And"', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(AND_TEST_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const firstGroup = matchedGroups[0];
            const secondGroup = matchedGroups[1];
            
            expect(matchedGroups.length).toBe(2);

            expect(firstGroup.attribute).toBe('QuestionsAndAnswers');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('questionsAndAnswers');

            expect(secondGroup.attribute).toBe('Value');
            expect(secondGroup.modifier).toBeUndefined();
            expect(secondGroup.matchedDbProperty).toBe('value');
        });

        it('getMatchedGroups should match db property', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(DB_NAME_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const firstGroup = matchedGroups[0];
            
            expect(matchedGroups.length).toBe(1);

            expect(firstGroup.attribute).toBe('TestValue');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('test_value');
        });

        it('getMatchedGroups should recognize nested properties', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(NESTED_PROP_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const firstGroup = matchedGroups[0];
            
            expect(matchedGroups.length).toBe(1);

            expect(firstGroup.attribute).toBe('TestValueIndex');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('test_value.index');
        });

        it('getMatchedGroups should recognize nested properties with "Of"', () => {
            const [verb, matchedGroups] = parserUnderTest.parse(OF_NESTED_PROP_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const firstGroup = matchedGroups[0];
            
            expect(matchedGroups.length).toBe(1);

            expect(firstGroup.attribute).toBe('IndexOfTestValue');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('test_value.index');
        });
    });
});