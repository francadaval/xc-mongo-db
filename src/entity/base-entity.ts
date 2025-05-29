/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseEntity {
    constructor(data: any = {}, fromDoc = true) {
        if (fromDoc) {
            this.fromDoc(data);
        } else {
            this.fromJson(data);
        }
    }

    toDoc(): any {
        return {};
    }

    fromDoc(_data: any = {}): void {}

    fromJson(_data: any = {}): void {}

    assignDefaultValues(): void {}
}
