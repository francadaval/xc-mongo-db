import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { MethodBuilder } from "./method-builder";
import { Collection, Document, WithId } from "mongodb";

const FIND_ALL_BY = 'findAllBy';

export class FindAllByBuilder extends MethodBuilder {
    
    protected logger = new Logger(FindAllByBuilder.name);

    getVerb(): string {
        return FIND_ALL_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<WithId<Document>[]> {
        if(!groups?.length) {
            this.throwError(`${methodName}: Attributes are required on a '${FIND_ALL_BY}' method.`);
        }
    
        const getFilter = (args) => this.getFilter(groups, args);
    
        this.logger.debug(`"${methodName}" created`);   
        return async function (...args) {
            const docs = await (this.collection as Collection).find(getFilter(args)).toArray();
            return docs.map(doc => this.createEntity(doc));
        }
    }
}
