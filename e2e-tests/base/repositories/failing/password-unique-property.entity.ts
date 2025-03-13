import { BaseDocEntity, Entity, Property } from "@src/entity";

export function declarePasswordAndUniquePropertyEntity() {
    @Entity()
    class PasswordUniqueEntity extends BaseDocEntity<string> {   
        @Property({
            unique: true,
            password: true
        })
        password: string;
    }
}
