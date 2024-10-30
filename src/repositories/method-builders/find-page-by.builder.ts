import { Logger } from "@nestjs/common";
import { ParsedMethodGroup } from "../builder/method-name-parser";
import { MethodBuilder } from "./method-builder";
import { Collection, Document, WithId } from "mongodb";
import { Page, PageRequest } from "src/pagination";

const FIND_PAGE_BY = 'findPageBy';
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_INDEX = 0;

function checkPageRequest(pageRequest: PageRequest): PageRequest {
    pageRequest.page_index = pageRequest.page_index || DEFAULT_INDEX;
    pageRequest.page_index = pageRequest.page_index < 0 ? DEFAULT_INDEX : pageRequest.page_index;
    pageRequest.page_size = pageRequest.page_size || DEFAULT_PAGE_SIZE;
    pageRequest.page_size = pageRequest.page_size < 1 ? DEFAULT_PAGE_SIZE : pageRequest.page_size;

    return pageRequest;
}

export class FindPageByBuilder extends MethodBuilder {
    
    protected logger = new Logger(FindPageByBuilder.name);

    getVerb(): string {
        return FIND_PAGE_BY;
    }

    buildMethod(methodName: string, groups: ParsedMethodGroup[]): (...args: any[]) => PromiseLike<Page<WithId<Document>>> {
        if(!groups?.length) {
            this.throwError(`${methodName}: Attributes are required on a '${FIND_PAGE_BY}' method.`);
        }
    
        const getFilter = (args) => this.getFilter(groups, args);
    
        this.logger.debug(`"${methodName}" created`);   
        return async function (...args) {
            let pageRequest: PageRequest = args.pop();
            pageRequest = checkPageRequest(pageRequest);

            const $total_size = (this.collection as Collection).countDocuments(getFilter(args));
            const $items = (this.collection as Collection).find(getFilter(args), {
                skip: pageRequest.page_index * pageRequest.page_size,
                limit: pageRequest.page_size
            }).toArray()
            
            const [total_size, docs] = await Promise.all([$total_size, $items]);

            const items = docs.map(item => this.createEntity(item));

            return {
                items,
                total_size,
                page_index: pageRequest.page_index,
                page_size: pageRequest.page_size
            }
        }
    }
}
