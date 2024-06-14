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
            parserUnderTest.parse(METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);

            expect(parserUnderTest.getVerb()).toBe('findBy');
        });

        it('getMatchedGroups should return correct property and modifier', () => {
            parserUnderTest.parse(METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const matchedGroups = parserUnderTest.getMatchedGroups();
            
            expect(matchedGroups.length).toBe(1);
            
            const firstGroup = matchedGroups[0];
            
            expect(firstGroup.attribute).toBe('Value');
            expect(firstGroup.modifier).toBe('GreaterThan');
            expect(firstGroup.matchedDbProperty).toBe('value');
        });

        it('getMatchedGroups should return correct properties and modifiers on complex name', () => {
            parserUnderTest.parse(COMPLEX_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const matchedGroups = parserUnderTest.getMatchedGroups();
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
            parserUnderTest.parse(AND_TEST_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const matchedGroups = parserUnderTest.getMatchedGroups();
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
            parserUnderTest.parse(DB_NAME_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const matchedGroups = parserUnderTest.getMatchedGroups();
            const firstGroup = matchedGroups[0];
            
            expect(matchedGroups.length).toBe(1);

            expect(firstGroup.attribute).toBe('TestValue');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('test_value');
        });

        it('getMatchedGroups should recognize nested properties', () => {
            parserUnderTest.parse(NESTED_PROP_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            const matchedGroups = parserUnderTest.getMatchedGroups();
            const firstGroup = matchedGroups[0];
            
            expect(matchedGroups.length).toBe(1);

            expect(firstGroup.attribute).toBe('TestValueIndex');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('test_value.index');
        });
    });
});