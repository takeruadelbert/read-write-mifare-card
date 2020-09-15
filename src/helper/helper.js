class Helper {
    static convertHexToUTF8 = (hex) => {
        return Buffer.from(hex, 'hex').toString('utf8');
    }
}

module.exports = Helper;