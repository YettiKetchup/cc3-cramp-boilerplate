import { ICachedObject } from "../../cramp/type-definitions/interfaces";
import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;



@ccclass
export default class CocosCreatorCachedComponent extends Component implements ICachedObject {
    
    @property()
    inCache: boolean = false;

}