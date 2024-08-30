/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import { BaseEntity } from "./base-entity";

export abstract class BaseDocEntity<T = ObjectId> extends BaseEntity{
    protected __id?: T;

    get _id(): T {
        return this.__id;
    }

    set _id(_id: T) {
        this.__id = _id;
    }

    serialize(): any {
        return {
            ...super.serialize(),
            _id: this._id,
        };
    }

    populate(data: any = {}): void {
        this._id = data._id;
    }

    deserialize(data: any = {}): void {
        this._id = data._id;
    }
}
