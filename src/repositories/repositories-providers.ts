import { Abstract, FactoryProvider, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";

function createRepository(type: Abstract<any>, connectionService: ConnectionService): BaseRepository<any> {
    return new (type as Type<any>)(connectionService, type.prototype.connectionParams);
};

function createFactoryProvider(type: Abstract<any>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService)=> createRepository(type, connectionService),
        inject: [ConnectionService]
    }
}

export const RepositoriesProviders = (repoTypes: Abstract<any>[]) => {
    return repoTypes.map(type => createFactoryProvider(type));
};
