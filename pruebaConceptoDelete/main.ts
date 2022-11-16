import { SQSEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PruebaConceptoService } from './src/main/services/PruebaConceptoService';
import Store from './src/main/config/Settings';
import { ResponseModel } from './src/main/models/Models';
import DBConnection from './src/main/repository/DBConnection';
import { TABLE } from './src/main/types/Constants';
import { ApisDTO } from './src/main/dto/ApisDTO';
import * as CONSTANTS from './src/main/types/Constants';


export const handler = async (event: SQSEvent, context: any, callback:any): Promise<ResponseModel> => {
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
    // db instance
    const db = DBConnection.getInstance(region);
    const table = parameters.get(TABLE) || '';
    const repository = new Repository(db, table);

    const apisDTO = new ApisDTO(parameters)
    const service = new PruebaConceptoService(apisDTO,repository);
    let body = JSON.parse(event.Records[0].body)
    let rm: ResponseModel = await service.pruebaConcepto(body);
    console.log('Respuesta service', rm.result);
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
    return rm.result
}