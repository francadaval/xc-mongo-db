import { Abstract, FactoryProvider, Logger, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";
import { MetadataKeys } from "../decorators/metadata-keys";
import { EntityProperties } from "../decorators";
import { RepositoryMethodsBuilder } from "./builder/repo-method-builder";
import { BaseEntity } from "@src/entity";

const logger = new Logger('repositoryFactoryProvider');

export function repositoryFactoryProvider<T extends BaseEntity<unknown>> (type: Abstract<BaseRepository<T>>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService, methodsBuilder: RepositoryMethodsBuilder) =>
            createRepository(type, connectionService, methodsBuilder),
        inject: [ConnectionService, RepositoryMethodsBuilder]
    }
}

function createRepository<T extends BaseEntity<unknown>>(
    RepoType: Abstract<BaseRepository<T>>,
    connectionService: ConnectionService,
    methodsBuilder: RepositoryMethodsBuilder
): BaseRepository<T> {
    const className = Object.getPrototypeOf(RepoType).name;

    const methods = Reflect.getMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
    const entityType = Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType);
    const entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, entityType);

    const propertiesNames = getPropertiesNames(entityProperties);
    const dbPropertiesNames = getPropertiesNames(entityProperties, true);

    methods?.forEach(method => {
        RepoType.prototype[method] = methodsBuilder.buildRepositoryMethod(method, propertiesNames, dbPropertiesNames);
    });

    const repo = new (RepoType as Type)(connectionService);
    logger.log(`${createRepository.name}: ${className}, ${methods?.length || 0} methods, ${propertiesNames.length} entity propert`);
    return repo;
}

function getPropertiesNames(entityProperties: EntityProperties, forDb: boolean = false): string[] {
    return addPropertiesNames([], entityProperties, '', forDb);
}

function addPropertiesNames(propertiesNames: string[], entityProperties: EntityProperties, root: string, forDb: boolean): string[] {
    const names = Object.keys(entityProperties);
    const dbNames = Object.values(entityProperties).map(property => property.propertyDBName)

    const newNames = names.map((name, index) => root + (forDb ? dbNames[index] || name : name));

    propertiesNames = propertiesNames.concat(newNames);

    const subEntitiesNames = Object.keys(entityProperties)
        .filter(propertyName => entityProperties[propertyName].type);
    const subEntitiesDbNames = Object.keys(entityProperties)
        .map(propertyName => entityProperties[propertyName].propertyDBName);

    subEntitiesNames.forEach((subentityName, index) => {
        const subEntitytype = entityProperties[subentityName].type;
        const subEntitiesDbName = subEntitiesDbNames[index];
        const name = forDb ? subEntitiesDbName || subentityName : subentityName;
        const subEntityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, subEntitytype);
        propertiesNames = addPropertiesNames(propertiesNames, subEntityProperties, `${root}${name}.`, forDb);
    });

    return propertiesNames;
}
