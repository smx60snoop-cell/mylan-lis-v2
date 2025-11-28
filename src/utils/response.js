export const sendSuccess = (res, message, data = {}) => {
    return res.status(200).json({
        status: "success",
        message,
        data
    });
};

export const sendError = (res, message, status = 400, details = null) => {
    return res.status(status).json({
        status: "error",
        message,
        details
    });
};

export const sendNotFound = (res, message = "Not found") => {
    return res.status(404).json({
        status: "error",
        message
    });
};

export const sendUnauthorized = (res, message = "Unauthorized") => {
    return res.status(401).json({
        status: "error",
        message
    });
};
