import fs from "fs";

export default (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.filename, (err) => {
      next(err);
    });
  }
  const errorResponse = {
    status: err.statusCode ? err.statusCode : 500,
    message: err.customMessage ? err.customMessage : "Please contact the ADMIN",
  };
  errorResponse.err_stack = err;
  res.status(errorResponse.status).send(errorResponse);
};
