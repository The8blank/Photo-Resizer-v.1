const fs = require("fs").promises;
const sharp = require("sharp");
const path = require("path");

const inputFolder = "C:/Users/samue/Desktop/a";
const outputFolder = "C:/Users/samue/Desktop/m";


const acceptedFormats = ["jpeg", "jpg", "webp", "png", "tiff"];
// indiquer les formats souhaitez
const formats = [/* "jpeg",  */"webp"/* , "png", "tiff" */];
// indiquer les tailles souhaitez
const sizes = [ 1280];

const createfolder = async (formats, sizes) => {
  // Si le dossier de sortie n'existe pas, créez-le
  try {
    await fs.promises.access(outputFolder);
  } catch (error) {
    await fs.mkdir(outputFolder,{ recursive: true });
  }
  // Création des dossiers de sortie pour chaque format et taille
  for (const format of formats) {
    const formatFolder = `${outputFolder}/${format}`;
    // Si le dossier de format n'existe pas, créez-le
    try {
      await fs.promises.access(formatFolder);
    } catch (error) {
      await fs.mkdir(formatFolder);
    }

    for (const size of sizes) {
      const sizeFolder = `${formatFolder}/${size}`;
      // Si le dossier de taille n'existe pas, créez-le
      try {
        await fs.promises.access(sizeFolder);
      } catch (error) {
        await fs.mkdir(sizeFolder);
      }
    }
  }
};

const convertPhotos = async () => {
  // Lecture des fichiers de l'inputFolder
  const inputFiles = await fs.readdir(inputFolder);
  // Conversion de chaque fichier de l'inputFolder
  for (const file of inputFiles) {
    // Chemin du fichier
    const filePath = path.join(inputFolder, file);
    // Extension du fichier
    const fileExtension = file.split(".").pop().toLowerCase();
    //     // Nom du fichier sans l'extension
    const fileName = file.slice(0, -(fileExtension.length + 1));

    // Si le fichier est dans un des formats acceptés
    if (acceptedFormats.includes(fileExtension)) {
      console.debug(`Chargement de ${file}`);

      for (const format of formats) {
        for (const size of sizes) {
          // Chargement de l'image à chaque itération
          const image = await sharp(filePath);
          // Redimensionnement de l'image en conservant la résolution d'origine
          const resizedImage = image.clone().resize({ width: size, height: null, fit: "inside" });
          // Conversion de l'image
          const convertedImage = await resizedImage.toFormat(format, {
            quality: 100,
            progressive: true,
            chromaSubsampling: "4:4:4",
          });
          // Enregistrement de l'image dans le dossier de sortie
          await fs.writeFile(`${outputFolder}/${format}/${size}/${fileName}.${format}`, convertedImage);
        }
      }
    }
  }
};

(async () => {
  console.debug("Création des dossiers de sortie");
  await createfolder(formats, sizes);
  console.debug("Conversion des photos");
  await convertPhotos();
  console.debug("Conversion terminée");
})();

