import * as CryptoJS from "crypto-js";

interface IEncryptionService {
  decrypt(cipherText: string): Promise<string>;
}

class Constants {
  private static readonly KEY: string = "eath#4otherud45&eri)gu52lare[ke!";
  private static readonly IV: string = "Ay99ncSiWopl$ssi";

  public static getKey(): string {
    return this.KEY;
  }

  public static getIV(): string {
    return this.IV;
  }
}

export class EncryptionService implements IEncryptionService {
  private readonly key: CryptoJS.lib.WordArray;
  private readonly iv: CryptoJS.lib.WordArray;

  constructor() {
    // Convert key and IV to WordArray format
    this.key = CryptoJS.enc.Utf8.parse(Constants.getKey());
    this.iv = CryptoJS.enc.Utf8.parse(Constants.getIV());
  }

  public async decrypt(cipherText: string): Promise<string> {
    try {
      // Decode the base64 cipher text
      const cipherParams = CryptoJS.enc.Base64.parse(cipherText);

      // Perform decryption
      const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: cipherParams }),
        this.key,
        {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Convert the decrypted data to UTF-8 string
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : error}`
      );
    }
  }
}
