const { Telegraf } = require('telegraf');
const QRCode = require('qrcode');
const express = require('express');

const app = express();
const bot = new Telegraf(process.env.TOKEN || "YOUR_TOKEN_HERE");

const ADMIN_KEY = "Cl339950";
const PRICE = 60;
const IMG = "https://i.ibb.co/3ymZ8zrq/IMG-0792.jpg";
const CHANNEL = "https://t.me/addlist/WIPPhibFLBI4MTZh";

const payments = {
  BTC: "1NtpN3aPZowqEzX16E5cMUHQ16P9KHQtiy",
  ETH: "0x8cBc2AD1dF8c0e42465a9E80c1B84FeB0dEE0D87",
  LTC: "LhWYtDeDPfUtEpbJC2Pho7xQTXfEEXj6UY"
};

const subscribed = new Set();
const admins = new Set();

const tos = `RAK OTP BOT TOS

- All sales FINAL. NO REFUNDS.
- Wrong amount sent = your loss.
- No reselling keys/access.
- Personal use only.
- We not liable for bans.
- 2 days access from payment.
- Support via channel only.

ALL SALES FINAL — NO EXCEPTIONS.

CC CHECKER COMING SOON 🔥`;

bot.start((ctx) => {
  ctx.replyWithPhoto(IMG, {
    caption: `🔥 RAK OTP FORWARDER 🔥

Stealth OTP capture
2 Days — $${PRICE}

Click ENTER BOT`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "ENTER BOT", callback_data: "enter" }],
        [{ text: "VOUCHES", url: CHANNEL }]
      ]
    }
  });
});

bot.action('enter', (ctx) => {
  if (subscribed.has(ctx.from.id)) {
    ctx.reply("✅ Active — forward OTP messages");
    return;
  }
  ctx.replyWithHTML(`🚫 UH OH!

No subscription detected.

Pay first to use bot.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "PAYMENT", callback_data: "pay" }],
        [{ text: "BACK", callback_data: "start" }]
      ]
    }
  });
});

bot.action('pay', (ctx) => {
  ctx.replyWithHTML(`<b>PAY $${PRICE} — 2 DAYS</b>`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "BTC", callback_data: "btc" }],
        [{ text: "ETH", callback_data: "eth" }],
        [{ text: "LTC", callback_data: "ltc" }],
        [{ text: "TOS", callback_data: "tos" }],
        [{ text: "VOUCHES", url: CHANNEL }],
        [{ text: "BACK", callback_data: "enter" }]
      ]
    }
  });
});

bot.action('tos', (ctx) => ctx.reply(tos));

['btc','eth','ltc'].forEach(c => {
  bot.action(c, async (ctx) => {
    const coin = c.toUpperCase();
    const addr = payments[coin];
    const qr = await QRCode.toDataURL(`bitcoin:${addr}`);
    ctx.replyWithPhoto({ url: qr }, {
      caption: `<b>${coin} — $${PRICE}</b>\n\n<code>${addr}</code>\n\nAfter payment — bot auto activates\n\nVOUCHES: ${CHANNEL}`,
      parse_mode: 'HTML'
    });
  });
});

bot.command('id', (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args[1] === ADMIN_KEY) {
    admins.add(ctx.from.id);
    ctx.replyWithHTML(`
🔥 ADMIN SANDBOX

Fake OTP panel active

Forward message → fake logs (IP, device, code)

CC CHECKER COMING SOON
    `);
  }
});

bot.on('message', (ctx) => {
  if (admins.has(ctx.from.id)) {
    const fakeCode = ctx.message.text.match(/\d{4,8}/g) || ["XXXXXX"];
    const fakeIP = `185.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    const fakeDevice = ["iPhone 15", "Samsung S24", "Pixel 8"][Math.floor(Math.random()*3)];
    ctx.replyWithHTML(`
<b>[SANDBOX LOG]</b>

Process started...
Bypassing 2FA...
Code intercepted: <code>${fakeCode.join(' ')}</code>
IP: ${fakeIP}
Device: ${fakeDevice}

<b>CODE CAUGHT!</b>
Delivered to panel 🔥
    `);
    return;
  }

  if (!subscribed.has(ctx.from.id)) {
    subscribed.add(ctx.from.id);
    ctx.replyWithHTML(`
✅ SUBSCRIPTION ACTIVE

2 Days OTP Forwarding

Forward OTP → captured

CC CHECKER COMING SOON
    `);
  } else {
    ctx.reply("✅ Code captured");
  }
});

app.get('/', (req, res) => res.send('RAK OTP BOT LIVE'));
app.listen(process.env.PORT || 3000);

bot.launch();
console.log("RAK OTP BOT vFinal LIVE");
