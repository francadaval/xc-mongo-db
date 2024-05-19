import { ConnectionService } from "./connection";
import { TestRepo } from "./tests/test-repo";

let connectionService = new ConnectionService();
let repo = new TestRepo(connectionService);

repo.insertOne({
    name: 'test_document',
    value: 123,
    date: new Date()
});

repo.insertMany([{
    name: 'test_document_00',
    value: 123,
    date: new Date()
},{
    name: 'test_document_01',
    value: 123,
    date: new Date()
}]);
