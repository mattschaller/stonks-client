import axios from "axios";
import AuthHeader from "./auth.header"
import AuthService from "./auth.service"

const SERVICE_URL = "/positions"

const config = {
    headers: AuthHeader()
}

const catchError = e => (e.message.indexOf("401") > -1 ? AuthService.logout() : e);

class PositionService {
    list(opts) {
        let params = "?" + Object.keys(opts).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(opts[k])}`).join('&');
        return axios
            .get(SERVICE_URL + params, config)
                .then(res => res.data).catch(catchError);
    }
    create(opts) {
        console.log('positions.create')
        return axios.post(SERVICE_URL, opts, config)
        .then(res => res.data).catch(catchError);
    }
    get(opts) {
        let { user_id } = opts
        return axios
            .get(SERVICE_URL + "/" + user_id, config)
            .then(res => res.data).catch(catchError);
    };
    update(opts) {
        let { id, user_id } = opts
        return axios.put(SERVICE_URL + "/" + id, {
            user_id
        }, config)
        .then(res => res.data).catch(catchError);
    }
    delete(opts) {
        let { id } = opts
        return axios
            .delete(SERVICE_URL + "/" + id, config)
            .then(res => res.data).catch(catchError);
    };
}

export default new PositionService();