import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

export function declarePropertyIdEntity() {
    @Entity()
    class PropertyIdEntity extends BaseDocEntity<string> {   
        @Property()
        @Id()
        id: string;
    
        @Property()
        value?: number;
    }
}
