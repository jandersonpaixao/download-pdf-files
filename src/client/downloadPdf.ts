import axios from "axios";
import fs from "fs-extra";

export const getGoogleDriveDownloadLink = (link: string): string => {
  let fileIdMatch = link.match(/\/d\/(.+?)\//);
  if (!fileIdMatch) {
    fileIdMatch = link.match(/id=([^&]+)/);
  }
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  throw new Error("Invalid Google Drive link");
};

export const downloadPdf = async (
  url: string,
  savePath: string
): Promise<void> => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(
      `Erro ao baixar o arquivo de ${url}:`,
      (error as Error).message
    );
  }
};
