import { ConnectionService } from "./connection";
import { Repository } from "./repositories/repository";

let connectionService = new ConnectionService();
let repo = new Repository<any>(connectionService);

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
