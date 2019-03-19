import Base from "./Base";
import { PINS, STATE } from "./Enums";
import { IDigitalParam, IDigitalReturn } from "./Interfaces";
import Api from "./Api";


export default class Digital extends Base {

    private api: Api = new Api();
    constructor() {
        super();
    }


    async read(pins: PINS | PINS[]): Promise<IDigitalReturn | IDigitalReturn[]> {

        let pinsData: string;
        let data;
        if (pins instanceof Array) {
            pinsData = pins.join(',');
            data = await this.api.getData('digitalMultiRead', `pins=${pinsData}`);
            const pinsResponses = data.value.split(',');
            const returnData: IDigitalReturn[] = [];
            pinsResponses.forEach((element: string, idx: number) => {
                returnData.push({
                    pin: pins[idx],
                    state: element === '1' ? STATE.high : STATE.low
                })
            });
            return returnData;
        }
        else {
            pinsData = pins.toString();
            data = await this.api.getData('digitalRead', `pin=${pinsData}`);
            const returnData: IDigitalReturn = {
                pin: pins,
                state: data.value === '1' ? STATE.high : STATE.low
            }
            return returnData;
        }
    }

    async write(input: IDigitalParam | IDigitalParam[]) {

        if (input instanceof Array) {
            const pins: PINS[] = [];
            const state: STATE[] = []
            input.forEach((val) => {
                pins.push(val.pin);
                state.push(val.state);
            })

            return await this.api.getData('digitalMultiWrite', `pins=${pins.join(',')}&states=${state.join(',')}`);
        }
        else {
            return await this.api.getData('digitalWrite', `pin=${input.pin}&state=${input.state}`);
        }
    }

}