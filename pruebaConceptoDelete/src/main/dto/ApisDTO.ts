import { CustomError, ResponseModel } from '../models/Models';
import * as RESPONSES from '../types/ResponseTypes';
import axios from 'axios';

export class ApisDTO {
  /*
    private parameters: Map<string, string>;

    constructor(parameters: Map<string, string>) {
        this.parameters = parameters;
    }
    public getParameters = (): Map<string, string> => {
        return this.parameters;
    }
*/
    public consultarURL = async (urlParameter: string): Promise<ResponseModel> => {
        let response = new ResponseModel();
        let statusCode: number = RESPONSES.INTERNAL_SERVER_ERROR;
        console.log("Inicia consulta del urlParameter")
        try {
            let params: any = {
                'urlParameter': `${urlParameter}`
            }
            let url: string = `https://fz73xehwah.execute-api.us-east-1.amazonaws.com/dev/notificacion/api/v1/urloriginal`;
            console.log("url:", url);
            let responseMS = await axios.get(url, {
                responseType: 'json',
                params
            });
            console.log("responseMS:", responseMS);
            if (responseMS.status == 200) {
                let dataResponse = responseMS.data;
                response.setResponse(responseMS.status, true, RESPONSES.TASK_DONE_SUCCESFULLY, dataResponse, [])
            } else {
                let error: CustomError = new CustomError(responseMS.data.name, responseMS.data.message);
                response = this.responseError(responseMS.status, RESPONSES.ERROR_EXTERNAL, [error]);
            }
        } catch (error: any) {
            console.log("Error response:", error);
            if (error?.response?.data) {
                response = this.responseError(RESPONSES.BAD_REQUEST, RESPONSES.ERROR_EXTERNAL, error.response.data?.errores);
            } else {
                response = this.responseError(statusCode, RESPONSES.ERROR_MESSAGE, error);
            }
        }
        return response;
    }


    private responseError = (statusCode: number, message: string, responseError: any): ResponseModel => {
        let response = new ResponseModel();
        let errors: Array<CustomError> = this.getArrayError(responseError);
        response.setResponse(statusCode, false, message, null, errors);
        return response;
    }

    private getArrayError = (response: any): Array<CustomError> => {
        let errors: Array<CustomError> = [];
        let typeErrorExternal = RESPONSES.ERROR_EXTERNAL;
        if (Array.isArray(response)) {
            response.forEach(itemError => {
                let descriptionError = "";
                if (itemError?.descripcion) {
                    descriptionError = itemError.descripcion;
                }
                let errorExternal: CustomError = new CustomError(typeErrorExternal, descriptionError);
                errors.push(errorExternal);
            });
        } else {
            let errorExternal: CustomError = new CustomError("Logic error", RESPONSES.ERROR_MESSAGE);
            errors.push(errorExternal);
        }
        return errors;
    }
}