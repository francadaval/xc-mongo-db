export function Repository(db: string, collection: string) {
        console.log("Repository(): factory evaluated");
    return function (constructor: Function) {
        console.log("Repository(): called");
    };
}
