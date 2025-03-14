import { INestApplicationContext } from "@nestjs/common";

import { declareMultipleIdEntity } from "./repositories/failing/multiple-id.entity";
import { declareDuplicatedDbPropertyEntity } from "./repositories/failing/duplicated-db-property.entity";
import { declareIdPropertyEntity } from "./repositories/failing/id-property.entity";
import { declarePasswordAndUniquePropertyEntity } from "./repositories/failing/password-unique-property.entity";
import { declarePasswordAndDefaultPropertyEntity } from "./repositories/failing/password-default-property.entity";
import { declareUniqueDefaultEntity } from "./repositories/failing/unique-default-property.entity";
import { declarePropertyIdEntity } from "./repositories/failing/property-id.entity";

describe('Property Decorator Failing Tests', () => {
    let app: INestApplicationContext;

    it('@Id decorator cannot be applied to multiple properties should throw and error', async () => {
        expect(async () => {
            declareMultipleIdEntity();
        }).rejects.toThrow();
    });

    it('Two properties with the same dbProperty name should throw an error', async () => {
        expect(async () => {
            declareDuplicatedDbPropertyEntity();
        }).rejects.toThrow();
    });

    it('@Id decorator applied with @Property decorator should throw and error', async () => {
        expect(async () => {
            declareIdPropertyEntity();
        }).rejects.toThrow();
    });

    it('@Property decorator applied with @Id decorator should throw and error', async () => {
        expect(async () => {
            declarePropertyIdEntity();
        }).rejects.toThrow();
    });

    it('Property with both password and unique set to true should throw and error', async () => {
        expect(async () => {
            declarePasswordAndUniquePropertyEntity();
        }).rejects.toThrow();
    });

    it('Property with both password and default set should throw and error', async () => {
        expect(async () => {
            declarePasswordAndDefaultPropertyEntity();
        }).rejects.toThrow();
    });

    it('Property with both unique and default set should throw and error', async () => {
        expect(async () => {
            declareUniqueDefaultEntity();
        }).rejects.toThrow();
    });
});
