import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getRoutes } from "@/app/actions";

async function verify() {
  console.log("Fetching routes...");
  const routes = await getRoutes();
  console.log("Found " + routes.length + " routes:");
  console.log(JSON.stringify(routes, null, 2));
}

verify()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
