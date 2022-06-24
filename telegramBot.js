const fs = require("fs");
require("dotenv").config();
const axios = require("axios");
var cron = require("node-cron");
cron.schedule("00 20 * * *", () => {
  console.log("executando uma tarefa a cada minuto");
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID_TO_NOTIFY, TELEGRAM_API_URL } =
    process.env;

  run();

  async function run() {
    try {
      const dijanira = await getContents();
      if (dijanira.length) {
        var text = "NOVOS CONTEÚDOS ADICIONADOS (IPTV):\n";
        var contentText = "";
        var countContent = 0;
        var group = [];
        var cat = [];

        const groupByCategory = dijanira.reduce((category, dija) => {
          const { categories } = dija;
          cat.push(categories);

          group[categories] = group[categories] || [];
          group[categories].push({ dija });
          return group;
        }, {});
        cat = [...new Set(cat)];
        const groups = Array(groupByCategory);

        groups
          .filter((cat) => {
            return cat;
          })
          .forEach((item) => {
            cat.forEach((c) => {
              contentText += `\n${
                c !== null ? c.replace("Filmes | ", "") : "Séries"
              }:\n`;
              item[`${c}`].forEach((res) => {
                const { dija } = res;
                if (countContent < 90) {
                  contentText += `${dija.name}\n`;
                  countContent++;
                }
              });
            });
          });

        text += `${
          contentText.length > 0 ? `\n${contentText}` : ""
        }\n\nPara mais detalhes acesse a plataforma!`;

        sendMessage(text);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getContents() {
    let dijanira = fs.readFileSync("./data/content.json", "utf8");
    return JSON.parse(dijanira);
  }

  async function sendMessage(text) {
    const url = `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = {
      chat_id: TELEGRAM_CHAT_ID_TO_NOTIFY,
      disable_web_page_preview: true,
      text,
    };
    await axios.post(url, data);
  }
});
