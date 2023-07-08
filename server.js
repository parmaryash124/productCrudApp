const express = require("express");
const app = express();
const routes = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");

app.listen(4000, () => {
  console.log("Server is runnig on 4000 port..");
});

app.use(express.json());


// register  routes...
app.use("/api", routes);

// global error handle middleware.
app.use(errorHandler);
