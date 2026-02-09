// export const sendResponse = (res, statusCode, message, data = null, meta = {}) => {
//     const response = {
//         success: statusCode < 400,
//         message,
//         ...(data !== null && data !== undefined && { data }),
//         meta: {
//             timestamp: new Date().toISOString(),
//             ...meta,
//         },
//     };

    
//     res.status(statusCode).json(response);
// };
export const sendResponse = (
  res,
  {
    statusCode = 200,
    message = "Success",
    data = null,
    meta = {},
    error = null,
  }
) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
};