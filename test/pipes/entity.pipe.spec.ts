import { Entity, Property } from "@src/decorators";
import { BaseEntity } from "@src/entity";
import { EntityPipe } from "@src/pipes/entity.pipe";

@Entity()
class TestEntity extends BaseEntity{
    @Property()
    name?: string;
    @Property()
    value?: number;
}

describe(EntityPipe.name, () => {
    it('should transform a value to an entity', () => {
        const entityPipe = new EntityPipe(TestEntity);
        const entity = entityPipe.transform({name: 'test', value: 42});
        
        expect(entity).toBeInstanceOf(TestEntity);

        const testEntity = entity as TestEntity;
        expect(testEntity.name).toBe('test');
        expect(testEntity.value).toBe(42);
    });
});