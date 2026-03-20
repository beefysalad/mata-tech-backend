import "dotenv/config";
import { buildServer } from "./app.js";

const server = buildServer();

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  //test
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
