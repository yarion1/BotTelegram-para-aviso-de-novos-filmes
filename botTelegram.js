const axios = require("axios");
const fs = require("fs");
var cron = require("node-cron");

// cron.schedule("0 00 * * *", () => {
  console.log("executando uma tarefa a cada minuto");

  async function getData() {
    const api = await axios
      .get("http://143.244.35.200:2095/telegramBot.php")
      .then((data) => {
        const response = data.data;
        fs.writeFileSync(
          "./data/content.json",
          JSON.stringify(response),
          (err) => {
            if (err) throw err;
          }
        );
        if (response) {
          return response;
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return api;
  }
  getData();
// });

