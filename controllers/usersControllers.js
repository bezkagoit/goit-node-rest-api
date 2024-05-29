import userService from "../services/usersServices.js";

async function register(req, res, next) {
  try {
    const {email, password, subscription="starter"} = req.body;
    const result = await userService.registerUser({email, password, subscription});
    if (result === null) {
      res.status(409).send({ message: "User already registered" });
    }
    return res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
      }
    })
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    
    if (result === null) {
      return res.status(401).send({ message: "Email or password is incorrect" });
    }

    return res.status(200).send({
      token: result.token,
      user: {
        email: result.user.email,
        subscription: result.user.subscription,
      },
    });
  } catch (error) {
    if (error.message === "Email or password is incorrect") {
      res.status(401).send({ message: error.message });
    } else {
      next(error);
    }
  }
}

async function current(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    const result = await userService.currentUser(authorizationHeader);

    return res.status(200).send(result)
  }
  catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await userService.logoutUser(req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const result = await userService.updateSubscription(
      req.user.id,
      req.body.subscription
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout , current , updateSubscription};
