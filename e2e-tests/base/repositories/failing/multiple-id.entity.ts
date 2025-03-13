import { BaseDocEntity, Entity, Id, Property } from "@src/entity";

export function declareMultipleIdEntity() {
    @Entity()
    class MultipleIdEntity extends BaseDocEntity<string> {   
        @Id()
        id1: string;
    
        @Id()
        id2: string;
    
        @Property()
        value?: number;
    }
}
