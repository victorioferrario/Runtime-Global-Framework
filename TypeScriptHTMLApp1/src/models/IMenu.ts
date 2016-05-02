namespace Models {
   export interface IMenu {
      list:Array<IMenuSegment>;
   }
    export interface IPayload {
      entity:Models.IEntity;
      list:Array<IMenuSegment>;
    }
    export interface IMenuPayload {
      entity:Models.IEntity;
      list:Array<IMenuSegment>;
    }
    export interface IUserPayload{
        entity:Models.IEntity;
    }
    export interface INotificationsPayload{
        notifications:Models.INotifications;
    }
}
