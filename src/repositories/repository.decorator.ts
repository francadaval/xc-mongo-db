import { Abstract } from "@nestjs/common";

export function Repository(db: string, collection: string) {
        console.log("Repository(): factory evaluated");
    return function (abstract: Abstract<any>) {
        console.log("Repository(): called");
        abstract.prototype.connectionParams = {
            db, collection
        }
    };
}
