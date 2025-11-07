import crypto from "crypto";

const SECRET = "SOME_SECRET";

export const saltRandom = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join("/")).update(SECRET).digest('hex');
}