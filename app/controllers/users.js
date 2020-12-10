class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async create(req, res) {
    try {
      const { body } = req;
      const result = await this.userService.createUser(body);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async auth(req, res) {
    try {
      const { body } = req;
      const result = await this.userService.authenticateUser(body);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async getAll(req, res) {
    try {
      const result = await this.userService.getAllUser();

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async get(req, res) {
    try {
      const { username } = req.params;
      const result = await this.userService.getUser(username);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async update(req, res) {
    try {
      const { username } = req.params;
      const { body } = req;
      const result = await this.userService.updateUser(username, body);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }

  async delete(req, res) {
    try {
      const { username } = req.params;
      const result = await this.userService.deleteUser(username);

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = UserController;
