import { Abstract, FactoryProvider, Logger, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";
import { MetadataKeys } from "../decorators/metadata-keys";
import { EntityProperties } from "../decorators";
import { RepositoryMethodsBuilder } from "./builder/repo-method-builder";
import { BaseDocEntity } from "../entity";

const logger = new Logger('repositoryFactoryProvider');

export function repositoryFactoryProvider<T extends BaseDocEntity<unknown>> (type: Abstract<BaseRepository<T>>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService, methodsBuilder: RepositoryMethodsBuilder) =>
            createRepository(type, connectionService, methodsBuilder),
        inject: [ConnectionService, RepositoryMethodsBuilder]
    }
}

function createRepository<T extends BaseDocEntity<unknown>>(
    RepoType: Abstract<BaseRepository<T>>,
    connectionService: ConnectionService,
    methodsBuilder: RepositoryMethodsBuilder
): BaseRepository<T> {
    
    const methods = Reflect.getMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
    const entityType = Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType);
    const entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, entityType);
    
    createRepoMethods<T>(entityProperties, methods, RepoType, methodsBuilder);

    const repo = new (RepoType as Type)(connectionService);
    
    createIndexes(entityProperties, repo);
    
    return repo;
}

function createIndexes(entityProperties: EntityProperties, repository: BaseRepository<BaseDocEntity<unknown>>) {
    Object.values(entityProperties)
        .filter(property => property.unique)
        .map(property => property.dbProperty)
        .forEach(property => repository.collection.createIndex(property, {unique: true}));
}

function createRepoMethods<T extends BaseDocEntity<unknown>>(entityProperties: EntityProperties, methods: any, RepoType: Abstract<BaseRepository<T>>, methodsBuilder: RepositoryMethodsBuilder) {
    const className = Object.getPrototypeOf(RepoType).name;

    const propertiesNames = getPropertiesNames(entityProperties);
    const dbPropertiesNames = getPropertiesNames(entityProperties, true);
    
    methods?.forEach(method => {
        RepoType.prototype[method] = methodsBuilder.buildRepositoryMethod(method, propertiesNames, dbPropertiesNames);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (RepoType.prototype as any).createEntity = function (data: Document): T {
        return new (Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType))(data);
    }

    logger.log(`${createRepository.name}: ${className}, ${methods?.length || 0} methods, ${propertiesNames.length} entity propert`);
    return propertiesNames;
}

function getPropertiesNames(entityProperties: EntityProperties, forDb: boolean = false): string[] {
    return addPropertiesNames([], entityProperties, '', forDb);
}

function addPropertiesNames(propertiesNames: string[], entityProperties: EntityProperties, root: string, forDb: boolean): string[] {
    const names = Object.keys(entityProperties);
    const dbNames = Object.values(entityProperties).map(property => property.dbProperty)

    const newNames = names.map((name, index) => root + (forDb ? dbNames[index]: name));

    propertiesNames = propertiesNames.concat(newNames);

    const subEntitiesNames = Object.keys(entityProperties)
        .filter(propertyName => entityProperties[propertyName].type);
    const subEntitiesDbNames = subEntitiesNames
        .map(propertyName => entityProperties[propertyName].dbProperty);

    subEntitiesNames.forEach((subentityName, index) => {
        const subEntitytype = entityProperties[subentityName].type;
        const subEntitiesDbName = subEntitiesDbNames[index];
        const name = forDb ? subEntitiesDbName: subentityName;
        const subEntityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, subEntitytype);
        propertiesNames = addPropertiesNames(propertiesNames, subEntityProperties, `${root}${name}.`, forDb);
    });

    return propertiesNames;
}
