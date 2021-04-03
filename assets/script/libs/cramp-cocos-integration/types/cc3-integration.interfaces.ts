import { Component, Node } from "cc";
import { IEntityController, INodeEntity } from "../cramp/type-definitions/interfaces";



export interface ICocosCreatorEntity extends INodeEntity<Component, Node>, 
                                             IEntityController<Component> {
    
}