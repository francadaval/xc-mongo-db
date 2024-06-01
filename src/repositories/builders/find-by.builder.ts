import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { MethodBuilder } from "./method-builder";

const FIND_BY = 'findBy';

export class FindByBuilder extends MethodBuilder {
    
    private logger = new Logger(FindByBuilder.name);

    getVerb(): string {
        return FIND_BY;
    }

    buildFuction(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<any> {
        if(!groups?.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${FIND_BY}' method.`);
        }
    
        this.logger.debug(`"${methodName}" created`);   
    
        return async function (...args) {
            this.logger.debug("Custom empty findBy method!!");
        }
    }
}
