import axios from "axios";
import AuthHeader from "./auth.header"

const SERVICE_URL = "/stocks"

const config = {
    headers: AuthHeader()
}
const catchError = e => e;

class StockService {
    get(opts) {
        let { symbol } = opts
        return axios
            .get(SERVICE_URL + "/" + symbol, config)
            .then(res => res.data).catch(catchError);
    }
}

export default new StockService();