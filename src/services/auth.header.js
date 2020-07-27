
const AuthHeader = () => {
    let data = JSON.parse(window.localStorage.getItem('authData'));
    if (data && data.accessToken) {
        return { Authorization: `Bearer ${data.accessToken}` };
    } else {
        return {};
    }
}

export default AuthHeader;