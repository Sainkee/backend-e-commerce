import customError from "../utils/error.js";

const roleMiddleware = (roles) => (req, _, next) => {
  try {
    const incomingRole = req.user.role;
    console.log(incomingRole);

    if (!roles.includes(incomingRole)) {
      throw new customError(
        `As a ${incomingRole}, this endpoint is not accessible`,
        403
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default roleMiddleware;
