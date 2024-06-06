import { MethodNameParser } from './method-name-parser'

const VERBS = ['find', 'delete'];
const MODIFIERS = ['GreaterThan', 'LessThan'];
const METHOD_NAME = 'findValueGreaterThan';
const PROPERTIES = ['value', 'data'];

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
            parserUnderTest.parse(METHOD_NAME, PROPERTIES);

            expect(parserUnderTest.getVerb()).toBe('find');
        });

        it('getMatchedGroups should return correct property and modifier', () => {
            parserUnderTest.parse(METHOD_NAME, PROPERTIES);
            let matchedGroups = parserUnderTest.getMatchedGroups();
            
            expect(matchedGroups.length).toBe(1);
            
            let firstGroup = matchedGroups[0];
            
            expect(firstGroup.attribute).toBe('Value');
            expect(firstGroup.modifier).toBe('GreaterThan');
            expect(firstGroup.matchedProperty).toBe('value');
        });
    });
});