import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { Collection } from "mongodb";
import { MethodBuilder } from "./method-builder";

const COUNT_ONE_BY = "countBy";

export class CountByBuilder extends MethodBuilder{
    private logger = new Logger(CountByBuilder.name);

    getVerb(): string {
        return COUNT_ONE_BY;
    }

    buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any> {
        if(!groups?.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${COUNT_ONE_BY}' method.`);
        }
    
        this.logger.debug(`"${methodName}" created`);

        let getFilter = (args) => this.getFilter(groups, args);
    
        return async function (...args) {
            return (this.collection as Collection).countDocuments(getFilter(args));
        }
    }
}
