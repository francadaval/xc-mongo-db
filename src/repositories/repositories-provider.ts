import { ConnectionService } from "../connection";

export const RepositoriesProviders = (repos: any[]) => {
    let providers = [];

    repos.forEach(repo => {
        providers.push({
            provide: repo,
            useFactory: (connectionService: ConnectionService)=> {
                return new repo(connectionService);
            },
            inject: [ConnectionService]
        })
    });
    
    return providers;
};
