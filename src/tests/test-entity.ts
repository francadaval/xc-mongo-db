import { EntityInterface } from "../entities";

export class TestEntity implements EntityInterface {
    _id?: string;
    name?: string;
    value?: number;
    date?: Date;
}
