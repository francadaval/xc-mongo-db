import { ParsedMethodGroup } from "@src/repositories/builder/method-name-parser";
import { GreaterThanModifier, LessThanModifier } from "@src/repositories/filter-modifiers";
import { MethodBuilder } from "@src/repositories/method-builders/method-builder";

import { Collection, FindCursor } from "mongodb";
import { mock } from "ts-jest-mocker";

export const MODIFIERS = {
    GreaterThan: new GreaterThanModifier(),
    LessThan: new LessThanModifier()
};
const gtGetCondition = jest.spyOn(MODIFIERS.GreaterThan, 'getCondition');
// const ltGetCondition = jest.spyOn(MODIFIERS.LessThan, 'getCondition');

const DUMMY_VALUE = 14;

const METHOD_NAME = 'verbValueGreaterThan';
const GROUPS: ParsedMethodGroup[] = [
    {
        attribute: 'Value',
        group: 'ValueGreaterThan',
        matchedDbProperty: 'attribute',
        modifier: 'GreaterThan'
    }
];
const EMPTY_GROUPS = [];

export const mockedCollection = mock<Collection>();
export const mockedFindCursor = mock<FindCursor>()

export function builderShouldReturnVerb(modifierUnderTest: MethodBuilder): void {
    const name = modifierUnderTest.getVerb();

    expect(typeof name).toBe('string');
    expect(name).not.toBe('');
    expect(name).not.toContain(' ');
}

export async function builderShouldReturnBuiltMethod(builderUnderTest: MethodBuilder, expectedResult: unknown, ...args: unknown[]) {
    args = args || [DUMMY_VALUE];
    const actualMethod = builderUnderTest.buildMethod(METHOD_NAME, GROUPS);
    const actualResult = await actualMethod.call({
        collection: mockedCollection
    }, ...args);

    expect(gtGetCondition).toHaveBeenCalled();
    expect(actualResult).toEqual(expectedResult);
}

export function shouldThrowErrorIfNoprovidedGroups(builderUnderTest: MethodBuilder) {
    const expectedErrorMessage = `${METHOD_NAME}: Attributes are required on a '${builderUnderTest.getVerb()}' method.`
    expect(() => builderUnderTest.buildMethod(METHOD_NAME, EMPTY_GROUPS)).toThrow(expectedErrorMessage);
}
