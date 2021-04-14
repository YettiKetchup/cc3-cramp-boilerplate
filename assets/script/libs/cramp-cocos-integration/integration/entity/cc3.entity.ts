import ComponentsCache from "../../cramp/cache/components.cache";
import ComponentStateController from "../../cramp/component-state-controller/component-state.controller";
import BaseGettingComponentBehaviour from "../../cramp/core/entity/entity-behaviours/base-getting-component.behaviour";
import CachedComponentsAddingComponentBehaviour from "../../cramp/core/entity/entity-behaviours/cached-components-adding-component.behaviour";
import CachedComponentsDeletingComponentBehaviour from "../../cramp/core/entity/entity-behaviours/cached-components-deleting-component.behaviour";
import { IEntityBehaviour, IEntityComponentManipulationBehaviour } from "../../cramp/type-definitions/interfaces";
import { ComponentConstructor } from "../../cramp/type-definitions/types";
import { ICocosCreatorEntity } from "../../types/cc3-integration.interfaces";
import CocosCreatorCachedComponent from "../component/cc3.cached.component";
import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;



@ccclass('cc3.entity')
export default class CocosCreatorEntity extends Component 
                                        implements ICocosCreatorEntity, 
                                        IEntityBehaviour<Component, ICocosCreatorEntity> 
{
    
    private _components: Component[] = [];
    private _cache: ComponentsCache<Component> = new ComponentsCache();

    private _componentGettingBehaviour: IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity> 
        = new BaseGettingComponentBehaviour();

    private _componentAddingBehaviour: IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity>
        = new CachedComponentsAddingComponentBehaviour(this._cache);

    private _componentDeletingBehaviour: IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity>
        = new CachedComponentsDeletingComponentBehaviour(this._cache);

    public get components(): Component[] { return this._components; }
    public get isActive(): boolean { return this.node.active; }
    public set isActive(value: boolean) { this.node.active = value; }

    public get componentGettingBehaviour(): IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity> { 
        return this._componentGettingBehaviour; 
    }

    public set componentGettingBehaviour(value: IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity>) { 
        this._componentGettingBehaviour = value; 
    }

    public get componentAddingBehaviour(): IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity> { 
        return this._componentAddingBehaviour; 
    }

    public set componentAddingBehaviour(value: IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity>) { 
        this._componentAddingBehaviour = value; 
    }

    public get componentDeletingBehaviour(): IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity> { 
        return this._componentDeletingBehaviour; 
    }
    
    public set componentDeletingBehaviour(value: IEntityComponentManipulationBehaviour<Component, ICocosCreatorEntity>) { 
        this._componentDeletingBehaviour = value; 
    }

    onLoad() {
        const components = this.getComponents(Component).filter(c => c instanceof CocosCreatorEntity ? false : true);

        components.forEach(component => {
            ComponentStateController.makeSnapshot(this.uuid, component);
            this._components.push(component);
        });
        
        this._setCache(this._components);
    }

    public get<T extends Component>(componentConstructor: ComponentConstructor<T>): T {
        return this._componentGettingBehaviour.execute(this, componentConstructor) as T;
    }

    public add<T extends Component>(componentConstructor: ComponentConstructor<T>): T {
        const component: T = this._componentAddingBehaviour.execute(this, componentConstructor);
        this._toggleCacheStatus(component, false);
        return component;
    }

    public remove<T extends Component>(componentConstructor: ComponentConstructor<T>): T {
        const component = this._componentDeletingBehaviour.execute(this, componentConstructor) as T;
        this._toggleCacheStatus(component, true);
        return component;
    }

    private _setCache(components: Component[]): void {
        const cachedComponents: Component[] = components.filter(
            component => component instanceof CocosCreatorCachedComponent 
            ? component.inCache 
            : !component.enabled
        );

        cachedComponents.forEach(c => this.remove(c.constructor.prototype.constructor));
    }

    private _toggleCacheStatus(component: Component, inCache: boolean): void {
        component instanceof CocosCreatorCachedComponent ? component.inCache  = inCache : component.enabled = !inCache;
    }

}