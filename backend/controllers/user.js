import user from "../models/user.js";
import role from "../models/role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send({ message: "Datos incompletos" });

  const existingUser = await user.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send({ message: "El usuario ya está registrado" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const roleId = await role.findOne({ name: "user" });
  if (!role) return res.status(400).send({ message: "No fue asignado un rol" });

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: roleId._id,
    dbStatus: true,
  });

  const result = await userRegister.save();

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: result._id,
          name: result.name,
          roleId: result.roleId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Error al registrar" });
  }
};

const registerAdminUser = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send({ message: "Datos incompletos" });

  const existingUser = await user.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send({ message: "El usuario ya está registrado" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: req.body.roleId,
    dbStatus: true,
  });

  const result = await userRegister.save();
  return !result
    ? res.status(400).send({ message: "Error al registrar" })
    : res.status(200).send({ result });
};

const listUsers = async (req, res) => {
  const userList = await user
    .find({
      $and: [
        { name: new RegExp(req.params["name"], "i") },
        { dbStatus: "true" },
      ],
    })
    .populate("roleId")
    .exec();
  return userList.length === 0
    ? res.status(400).send({ message: "La lista de usuarios está vacía" })
    : res.status(200).send({ userList });
};

const listAllUser = async (req, res) => {
  const userList = await user
    .find({
      $and: [{ name: new RegExp(req.params["name"], "i") }],
    })
    .populate("roleId")
    .exec();
  return userList.length === 0
    ? res.status(400).send({ message: "La lista de usuarios está vacía" })
    : res.status(200).send({ userList });
};

const findUser = async (req, res) => {
  const userfind = await user
    .findById({ _id: req.params["_id"] })
    .populate("roleId")
    .exec();
  return !userfind
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({ userfind });
};

const getUserRole = async (req, res) => {
  let userRole = await user
    .findOne({ email: req.params.email })
    .populate("roleId")
    .exec();
  if (userRole.length === 0)
    return res.status(400).send({ message: "No se encontraron resultados" });

  userRole = userRole.roleId.name;
  return res.status(200).send({ userRole });
};

const updateUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send({ message: "Datos incompletos" });

  const searchUser = await user.findById({ _id: req.body._id });
  if (req.body.email !== searchUser.email)
    return res
      .status(400)
      .send({ message: "El email no puede ser cambiado" });

  let pass = "";

  if (req.body.password) {
    const passHash = await bcrypt.compare(
      req.body.password,
      searchUser.password
    );
    if (!passHash) {
      pass = await bcrypt.hash(req.body.password, 10);
    } else {
      pass = searchUser.password;
    }
  } else {
    pass = searchUser.password;
  }

  const existingUser = await user.findOne({
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });
  if (existingUser)
    return res.status(400).send({ message: "No has realizado ningún cambio" });

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error editando usuario" })
    : res.status(200).send({ message: "Usuario actualizado" });
};

const deleteUser = async (req, res) => {
  if (!req.body._id) return res.status(400).send("Datos incompletos");

  const userDelete = await user.findByIdAndUpdate(req.body._id, {
    dbStatus: false,
  });
  return !userDelete
    ? res.status(400).send({ message: "Usuario no encontrado" })
    : res.status(200).send({ message: "Usuario no encontrado" });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Datos incompletos" });

  const userLogin = await user.findOne({ email: req.body.email });
  if (!userLogin)
    return res.status(400).send({ message: "Correo o contraseña erróneos" });

  const hash = await bcrypt.compare(req.body.password, userLogin.password);
  if (!hash)
    return res.status(400).send({ message: "Correo o contraseña erróneos" });

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: userLogin._id,
          name: userLogin.name,
          roleId: userLogin.roleId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Error al iniciar sesión" });
  }
};

export default {
  registerUser,
  registerAdminUser,
  listUsers,
  listAllUser,
  findUser,
  updateUser,
  deleteUser,
  login,
  getUserRole,
};
