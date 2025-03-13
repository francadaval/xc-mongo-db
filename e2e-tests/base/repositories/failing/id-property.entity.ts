import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

export function declareIdPropertyEntity() {
    @Entity()
    class IdPropertyEntity extends BaseDocEntity<string> {   
        @Id()
        @Property()
        id: string;
    
        @Property()
        value?: number;
    }
}
