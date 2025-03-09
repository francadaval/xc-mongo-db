import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

@Entity()
export class TestEntity extends BaseDocEntity<string> {
    @Id()
    name: string;

    @Property()
    value?: number;
}

@Entity({
    collectionName: 'between_test'
})
export class BetweenTestEntity extends TestEntity {}
