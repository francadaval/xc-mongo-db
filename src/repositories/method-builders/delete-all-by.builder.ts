import { Logger } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MethodBuilder } from './method-builder';
import { ParsedMethodGroup } from '../builder/method-name-parser';

const DELETE_ALL_BY = 'deleteAllBy';

export class DeleteAllByBuilder extends MethodBuilder {
    protected logger = new Logger(DeleteAllByBuilder.name);

    getVerb(): string {
        return DELETE_ALL_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<unknown> {
        if(!groups?.length) {
            this.throwError(`${methodName}: Attributes are required on a '${DELETE_ALL_BY}' method.`);
        }
    
        const getFilter = (args) => this.getFilter(groups, args);
        
        this.logger.debug(`"${methodName}" created`);
        return async function (...args) {
            const result = await (this.collection as Collection).deleteMany(getFilter(args), {
                writeConcern: { w: 'majority' }
            });
            return result.deletedCount;
        }
    }
}
