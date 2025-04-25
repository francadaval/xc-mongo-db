# Introduction
XC-MongoDb is a library to support easy documents handling on MongoDb with NestJs. It is inspired by the MongoDb library for Spring Data. It's not intended as a faithful copy but as an exercise to learn and improve programming skills by its author.

# Installation
This library is not yet available from NPM. Please follow usual process to package it and include it in your project.

# Features
The main feature of this library is to **easily create repository classes** to handle documents stored on a MongoDb database, just defining the methods on a repository class that will be automatically implemented following simple rules.

## `@Repository`
This decorator identifies a class to access entities in a MongoDb instance.

The `@Repository` decorator accepts two parameters: the name of the database in which the documents will are stored and the type of the entity it handles (as it can not be automatically identified by reflection).

A class decorated as a repository must extend `BaseRepository<T>` being `T` the entity class it handles.

From `BaseRepository` it takes basic operations:

* `insertOne`
* `insertMany`
* `findOne`
* `deleteOne`
* `deleteAll`
* `updateOne`

Using the `@RepositoryMethod` decorator, more complex access methods can be defined without implementation. The actual implementation of those methods will be automatically performed by XC-MongoDb during the repository instantiation.

## `@RepositoryMethod`
This decorator identifies the methods in a repository class that will be authomatically implemented when the repository class is instantiated. The intended data operation is defined by the method name.

Method names can be created following this format:

```
<operation-prefix><attribute-name><filter-modifier>(...And<attribute-name><filter-modifier>)
```

The **operation-prefix** define the operation to be performed on the DB and can be:

* **countBy**: To count the number of documents matching the filter criteria.
* **deleteAllBy**: to delete all the documents matching the filter criteria.
* **findAllBy**: to fetch a list of all the documents matching the filter criteria.
* **findOneBy**: to fetch a document matching the filter criteria.
* **findPageBy**: to fetch a paginated list of all the documents matching the filter criteria.
* **updateBy**: to update all the documents matching the filter criteria.

The filter criteria are defined by one or more attribute names with an optional filter-modifier separated by '*And*'.

By default, the matching criteria is to find the exact same value on the documents. using a **filter-modifier** stablish a different comparison:

* **Between**: search for document with an attribute between two values.
* **GreaterThan**: search for document with an attribute greater than a value.
* **GreaterThanEqual**: search for document with an attribute equal or greater than a value.
* **In**: search for document with an attribute value included in an provided array.
* **LessThan**: search for document with an attribute less than a value.
* **LessThanEqual**: search for document with an attribute equal or less than a value.
* **MatchAll**: search a document with an array attribute matching all the values of a provided array.

The attribute-name should follow these conventions:

* The attribute name is the same as defined in the entity class with first capital letter.
* For nested entities there are to possible formats to help avoiding conflicts:
  * Join the nested entity name with the entity attribute name. For example, if the main entity has a nested entity called '*address*' with an attribute '*number*' it would be '*AddressNumber*'
  * Use '*Of*' to reference the attribute of a nested entity. For the previous example it would be '*NumberOfAddress*'.
* In case of names conflict the name for a higher-level entity has precedence. For instance, if the entity has an attribute '*addressNumber*', the attribute '*AddressName*' in the repositiry method name references this attribute instead of the '*number*' of the '*address*'. So, in that case using '*NumberOfAddress*' would solve the conflict.

Let see some examples of methods naming for the following entities:

```
@Entity({
    collectionName: 'user'
})
export class NestingTestEntity extends BaseDocEntity {
    @Property()
    name: string;

    @Property()
    surname: string;

    @Property({
        type: Address
    })
    address: Address;

    @Property()
    email: string;
}
```
```
@Entity()
export class Address extends BaseEntity {
    @Property()
    street: string;
    
    @Property()
    number: number;

    @Property()
    city: string;
}
```
* `findOnebyEmail('email@fake.com')`: Will return a User entity with the provided email address '*email@fake.com*' if found.
* `countByAddressCity('Sevilla')`: Will return the number of users with '*address.city*' equal to '*Sevilla*'.
* `findAllByAddressCityAndAddressStreeAndAddressNumberBetween('Sevilla', 'Sierpes', 12, 24)`: Will return all the users matching this city and street with the number between 12 and 24.
* `findPageBySurnameIn(['García', 'Fernández'], pageRequest)`: Will return a page of `User` entities with '*surname*' García or Fernández

## `@Entity`
This decorator defines a class as an entity class that can be stored in MongoDb handled by a repository class.

An entity class must extend the abstract class `BaseDocEntity<T>`, being `T` the type (`ObjectId` by default) of the entity identifier ('*_id*').

The `@Entity` decorator accepts a parameter of type `EntityDecoratorParameters` with the name of the database's collection to store these documents.

## `@Property`
This decorator defines a property of an entity class that should be persisted with the document stored in MongoDb.

That allows the correct handling of its value on storing and retrieving it and to create methods on the repository class.

The `@Property` decorator accepts an object parameter of type `PropertyDecoratorParameters`. This type has these attributes to configure the document property:

* **dbProperty**: The name of the property in the database document if it's different from the entity class attribute.
* **unique**: A boolean flag, *true* if the value must be unique in the database collection. An unique index will be created in the MongoDb collection.
* **password**: If *true* the value of this property is hashed before being stored in MongoDb. A password property cannot be unique, indexed or the entity id nor have a default value.
* **default**: Establish a default value for the property when it's stored. A property with a default value cannot be null nor password.
* **index**: An index with provided `IndexDirection` will be created in the collection for this property.
* **type**: The type of the property when it's a nested object. The nested object type should extend the abstract class `BaseEntity`.

## `@Id`
This decorator identifies a class attribute that should be used as entity identifier. This attribute will be stored on MongoDB as '_id' value of the document. This attribute can be also got or set from '_id' attribute of the BaseDocEntity class as their getter an setter functions would be overwritten.

Decorator `@Property` and `@Id` cannot be assigned to the same property.

Only one class attribute can receive `@Id` decorator.

## Pagination

## DB Connection

# Disclaimer
As it was already mentioned on the introduction, this library was created for self-learning purposes and as a challenge for its author, so it's not (yet) recommended to be used on real production environments.