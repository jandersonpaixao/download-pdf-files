import { getRows, initializeSheet } from "../client/spreadsheets";
import * as path from "path";
import fs from "fs-extra";
import { downloadPdf, getGoogleDriveDownloadLink } from "../client/downloadPdf";

export const downloadFilesByModules = async () => {
  try {
    await initializeSheet(process.env.ADJUSTMENTS_SPREADSHEET_ID as string);
  } catch (error) {
    console.log("erro ao ler a planilha", error);
  }

  const rows = await getRows<any>({ sheetTitle: "(novo) pós graduação" });

  const totalFiles = rows.length;
  let downloadedFiles = 0;

  for (const row of rows) {
    const linkArquivo = row.linkArquivo;
    const idModulo = row.idModulo;
    const nomeArquivo = row.nomeArquivo;

    downloadedFiles++;
    const percentComplete = ((downloadedFiles / totalFiles) * 100).toFixed(2);
    process.stdout.write(
      `Baixando arquivo ${downloadedFiles} de ${totalFiles} (${percentComplete}%)\r`
    );

    if (linkArquivo && idModulo && nomeArquivo) {
      const folderPath = path.join(
        __dirname,
        `../files/${idModulo.toString()}`
      );
      const filePath = path.join(folderPath, `${nomeArquivo}.pdf`);

      await fs.ensureDir(folderPath);
      const downloadLink = getGoogleDriveDownloadLink(linkArquivo);
      await downloadPdf(downloadLink, filePath);
      console.log(`Arquivo salvo em: ${folderPath}`);
    }
  }

  console.log("\nTodos os arquivos foram baixados.");
};
