// rootPath = "'+imagePath+'api";

import { environment } from '../../environments/environment';

export function webService(ServiceName){
    return environment.rootPath + ServiceName;    
};