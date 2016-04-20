namespace Models {
    export interface IPayload {
        list:Array<IMenuSegment>;
        entity:Models.IEntity;
    }
    export interface IMenu {
        list:Array<IMenuSegment>;
    }
}