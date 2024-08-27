import { ObjectId } from "mongodb";

export class BaseEntity<T = ObjectId> {
    protected __id?: T;

    get _id(): T {
        return this.__id;
    }

    set _id(_id: T) {
        this.__id = _id;
    }
}
