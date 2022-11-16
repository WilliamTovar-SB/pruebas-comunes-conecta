import { ResponseModel } from '../models/Models';
import { ApisDTO } from '../dto/ApisDTO';

export class PruebaConceptoService {

    //private parameters: Map<string, string>;
    private apisDTO: ApisDTO;

    constructor(commonsDTO: ApisDTO) {
        this.apisDTO = commonsDTO;
        //this.parameters = this.apisDTO.getParameters();
    }

    public async pruebaConcepto (urlParameterTest: string): Promise<ResponseModel> {
        console.log("Inicio :: pruebaConcepto");
        let onespanResponse = await this.apisDTO.consultarURL(urlParameterTest);
        console.log('return RM (Salida)', onespanResponse);
        return onespanResponse;
    }

}