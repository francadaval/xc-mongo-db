import { Logger } from "@nestjs/common";

const logger = new Logger(Repository.name);

export function Repository(db: string, collection: string) {
    return function (RepoType: any) {
        logger.debug(`Decorator called for ${RepoType.name}.`);

        return class extends RepoType {
            constructor(...args: any[]) {
                super(args[0], db, collection);
                this.logger = new Logger(RepoType.name);
            }
        } as typeof RepoType;
    };
}
