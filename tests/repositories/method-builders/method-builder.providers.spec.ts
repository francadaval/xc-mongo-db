import { RepositoryMethodsBuilder } from '@src/repositories/builder/repo-method-builder';
import { CountByBuilder, MethodBuilderProviders } from '@src/repositories/method-builders';


describe('MethodBuilderProviders', () => {
    it('should return an array of factory providers', () => {
        // Arrange
        const builderTypes = [CountByBuilder]
        const expected = [
            {
                provide: CountByBuilder,
                useFactory: expect.any(Function),
                inject: [RepositoryMethodsBuilder]
            }
        ];

        // Act
        const actual = MethodBuilderProviders(builderTypes);

        // Assert
        expect(actual).toEqual(expected);
    });

    it('factory should create and register builder', () => {
        // Arrange
        const builderTypes = [CountByBuilder];
        const methodsBuilder = {
            registerBuilder: jest.fn()
        };
        const factory = MethodBuilderProviders(builderTypes)[0];
        const expected = expect.any(CountByBuilder);

        // Act
        const actual = factory.useFactory(methodsBuilder);

        // Assert
        expect(actual).toEqual(expected);
        expect(methodsBuilder.registerBuilder).toHaveBeenCalledWith(actual);
    });
});
