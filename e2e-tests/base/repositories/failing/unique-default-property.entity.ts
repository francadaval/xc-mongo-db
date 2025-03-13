import { BaseDocEntity, Entity, Property } from "@src/entity";

export function declareUniqueDefaultEntity() {
    @Entity()
    class UniqueDefaultEntity extends BaseDocEntity<string> {   
        @Property({
            unique: true,
            default: true
        })
        name: string;
    }
}
