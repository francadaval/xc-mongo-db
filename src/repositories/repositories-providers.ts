import { Abstract, FactoryProvider, Type } from "@nestjs/common";
import { ConnectionService } from "../connection";
import { BaseRepository } from "./base-repository";

function createFactoryProvider(type: Abstract<any>): FactoryProvider {
    return {
        provide: type,
        useFactory: (connectionService: ConnectionService)=> {
            return new BaseRepository(connectionService);
        },
        inject: [ConnectionService]
    }
}

export const RepositoriesProviders = (repoTypes: Abstract<any>[]) => {
    let providers: FactoryProvider[] = [];

    repoTypes.forEach(type => {
        providers.push(createFactoryProvider(type));
    });
    
    return providers;
};
