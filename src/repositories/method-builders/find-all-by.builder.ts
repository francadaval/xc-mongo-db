import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { MethodBuilder } from "./method-builder";
import { Collection, FindCursor, WithId } from "mongodb";

const FIND_ALL_BY = 'findAllBy';

export class FindAllByBuilder extends MethodBuilder {
    
    private logger = new Logger(FindAllByBuilder.name);

    getVerb(): string {
        return FIND_ALL_BY;
    }

    buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any[]> {
        if(!groups?.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${FIND_ALL_BY}' method.`);
        }
    
        let getFilter = (args) => this.getFilter(groups, args);
    
        this.logger.debug(`"${methodName}" created`);   
        return async function (...args) {
            return (this.collection as Collection).find(getFilter(args)).toArray();
        }
    }
}
