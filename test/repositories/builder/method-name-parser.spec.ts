import { MethodNameParser } from '@src/repositories/builder/method-name-parser'

const VERBS = ['findBy', 'deleteBy'];
const MODIFIERS = ['GreaterThan', 'LessThan'];
const PROPERTIES = ['value', 'name', 'questionsAndAnswers', 'testValue', 'testValue.index'];
const PROPERTIES_DB_NAMES = ['value', 'name', 'questionsAndAnswers', 'test_value', 'test_value.index'];
const METHOD_NAME = 'findByValueGreaterThan';
const COMPLEX_METHOD_NAME = 'deleteByNameAndValueGreaterThan';
const AND_TEST_METHOD_NAME = 'findByQuestionsAndAnswersAndValue';

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
            let matchedGroups = parserUnderTest.getMatchedGroups();
            
            expect(matchedGroups.length).toBe(1);
            
            let firstGroup = matchedGroups[0];
            
            expect(firstGroup.attribute).toBe('Value');
            expect(firstGroup.modifier).toBe('GreaterThan');
            expect(firstGroup.matchedDbProperty).toBe('value');
        });

        it('getMatchedGroups should return correct properties and modifiers on complex name', () => {
            parserUnderTest.parse(COMPLEX_METHOD_NAME, PROPERTIES, PROPERTIES_DB_NAMES);
            let matchedGroups = parserUnderTest.getMatchedGroups();
            let firstGroup = matchedGroups[0];
            let secondGroup = matchedGroups[1];
            
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
            let matchedGroups = parserUnderTest.getMatchedGroups();
            let firstGroup = matchedGroups[0];
            let secondGroup = matchedGroups[1];
            
            expect(matchedGroups.length).toBe(2);

            expect(firstGroup.attribute).toBe('QuestionsAndAnswers');
            expect(firstGroup.modifier).toBeUndefined();
            expect(firstGroup.matchedDbProperty).toBe('questionsAndAnswers');

            expect(secondGroup.attribute).toBe('Value');
            expect(secondGroup.modifier).toBeUndefined();
            expect(secondGroup.matchedDbProperty).toBe('value');
        });
    });
});