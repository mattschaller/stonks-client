import axios from "axios";
import AuthHeader from "./auth.header"

const SERVICE_URL ="/users"

const config = {
    headers: AuthHeader()
}

const catchError = e => e;

class UserService {
    list(opts) {
        return axios
            .get(SERVICE_URL, config)
            .then(res => res.data).catch(catchError);
    }
    create(opts) {
        let { email, password } = opts
        return axios.post(SERVICE_URL, {
            email, password
        }, config)
        .then(res => res.data).catch(catchError);
    }

    get(opts) {
        let { _id } = opts
        return axios
            .get(SERVICE_URL + "/" + _id, config)
            .then(res => res.data).catch(catchError);
    };

    update(opts) {
        let { _id, ...data } = opts
        return axios.put(SERVICE_URL + "/" + _id, data, config)
        .then(res => res.data).catch(catchError);
    }

    delete(opts) {
        let { id } = opts
        return axios
            .delete(SERVICE_URL + "/" + id, config)
            .then(res => res.data).catch(catchError);
    };
}

export default new UserService();