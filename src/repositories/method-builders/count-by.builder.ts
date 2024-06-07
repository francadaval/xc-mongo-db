import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { Collection } from "mongodb";
import { MethodBuilder } from "./method-builder";

const COUNT_ONE_BY = "countBy";

export class CountByBuilder extends MethodBuilder{
    protected logger = new Logger(CountByBuilder.name);

    getVerb(): string {
        return COUNT_ONE_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any> {
        if(!groups?.length) {
            this.throwError(`${methodName}: Attributes are required on a '${COUNT_ONE_BY}' method.`);
        }
    
        let getFilter = (args) => this.getFilter(groups, args);
        
        this.logger.debug(`"${methodName}" created`);
        return async function (...args) {
            return (this.collection as Collection).countDocuments(getFilter(args));
        }
    }
}
