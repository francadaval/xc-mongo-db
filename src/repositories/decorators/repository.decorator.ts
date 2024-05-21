import { Abstract, Logger, Type } from "@nestjs/common";
import { ConnectionService } from "../../connection";

const logger = new Logger(Repository.name);

export function Repository(db: string, collection: string, type: any) {
        logger.debug("Factory evaluated");
    return function <T extends Abstract<any>> (RepoType: T) {
        logger.debug(`Decorator called for ${RepoType.name}.`);
        return {[RepoType.name](connectionService: ConnectionService) {
            const instance = new (RepoType as unknown as Type<any>)(connectionService, db, collection);
            instance.logger = new Logger(RepoType.name);
            return instance;
        }}[RepoType.name] as unknown as typeof RepoType;
    };
}
