import { Repository, RepositoryMethod, BaseRepository} from "../";
import { ExtendedEntity } from "./extended-entity";

const EXTENDED_ENTITY_DB = 'extended_entity';

@Repository(EXTENDED_ENTITY_DB, ExtendedEntity)
export abstract class ExtendedEntityRepository extends BaseRepository<ExtendedEntity> {

    @RepositoryMethod()
    findOneByValue(_value: number): Promise<ExtendedEntity> {
        throw new Error('Repository not implemented.')
    };
}
