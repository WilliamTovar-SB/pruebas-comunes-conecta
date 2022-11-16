import { INTERNAL_SERVER_ERROR, ERROR_MESSAGE } from '../types/ResponseTypes';

export interface IRequest{
    urlParameter: string
}

export interface IError {
    type: string,
    description: string,
}

export class CustomError implements IError {
    type: string;
    description: string;

    constructor(type: string, description: string) {
        this.type = type;
        this.description = description;
    }
}

export class pocRequest implements IRequest {
    urlParameter = "53281";
}

export class ResponseModel {
    statusCode: number;
    response: boolean;
    message: string;
    result: any;
    errors: Array<CustomError>;

    constructor() {
        this.statusCode = INTERNAL_SERVER_ERROR;
        this.response = false;
        this.message = ERROR_MESSAGE;
        this.result = {};
        this.errors = [];
    }

    setResponse(status: number, res: boolean, msg: string, result?: any, errors?: any): void {
        this.statusCode = status;
        this.response = res;
        this.message = msg;
        this.result = result;
        this.errors = errors;
    }
}