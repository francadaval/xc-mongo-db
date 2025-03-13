import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

export function declareDuplicatedDbPropertyEntity() {
    @Entity()
    class DuplicatedDbPropertyEntity extends BaseDocEntity<string> {   
        @Id()
        id: string;
    
        @Property({
            dbProperty: 'value'
        })
        value?: number;

        @Property({
            dbProperty: 'value'
        })
        value2?: number;
    }
}
