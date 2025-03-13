import { BaseDocEntity, Entity, Property } from "@src/entity";

export function declarePasswordAndDefaultPropertyEntity() {
    @Entity()
    class PasswordDefaultEntity extends BaseDocEntity<string> {   
        @Property({
            default: true,
            password: true
        })
        password: string;
    }
}
