/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import { BaseEntity } from "./base-entity";

export abstract class BaseDocEntity<T = ObjectId> extends BaseEntity{
    protected __id?: T;

    get _id(): T {
        return this.__id;
    }

    set _id(_id: T) {
        if(_id !== undefined ) {
            this.__id = _id;
        } else {
            delete this.__id;
        }
    }

    toDoc(): any {
        const doc = {...super.toDoc()};
        if(this._id !== undefined) {
            doc._id = this._id;
        }

        return doc;
    }

    fromDoc(data: any = {}): void {
        this._id = data._id;
    }

    fromJson(data: any = {}): void {
        this._id = data._id;
    }
}
