import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { Collection, Document, WithId } from "mongodb";
import { MethodBuilder } from "./method-builder";

const FIND_ONE_BY = 'findOneBy';

export class FindOneByBuilder extends MethodBuilder {
    
    protected logger = new Logger(FindOneByBuilder.name);

    getVerb(): string {
        return FIND_ONE_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<WithId<Document>> {
        if(!groups?.length) {
            this.throwError(`${methodName}: Attributes are required on a '${FIND_ONE_BY}' method.`);
        }
        
        const getFilter = (args) => this.getFilter(groups, args);
        
        this.logger.debug(`"${methodName}" created`);
        return async function (...args) {
            const filter = getFilter(args);
            const response = await (this.collection as Collection).findOne(filter);
            return response !== null ? this.createEntityFromDoc(response): null;
        }
    }
}
