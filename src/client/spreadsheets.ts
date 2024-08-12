import { GoogleSpreadsheet } from "google-spreadsheet";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env` });

export class SpreadsheetService {
  private doc: GoogleSpreadsheet;

  constructor(sheetId: string) {
    this.doc = new GoogleSpreadsheet(sheetId);
  }

  async initialize() {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!clientEmail || !privateKey) {
      throw new Error("Preencher as envs corretamente");
    }

    try {
      await this.doc.useServiceAccountAuth({
        client_email: clientEmail,
        private_key: privateKey,
      });
      await this.doc.loadInfo();
    } catch (error) {
      console.log("Erro ao inicializar a planilha", error);
    }
  }

  async getRows<T>(sheetTitle: string): Promise<T[]> {
    try {
      const sheet = this.doc.sheetsByTitle[sheetTitle];
      const rows = await sheet.getRows();
      return rows as unknown as T[];
    } catch (error) {
      console.log("Erro ao obter linhas da planilha", error);
      throw error;
    }
  }
}
