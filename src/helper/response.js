module.exports = function Response(status, message, data) {
    return {
        status,
        message,
        data,
    };
};
