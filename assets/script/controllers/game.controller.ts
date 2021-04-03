import { Storages } from "../enums/storages.enum";
import CocosCreatorEntity from "../libs/cramp-cocos-integration/integration/entity/cc3.entity";
import GlobalEntitiesStorage from "../libs/cramp-cocos-integration/cramp/storage/global-entities.storage";
import { IEntity, IEntityStorage } from "../libs/cramp-cocos-integration/cramp/type-definitions/interfaces";
import { _decorator, Component } from "cc";

const { ccclass } = _decorator;



@ccclass
export default class GameController extends Component {

    private _entityStorage: IEntityStorage<IEntity<Component>> = null;

    onLoad(): void {
        const entities: CocosCreatorEntity[] = this.getComponentsInChildren(CocosCreatorEntity);
        this._entityStorage = GlobalEntitiesStorage.create(Storages.GAME);
        this._entityStorage.add(...entities);
    }

}