// Entity
export function validatePassword (password: string) {
    // validate "", null, undefined;
    // validate < 8 return false;
    // if (!password.match(/\d+/)) return false;
    // if (!password.match(/[a-z]+/)) return false;
    // if (!password.match(/[A-Z]+/)) return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}