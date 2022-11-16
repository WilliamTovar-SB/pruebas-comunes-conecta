import { CustomError, ResponseDynamoModel } from "../models/Models";
import * as RESPONSES from "../types/ResponseTypes";

export class Repository {

    private readonly _dynamo_db: any;
    private readonly response: any;
    private table: string;

    constructor(db: any, table: string) {
        this._dynamo_db = db;
        this.response = { data: {} };
        this.table = table;
    }

    public getTaxonomy = async (paramFilter: any) => {
        const rm = new ResponseDynamoModel()
        let errors: Array<CustomError> = [];
        let resDynamo: any = null;

        const params: any = {
            TableName: this.table,
            ExpressionAttributeValues: paramFilter.ExpressionAttributeValues,
            KeyConditionExpression: paramFilter.KeyConditionExpression

        };
        if (paramFilter.IndexName){
            params["IndexName"] = paramFilter.IndexName
        }
        console.log('Dynamo paramsFilter', params);
        try {
            resDynamo = await this._dynamo_db.query(params).promise();
            console.log('Response dynamo OK', resDynamo);
            rm.setResponse(RESPONSES.OK, resDynamo);
        } catch (error: any) {
            let errorDynamo: CustomError = new CustomError(error.code, error.statusCode + " - " + error.message);
            errors.push(errorDynamo);
            console.error("Response dynamo Err", error);
            rm.setResponse(error.statusCode, null, errors);
        }

        return rm;
    };

}