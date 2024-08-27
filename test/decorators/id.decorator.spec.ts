import { Id } from "@src/decorators";
import { BaseEntity } from "@src/entity";

describe(Id.name, () => {
    it('should redefine _id getter', () => { 
        class TestClass extends BaseEntity<number> {
            @Id()
            id?: number;
        }
        const instance = new TestClass();
        instance.id = 1;
        expect(instance._id).toBe(1);
    });

    it('should redefine _id setter', () => {
        class TestClass extends BaseEntity<number> {
            @Id()
            id?: number;
        }
        const instance = new TestClass();
        instance._id = 1;
        expect(instance.id).toBe(1);
    });

    it('should throw error if @Id is assigned twice', () => {
        
        expect(() => {
            class TestClass extends BaseEntity<number> {
                @Id()
                id1?: number;
                @Id()
                id2?: number;
            }
            new TestClass();
        }).toThrow('Id already registered: TestClass:id1.');
    });
});