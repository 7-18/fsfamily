import dream from "../models/dream.js";
import fs from "fs";
import path from "path";
import moment from "moment";

const saveDream = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Datos incompletos" });

  const dreamSchema = new dream({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    DreamStatus: "corto",
    imageUrl: "",
  });

  const result = await dreamSchema.save();
  return !result
    ? res.status(400).send({ message: "Error regitrando objetivo" })
    : res.status(200).send({ result });
};

const saveDreamImg = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Datos incompletos" });

  let imageUrl = "";
  if (Object.keys(req.files).length === 0) {
    imageUrl = "";
  } else {
    if (req.files.image) {
      if (req.files.image.type != null) {
        const url = req.protocol + "://" + req.get("host") + "/";
        const serverImg =
          "./uploads/" + moment().unix() + path.extname(req.files.image.path);
        fs.createReadStream(req.files.image.path).pipe(
          fs.createWriteStream(serverImg)
        );
        imageUrl =
          url +
          "uploads/" +
          moment().unix() +
          path.extname(req.files.image.path);
      }
    }
  }

  const dreamSchema = new dream({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    DreamStatus: "corto",
    imageUrl: imageUrl,
  });

  const result = await dreamSchema.save();
  if (!result)
    return res.status(400).send({ message: "Error registrando objetivo" });
  return res.status(200).send({ result });
};

const listDream = async (req, res) => {
  const DreamList = await dream.find({ userId: req.user._id });
  return DreamList.length === 0
    ? res.status(400).send({ message: "Aún no has creado objetivos" })
    : res.status(200).send({ DreamList });
};

const updateDream = async (req, res) => {
  if (!req.body._id || !req.body.DreamStatus)
    return res.status(400).send({ message: "Datos incompletos" });

  const DreamUpdate = await dream.findByIdAndUpdate(req.body._id, {
    DreamStatus: req.body.DreamStatus,
  });

  return !DreamUpdate
    ? res.status(400).send({ message: "Objetivo no encontrado" })
    : res.status(200).send({ message: "Objetivo actualizado" });
};

const deleteDream = async (req, res) => {
  let DreamImg = await dream.findById({ _id: req.params["_id"] });

  DreamImg = DreamImg.imageUrl;
  DreamImg = DreamImg.split("/")[4];
  let serverImg = "./uploads/" + DreamImg;

  const DreamDelete = await dream.findByIdAndDelete({ _id: req.params["_id"] });
  if (!DreamDelete) return res.status(400).send({ message: "Objetivo no encontrado" });

  try {
    if (DreamImg) fs.unlinkSync(serverImg);
    return res.status(200).send({ message: "Objetivo borrado" });
  } catch (e) {
    console.log("Imagen no encontrada");
  }
};

export default { saveDream, saveDreamImg, listDream, updateDream, deleteDream };
