import { Type } from "@nestjs/common";

export function RepositoryMethod() {
        console.log("RepositoryMethod(): factory evaluated");
    return function (target: Object, propertyKey: any, descriptor: PropertyDescriptor) {
        console.log("RepositoryMethod(): called");
        descriptor.value = function() {
            console.log(`Repo function ${propertyKey} called with arguments: ${JSON.stringify(arguments)}`);
            console.log("Instance atribute: " + this.test_att);
        }
    };
}
