import { RepositoryMethodsBuilder } from "@src/repositories/builder/repo-method-builder";
import { FilterModifierProviders, GreaterThanEqualModifier, GreaterThanModifier } from "@src/repositories/filter-modifiers";

describe('FilterModifierProviders', () => {
    it('should return an array of factory providers', () => {
        // Arrange
        const builderTypes = [GreaterThanModifier, GreaterThanEqualModifier];
        const expected = [
            {
                provide: GreaterThanModifier,
                useFactory: expect.any(Function),
                inject: [RepositoryMethodsBuilder]
            },
            {
                provide: GreaterThanEqualModifier,
                useFactory: expect.any(Function),
                inject: [RepositoryMethodsBuilder]
            }
        ];

        // Act
        const actual = FilterModifierProviders(builderTypes);

        // Assert
        expect(actual).toEqual(expected);
    });

    it('factory should create and register modifier', () => {
        // Arrange
        const builderTypes = [GreaterThanModifier];
        const methodsBuilder = {
            registerModifier: jest.fn()
        };
        const factory = FilterModifierProviders(builderTypes)[0];
        const expected = expect.any(GreaterThanModifier);

        // Act
        const actual = factory.useFactory(methodsBuilder);

        // Assert
        expect(actual).toEqual(expected);
        expect(methodsBuilder.registerModifier).toHaveBeenCalledWith(actual);
    });
});
