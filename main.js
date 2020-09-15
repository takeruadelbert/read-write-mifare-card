const {KEY_TYPE_A, NFC, TAG_ISO_14443_3} = require('nfc-pcsc');
const Helper = require('./src/helper/helper');
const Constant = require("./src/constant");
const nfc = new NFC();

console.log('======================');
console.log(Constant.APP_NAME);
console.log('======================');
nfc.on("reader", async (reader) => {
  console.log(`${reader.reader.name} device attached`);

  reader.on("card", async (card) => {
    if (card.type !== TAG_ISO_14443_3) {
      console.log("Card type is not", TAG_ISO_14443_3);
      return;
    }
    console.log(`${reader.reader.name}  card detected`, card);

    if(await authenticate(reader)) {
      await readCard(reader);
      // await writeCard(reader);
    }
  });

  reader.on("card.off", (card) => {
    console.log(`${reader.reader.name} card removed`, card);
  });

  reader.on("error", (err) => {
    console.log(`${reader.reader.name} an error occurred`, err);
  });

  reader.on("end", () => {
    console.log(`${reader.reader.name} device removed`);
  });
});

nfc.on("error", (err) => {
  console.log("an error occurred", err);
});

async function authenticate(reader) {
  const key = Constant.MIFARE_CLASSIC_DEFAULT_KEY;
  try {
    await reader.authenticate(4, KEY_TYPE_A, key);
    console.info(`sector 1 successfully authenticated`);
    return true;
  } catch (err) {
    console.error(`error when authenticating block 4 within the sector 1:`, err);
    return false;
  }
}

async function readCard(reader) {
  try {
    const data = await reader.read(4, 16, 16);
    console.log("data read:", Helper.convertHexToUTF8(data));
  } catch (err) {
    console.error(`error when reading data : `, err);
  }
}

async function writeCard(reader) {
  try {
    const data = Buffer.allocUnsafe(16);
    data.fill(0);

    const test = "Lukas Fam";
    data.write(test, 0, "utf-8");

    await reader.write(4, data, 16);

    console.info(`data written`);
  } catch (err) {
    console.error(`error when writing data`, reader, err);
  }
}
