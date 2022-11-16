import { Handler, Context, APIGatewayProxyCallback } from 'aws-lambda';
import { PruebaConceptoService } from './src/main/services/PruebaConceptoService';
import { ResponseModel } from './src/main/models/Models';
import { TABLE } from './src/main/types/Constants';
import { ApisDTO } from './src/main/dto/ApisDTO';
import * as CONSTANTS from './src/main/types/Constants';
import Store from './src/main/config/Settings';



export const handler = async (event:any, context:Context, callback:APIGatewayProxyCallback) => {
    console.log('Handler called');
    console.log('Received event:', JSON.stringify(event, null, 2));

    
    let region = process.env.AWS_REGION || 'us-east-1';
    //Se inicializa parametros jenkins
    let stage = 'dev';
    if (process.env.STACK_ID) {
        stage = process.env.STACK_ID;
    }
    Store.setPath(stage);
    Store.setRegion(region);
    const parameters = await Store.getParameters();
    console.log('Parameters:', parameters);

    const apisDTO = new ApisDTO()
    const service = new PruebaConceptoService(apisDTO);
    let UrlParameter : string = event.queryStringParameters.urlParameter;
    console.log('Contenido urlParameter', UrlParameter);
    let rm: ResponseModel = await service.pruebaConcepto(UrlParameter);
    console.log('Respuesta service', rm.result);
    /*  
    let response = {
        statusCode: rm.statusCode,
        headers: rm.headers,        
        result: rm.result
    }
    if (rm.response || rm.message.includes(CONSTANTS.ONESPAN_DATA_ERROR)) {
        callback(undefined, response);
    } else {
        callback(JSON.stringify(response));
    }
    */
    return rm.result
    
}