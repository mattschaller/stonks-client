import axios from "axios";
import AuthHeader from "./auth.header"

const SERVICE_URL = "/portfolios"

const config = {
    headers: AuthHeader()
}

const catchError = e => e;

class PortfolioService {
    list(opts) {
        let params = "?" + Object.keys(opts).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(opts[k])}`).join('&');
        return axios.get(SERVICE_URL + params, config)
            .then(res => res.data).catch(catchError);
    }

    create(opts) {
        return axios.post(SERVICE_URL, opts, config)
            .then(res => res.data).catch(catchError);
    }

    get(opts) {
        let { userId } = opts
        return axios.get(SERVICE_URL + "/" + userId, config)
            .then(res => res.data).catch(catchError);
    };

    update(opts) {
        let { _id, userId } = opts
        return axios.put(SERVICE_URL + "/" + _id, {userId}, config)
            .then(res => res.data).catch(catchError);
    }

    delete(opts) {
        let { _id } = opts
        return axios.delete(SERVICE_URL + "/" + _id, config)
            .then(res => res.data).catch(catchError);
    };
}

export default new PortfolioService();