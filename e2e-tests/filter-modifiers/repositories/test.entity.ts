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

@Entity({
    collectionName: 'greater_than_equal_test'
})
export class GreaterThanEqualTestEntity extends TestEntity {}

@Entity({
    collectionName: 'greater_than_test'
})
export class GreaterThanTestEntity extends TestEntity {}

@Entity({
    collectionName: 'less_than_equal_test'
})
export class LessThanEqualTestEntity extends TestEntity {}

@Entity({
    collectionName: 'less_than_test'
})
export class LessThanTestEntity extends TestEntity {}
