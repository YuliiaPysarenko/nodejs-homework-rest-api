const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const { AVATARS, PUBLIC_DIR } = require("../helpers/consts");

const uploadImage = async (id, file) => {
  const avatarURL = path.join(AVATARS, `${id}${file.originalname}`);

  try {
    await Jimp.read(file.path)
      .then((avatar) => {
        return avatar
          .resize(250, 250) // resize
          .write(path.join(PUBLIC_DIR, avatarURL)); // save
      })
      .catch((err) => {
        console.error(err);
      });
    return avatarURL;
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    await fs.unlink(file.path);
  }
};

module.exports = {
  uploadImage,
};
