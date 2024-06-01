import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { MethodBuilder } from "../builder/repo-method-builder";
import { Collection } from "mongodb";

const FIND_ONE_BY = 'findOneBy';

export class FindOneByBuilder implements MethodBuilder {
    
    private logger = new Logger(FindOneByBuilder.name);

    getVerb(): string {
        return FIND_ONE_BY;
    }

    buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any> {
        if(!groups || !groups.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${FIND_ONE_BY}' method.`);
        }
        let parameters = groups.map( group => group.attribute );
    
        this.logger.debug(`"${methodName}" created`);   
    
        return function (...args) {
            let filter = {};
            parameters.forEach((param, i) => {
                filter[param] = args[i];
            });
            return (this.collection as Collection).findOne(filter);
        }
    }
}
