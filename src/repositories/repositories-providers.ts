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

    const methods = Reflect.getMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
    const entityType = Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType);
    const entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, entityType);

    const propertiesNames = getPropertiesNames(entityProperties);
    const dbPropertiesNames = getPropertiesNames(entityProperties, true);

    methods.forEach(method => {
        RepoType.prototype[method] = methodsBuilder.buildRepositoryMethod(method, propertiesNames, dbPropertiesNames);
    });

    const repo = new (RepoType as Type)(connectionService);
    logger.log(`${createRepository.name}: ${className}, ${methods.length} methods, ${propertiesNames.length} entity propert`);
    return repo;
}

function createFactoryProvider(type: Abstract<any>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService, methodsBuilder: RepositoryMethodsBuilder) =>
            createRepository(type, connectionService, methodsBuilder),
        inject: [ConnectionService, RepositoryMethodsBuilder]
    }
}

function getPropertiesNames(entityProperties: EntityProperties, dbName: boolean = false): string[] {
    return addPropertiesNames([], entityProperties, '', dbName);
}

function addPropertiesNames(propertiesNames: string[], entityProperties: EntityProperties, root: string, dbName: boolean): string[] {
    const names = dbName ? Object.values(entityProperties).map(property => property.propertyDBName) : Object.keys(entityProperties);
    propertiesNames = propertiesNames.concat(names.map(name => root + name));

    const subEntitiesNames = Object.keys(entityProperties).filter(propertyName => entityProperties[propertyName].type);
    subEntitiesNames.forEach(subentityName => {
        const subEntitytype = entityProperties[subentityName].type;
        const subEntityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, subEntitytype); 
        propertiesNames = addPropertiesNames(propertiesNames, subEntityProperties, `${subentityName}.`, dbName);
    });

    return propertiesNames;
}

const logger = new Logger(RepositoriesProviders.name)
