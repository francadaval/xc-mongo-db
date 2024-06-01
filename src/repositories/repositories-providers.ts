import { Abstract, FactoryProvider, Logger, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";
import { MetadataKeys } from "../decorators/metadata-keys";
import { EntityProperties } from "../decorators";
import { RepositoryMethodsBuilder } from "./builder/repo-method-builder";

export const RepositoriesProviders = (repoTypes: Abstract<any>[]) => {
    return repoTypes.map(type => createFactoryProvider(type));
};

function createRepository(RepoType: Abstract<any>, connectionService: ConnectionService, methodsBuilder: RepositoryMethodsBuilder): BaseRepository<any> {
    const className = Object.getPrototypeOf(RepoType).name;

    let methods = Reflect.getMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
    let entityType = Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType);
    let entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, entityType);

    methods.forEach(method => {
        RepoType.prototype[method] = methodsBuilder.buildRepositoryMethod(method, entityProperties);
    });

    const repo = new (RepoType as Type<any>)(connectionService);
    logger.log(`${createRepository.name}: ${className}`);
    return repo;
};

function createFactoryProvider(type: Abstract<any>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService, methodsBuilder: RepositoryMethodsBuilder) =>
            createRepository(type, connectionService, methodsBuilder),
        inject: [ConnectionService, RepositoryMethodsBuilder]
    }
}

const logger = new Logger(RepositoriesProviders.name)
