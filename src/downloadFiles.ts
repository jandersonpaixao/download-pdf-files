import * as dotenv from "dotenv";
import { downloadFilesByModules } from "./service/adjustFileData";

dotenv.config({ path: `.env` });

const run = async () => {
  await downloadFilesByModules();
};

run();
