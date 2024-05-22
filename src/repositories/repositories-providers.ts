import { Abstract, FactoryProvider, Logger, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";

export const RepositoriesProviders = (repoTypes: Abstract<any>[]) => {
    return repoTypes.map(type => createFactoryProvider(type));
};

function createRepository(type: Abstract<any>, connectionService: ConnectionService): BaseRepository<any> {
    const repo = new (type as Type<any>)(connectionService);
    const className = Object.getPrototypeOf(type).name;
    logger.log(`${createRepository.name}: ${className}`);
    return repo;
};

function createFactoryProvider(type: Abstract<any>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService)=> createRepository(type, connectionService),
        inject: [ConnectionService]
    }
}

const logger = new Logger(RepositoriesProviders.name)
