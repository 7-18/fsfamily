import role from "../models/role.js";

const registerRole = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Datos incompletos" });

  const existingRole = await role.findOne({ name: req.body.name });
  if (existingRole)
    return res.status(400).send({ message: "El rol ya existe" });

  const roleSchema = new role({
    name: req.body.name,
    description: req.body.description,
    dbStatus: true,
  });

  const result = await roleSchema.save();
  return !result
    ? res.status(400).send({ message: "Error registrando rol" })
    : res.status(200).send({ result });
};

const listRole = async (req, res) => {
  const roleList = await role.find();
  return roleList.length == 0
    ? res.status(400).send({ message: "La lista de roles está vacía" })
    : res.status(200).send({ roleList });
};

const updateRole = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Datos incompletos" });

  const existingRole = await role.findOne({
    name: req.body.name,
    description: req.body.description,
  });
  if (existingRole)
    return res.status(400).send({ message: "El rol ya existe" });

  const roleUpdate = await role.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
  });

  return !roleUpdate
    ? res.status(400).send({ message: "Error editando rol" })
    : res.status(200).send({ message: "Rol actualizado" });
};

const deleteRole = async (req, res) => {
  const roleDelete = await role.findByIdAndDelete({ _id: req.params["_id"] });
  return !roleDelete
    ? res.status(400).send({ message: "Rol no encontrado" })
    : res.status(200).send({ message: "Rol detectado" });
};

const findRole = async (req, res) => {
  const roleId = await role.findById({ _id: req.params["_id"] });
  return !roleId
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({ roleId });
};

export default { registerRole, listRole, updateRole, deleteRole, findRole };
