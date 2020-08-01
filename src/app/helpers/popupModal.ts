import { CanDeactivate } from "@angular/router";  
import { Injectable } from "@angular/core";  
import { Observable } from "rxjs/Observable";  
  
export interface ComponentToBoDeactivated {  
  CanDeactivate: () => boolean | Observable<boolean>;  
}  
  
@Injectable()  
export class ChangesGuard implements CanDeactivate<ComponentToBoDeactivated> {  
  constructor() {  
  
  }  
  
  canDeactivate(component: ComponentToBoDeactivated): boolean | Observable<boolean> {  
     
      return component.CanDeactivate()? true: confirm(  
            "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes."  
          );     
  }  
}  