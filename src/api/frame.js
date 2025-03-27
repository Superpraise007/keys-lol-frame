const { Wallet } = require("ethers");
const { Keypair } = require("@solana/web3.js");
const { createCanvas } = require("canvas");

module.exports = async (req, res) => {
  const { method, path, query } = req;
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const generateImage = (type, priv, pub) => {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";

    if (type === "initial") {
      ctx.fillText("Welcome to Keys.lol Frame", 50, 50);
      ctx.fillText("Generate test keys below:", 50, 100);
    } else {
      ctx.fillText(`Generated ${type.toUpperCase()} Keys`, 50, 50);
      ctx.fillText(`Public Key: ${pub}`, 50, 100);
      ctx.fillText(`Private Key: ${priv}`, 50, 150, 700);
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 24px Arial";
      ctx.fillText("WARNING: For testing only.", 50, 300);
      ctx.fillText("Never use for significant funds!", 50, 340);
    }

    return canvas.toBuffer("image/png");
  };

  if (method === "GET" && path === "/api/frame") {
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/frame/image?type=initial" />
          <meta property="fc:frame:button:1" content="Generate EVM Keys" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="${baseUrl}/api/frame/evm" />
          <meta property="fc:frame:button:2" content="Generate SOL Keys" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="${baseUrl}/api/frame/sol" />
        </head>
      </html>
    `);
  } else if (method === "POST" && path === "/api/frame/evm") {
    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const publicKey = wallet.address;
    const imageUrl = `${baseUrl}/api/frame/image?type=evm&priv=${encodeURIComponent(privateKey)}&pub=${encodeURIComponent(publicKey)}`;
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
        </head>
      </html>
    `);
  } else if (method === "POST" && path === "/api/frame/sol") {
    const keypair = Keypair.generate();
    const privateKey = Buffer.from(keypair.secretKey).toString("base64");
    const publicKey = keypair.publicKey.toString();
    const imageUrl = `${baseUrl}/api/frame/image?type=sol&priv=${encodeURIComponent(privateKey)}&pub=${encodeURIComponent(publicKey)}`;
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
        </head>
      </html>
    `);
  } else if (method === "GET" && path === "/api/frame/image") {
    const { type = "initial", priv, pub } = query;
    const imageBuffer = generateImage(type, priv, pub);
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } else {
    res.status(404).send("Not Found");
  }
};
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
