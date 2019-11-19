const app = require('./server');
// import { connectDB } from "./db";

app.listen(3000, () => {
  console.log('Local app listening on port 3000!')
  // connectDB();
});
