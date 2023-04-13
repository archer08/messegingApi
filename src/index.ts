import app from "./server";
import * as dotenv from "dotenv";
dotenv.config();
app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 3000");
});
