import * as path from "path";
import fs from "fs-extra";
import { downloadPdf, getGoogleDriveDownloadLink } from "../client/downloadPdf";
import { SpreadsheetService } from "../client/spreadsheets";

export const downloadFilesByModules = async () => {
  const spreadsheetService = new SpreadsheetService(
    process.env.ADJUSTMENTS_SPREADSHEET_ID as string
  );

  try {
    await spreadsheetService.initialize();
  } catch (error) {
    console.log("Erro ao inicializar a planilha", error);
    return;
  }

  let rows: any[] = [];
  try {
    rows = await spreadsheetService.getRows<any>("(novo) pós graduação");
  } catch (error) {
    console.log("Erro ao ler a planilha", error);
    return;
  }

  const totalFiles = rows.length;
  let downloadedFiles = 0;

  for (const row of rows) {
    const { linkArquivo, idModulo, nomeArquivo, tipoArquivo } = row;
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
      const filePath = path.join(folderPath, `${nomeArquivo}.${tipoArquivo}`);

      await fs.ensureDir(folderPath);
      const downloadLink = getGoogleDriveDownloadLink(linkArquivo);
      await downloadPdf(downloadLink, filePath);
      console.log(`Arquivo salvo em: ${folderPath}`);
    }
  }

  console.log(`\nTodos os ${downloadedFiles} arquivos foram baixados.`);
};
