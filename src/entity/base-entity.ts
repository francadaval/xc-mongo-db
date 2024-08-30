/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseEntity {
    constructor(data: any = {}, fromDB = true) {
        if (fromDB) {
            this.populate(data);
        } else {
            this.deserialize(data);
        }
    }

    serialize(): any {
        return {};
    }

    populate(_data: any = {}): void {}

    deserialize(_data: any = {}): void {}
}
