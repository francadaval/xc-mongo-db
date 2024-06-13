// TODO: Define more accurate type for _id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityId = any;

export interface EntityInterface {
    _id?: EntityId;
}
