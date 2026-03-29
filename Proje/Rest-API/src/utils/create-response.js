// Create a standardized response for API requests
const createResponse = (res, status, content) => {
  res.status(status).json(content);
};

module.exports = { createResponse };
