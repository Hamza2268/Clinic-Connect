import db from "./../db.js";

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(async (err) => {
      await db.query("ROLLBACK");
      next(err);
    });
  };
};

export default catchAsync;
