import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { Collection } from "mongodb";

const COUNT_ONE_BY = "countBy";

export class CountByBuilder {
    private logger = new Logger(CountByBuilder.name);

    getVerb(): string {
        return COUNT_ONE_BY;
    }

    buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any> {
        if(!groups || !groups.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${COUNT_ONE_BY}' method.`);
        }
        let parameters = groups.map( group => group.matchedProperty );
    
        this.logger.debug(`"${methodName}" created`);   
    
        return async function (...args) {
            let filter = {};
            parameters.forEach((param, i) => {
                filter[param] = args[i];
            });
            return (this.collection as Collection).countDocuments(filter);
        }
    }
}
