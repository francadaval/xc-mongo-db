import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { MethodBuilder } from "./method-builder";
import { Collection, FindCursor, WithId } from "mongodb";
import { Page } from "../../pagination/page";
import { PageRequest } from "src/pagination/page_request";

const FIND_PAGE_BY = 'findPageBy';

export class FindPageByBuilder extends MethodBuilder {
    
    private logger = new Logger(FindPageByBuilder.name);

    getVerb(): string {
        return FIND_PAGE_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<Page<any>> {
        if(!groups?.length) {
            this.logger.error(`${methodName}: Attributes are required on a '${FIND_PAGE_BY}' method.`);
        }
    
        let getFilter = (args) => this.getFilter(groups, args);
    
        this.logger.debug(`"${methodName}" created`);   
        return async function (...args) {
            let pagination: PageRequest = args.pop();
            let $total_size = (this.collection as Collection).countDocuments(getFilter(args));
            let $items = (this.collection as Collection).find(getFilter(args), {
                skip: pagination.page_index * pagination.page_size,
                limit: pagination.page_size
            }).toArray();

            let [total_size, items] = await Promise.all([$total_size, $items]);

            return {
                items,
                total_size,
                page_index: pagination.page_index,
                page_size: pagination.page_size
            }
        }
    }
}
