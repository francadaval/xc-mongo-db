import { Logger } from "@nestjs/common";
import { MethodBuilder } from "./method-builder";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { Collection } from "mongodb";

export const UPDATE_BY = 'updateBy';

export class UpdateByBuilder extends MethodBuilder {
    
    protected logger = new Logger(UpdateByBuilder.name);

    getVerb(): string {
        return UPDATE_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<unknown> {
        if(!groups?.length) {
            this.throwError(`${methodName}: Attributes are required on a '${UPDATE_BY}' method.`);
        }
    
        const getFilter = (args) => this.getFilter(groups, args);
        const logger = this.logger;
        
        this.logger.debug(`"${methodName}" created`);
        return async function (...args) {
            logger.debug(`"${methodName}" called with ${JSON.stringify(args)}`);
            const filter = getFilter(args);
            logger.debug(`args after getFilter: ${JSON.stringify(args)}`);
            const doc = args[0].toDoc ? args[0].toDoc() : this.createEntityFromPlainObject(args[0]).toDoc();
            logger.debug(`update by ${JSON.stringify(filter)} with ${JSON.stringify(doc)}`);
            await (this.collection as Collection).updateMany(filter, {$set: doc});
        }
    }
}
