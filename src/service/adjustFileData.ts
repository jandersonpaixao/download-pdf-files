import { getRows, initializeSheet } from "../client/spreadsheets";
import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import { TFileData } from "../../types";
import axios from "axios";

export const downloadFilesByModules = async () => {
  try {
    await initializeSheet(process.env.ADJUSTMENTS_SPREADSHEET_ID as string);

    const rows = await getRows<any>({ sheetTitle: "Files" });

    const data: TFileData[] = [];
    rows.forEach((row) => {
      const idModulo = row.idModulo;
      const nomeArquivo = row.nomeArquivo;
      const linkArquivo = row.linkArquivo;

      let infos = {
        idModulo,
        nomeArquivo,
        linkArquivo,
      };
      data.push(infos);

      const savePath = path.join(
        __dirname,
        `../files/${infos.nomeArquivo}.pdf`
      );
      const downloadFilesBysheets = async (url: string, outputPath: string) => {
        const response = await axios({
          url,
          method: "GET",
          responseType: "stream",
        });

        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      };

      downloadFilesBysheets(infos.linkArquivo, savePath).then(() => {
        console.log("Arquivo baixado e salvo com sucesso!");
      });
    });
    console.log("data aqui: ", data);
  } catch (error) {
    console.log("error: ", error);
  }
};
