/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseEntity {
    constructor(data: any = {}) {
        this.populate(data);
    }

    serialize(): any {
        return {};
    }

    populate(_data: any = {}): void {}
}
