export function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        console.log(payload);
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
}