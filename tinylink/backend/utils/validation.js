const validator = require('validator');

const isValidUrl = (url) => {
    return validator.isURL(url, { require_protocol: true });
};

const validateCode = (code) => {
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    return codeRegex.test(code);
};

module.exports = {
    isValidUrl,
    validateCode
};
