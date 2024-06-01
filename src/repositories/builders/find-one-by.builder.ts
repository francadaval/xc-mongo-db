import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { Collection } from "mongodb";
import { MethodBuilder } from "./method-builder";

const FIND_ONE_BY = 'findOneBy';

export class FindOneByBuilder extends MethodBuilder {
    
    private logger = new Logger(FindOneByBuilder.name);

    getVerb(): string {
        return FIND_ONE_BY;
    }

    buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any> {
        if(!groups?.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${FIND_ONE_BY}' method.`);
        }
        this.logger.debug(`"${methodName}" created`);
        
        let getFilter = (args) => this.getFilter(groups, args);
    
        return function (...args) {
            return (this.collection as Collection).findOne(getFilter(args));
        }
    }
}
