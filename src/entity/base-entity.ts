/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";

export abstract class BaseEntity<T = ObjectId> {
    protected __id?: T;

    get _id(): T {
        return this.__id;
    }

    set _id(_id: T) {
        this.__id = _id;
    }

    constructor(data: any = {}) {
        this.populate(data);
    }

    serialize(): any {
        return {
            _id: this._id,
        };
    }

    populate(data: any = {}): void {
        this._id = data._id;
    }
}
