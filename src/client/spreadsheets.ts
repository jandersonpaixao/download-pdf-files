import { GoogleSpreadsheet } from "google-spreadsheet";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env` });

let doc: any;
export const initializeSheet = async (sheetId: string) => {
  doc = new GoogleSpreadsheet(sheetId);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
};
export const getRows = async <T>({ sheetTitle }: { sheetTitle: string }) => {
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetTitle];
  const rows = await sheet.getRows();

  return rows as unknown as T[];
};
