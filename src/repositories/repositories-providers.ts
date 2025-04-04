import { Abstract, FactoryProvider, Logger, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";
import { MetadataKeys } from "../common/metadata-keys";
import { EntityProperties } from "../entity/decorators";
import { RepositoryMethodsBuilder } from "./builder/repo-method-builder";
import { BaseDocEntity } from "../entity";
import { WithoutId } from "mongodb";

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
    const methods: string[] = Reflect.getMetadata(MetadataKeys.REPOSITORY_METHODS, RepoType);
    const entityType = Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType);
    const entityProperties: EntityProperties = Reflect.getMetadata(MetadataKeys.ENTITY_PROPERTIES, entityType);
    const className = Object.getPrototypeOf(RepoType).name;
    
    createRepoMethods<T>(entityProperties, methods, RepoType, methodsBuilder);

    const repo = new (RepoType as Type)(connectionService);
    
    createIndexes(entityProperties, repo);

    logger.log(`${className}, instance created.`);
    
    return repo;
}

function createIndexes(entityProperties: EntityProperties, repository: BaseRepository<BaseDocEntity<unknown>>) {
    Object.values(entityProperties)
        .filter(property => (property.unique || property.index))
        .map(property => ({
            indexSpec: property.index ? { [property.dbProperty]: property.index }: { [property.dbProperty]: 1 },
            options: {
                unique: property.unique || false
            }
        }))
        .forEach(index => repository.collection.createIndex(index.indexSpec, index.options));
}

function createRepoMethods<T extends BaseDocEntity<unknown>>(entityProperties: EntityProperties, methods: string[], RepoType: Abstract<BaseRepository<T>>, methodsBuilder: RepositoryMethodsBuilder) {
    const className = Object.getPrototypeOf(RepoType).name;

    const propertiesNames = getPropertiesNames(entityProperties);
    const dbPropertiesNames = getPropertiesNames(entityProperties, true);
    
    methods?.forEach(method => {
        RepoType.prototype[method] = methodsBuilder.buildRepositoryMethod(method, propertiesNames, dbPropertiesNames);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (RepoType.prototype as any).createEntityFromPlainObject = function (data: WithoutId<T>): T {
        return new (Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType))(data, false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (RepoType.prototype as any).createEntityFromDoc = function (data: Document): T {
        return new (Reflect.getMetadata(MetadataKeys.ENTITY_TYPE, RepoType))(data);
    };

    logger.debug(`${createRepository.name}: ${className}, ${methods?.length || 0} methods, ${propertiesNames.length} entity propert`);
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

        if(subEntityProperties) {
            propertiesNames = addPropertiesNames(propertiesNames, subEntityProperties, `${root}${name}.`, forDb);
        }
    });

    return propertiesNames;
}
