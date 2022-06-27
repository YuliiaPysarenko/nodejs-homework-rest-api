const { authenticateUser } = require("../services");

const authCheck = async (req, res, next) => {
  try {
    // 1. Get token from Request headers
    const { authorization = "" } = req.headers;
    // 2. Validate token
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 3. Extract user id and find user by id
    // 4. Verify that user token and save token
    const user = await authenticateUser(token);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 5. Write user to Request
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  authCheck
};
