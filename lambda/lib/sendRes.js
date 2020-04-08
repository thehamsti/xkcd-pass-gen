/**
 * Send response
 * @param {Object} err - Any errors to return
 * @param {number} status - Status to return
 * @param {*} res - Response to return if no errors.
 */
const sendRes = (status, res) => {
  const response = {
    statusCode: status || 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(res),
  };

  return response;
};

module.exports = sendRes;
