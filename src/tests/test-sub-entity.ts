import { Property } from "../decorators";

export class TestSubEntity {
    @Property() value: number;
    @Property() name: string;
}
