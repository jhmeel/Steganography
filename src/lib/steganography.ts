export interface SecretData {
  accessCode: string;
  data: string;
}

class Steganography {
  private static readonly BITS_PER_BYTE = 8;

  public static embedData(
    imageData: Uint8Array,
    secretData: string
  ): Uint8Array {
    const binarySecretData = this.stringToBinary(secretData);
    const embeddedData = imageData.slice(); // Create a copy of the image data

    let dataIndex = 0;
    let embeddedIndex = 0;

    // Embed multiple bits at once
    while (dataIndex < binarySecretData.length) {
      let byte = embeddedData[embeddedIndex];
      const bitsToEmbed = binarySecretData.substr(dataIndex, 8);
      const bits = bitsToEmbed.padEnd(8, "0");

      for (let i = 0; i < Steganography.BITS_PER_BYTE; i++) {
        const bitToEmbed = parseInt(bits[i], 10);
        byte = this.embedBit(byte, bitToEmbed, i);
      }

      embeddedData[embeddedIndex] = byte;
      dataIndex += Steganography.BITS_PER_BYTE;
      embeddedIndex++;
    }

    return embeddedData;
  }

  public static extractData(embeddedData: Uint8Array): string {
    let binaryData = "";
  
    for (let i = 0; i < embeddedData.length; i++) {
      const byte = embeddedData[i];
      const bits = this.extractBits(byte);
      binaryData += bits;
    }
  
    // Ensure binaryData length is a multiple of 8
    const remainder = binaryData.length % 8;
    if (remainder !== 0) {
      binaryData = binaryData.slice(0, binaryData.length - remainder);
    }
  
    const secretData = this.binaryToString(binaryData);
    return secretData;
  }
  
  private static stringToBinary(str: string): string {
    return str
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  }

  private static binaryToString(binaryString: string): string {
    const chunks = binaryString.match(/.{1,8}/g);
    if (!chunks) return "";

    return chunks
      .map((chunk) => String.fromCharCode(parseInt(chunk, 2)))
      .join("");
  }

  private static embedBit(byte: number, bit: number, position: number): number {
    const mask = 1 << (Steganography.BITS_PER_BYTE - position - 1);
    return bit ? byte | mask : byte & ~mask;
  }

  private static extractBits(byte: number): string {
    return byte.toString(2).padStart(Steganography.BITS_PER_BYTE, "0");
  }
}

export function embedImgAndSecret(imageData: Uint8Array, secretData: string) {
  return Steganography.embedData(imageData, secretData);
}

export function exractImageAndSecret(embeddedData: Uint8Array) {
  return Steganography.extractData(embeddedData);
}

/*This `Steganography` class provides two static methods:
  
  1. `embedData(imageData: Uint8ClampedArray, secretData: string): Uint8ClampedArray`: This method takes an `imageData` array (which represents the pixel data of an image) and a `secretData` string as input. It encodes the `secretData` as a binary string and embeds it into the least significant bit of each byte in the `imageData` array. The modified `imageData` array with the embedded data is returned.
  
  2. `extractData(embeddedData: Uint8ClampedArray): string`: This method takes an `embeddedData` array (which is the modified `imageData` array with embedded data) as input. It extracts the least significant bit from each byte in the `embeddedData` array, reconstructs the binary string, and converts it back to the original `secretData` string, which is returned.
  
  The class also has several private helper methods:
  
  - `stringToBinary(str: string): string`: Converts a given string to a binary string representation.
  - `binaryToString(binaryString: string): string`: Converts a binary string representation back to a regular string.
  - `embedBit(byte: number, bit: number): number`: Embeds a single bit into the least significant bit position of a given byte.
  - `extractBit(byte: number): number`: Extracts the least significant bit from a given byte.
  
  Here's an example of how you can use this class:
  
  
  // Load an image and get its pixel data
  const imageData = ; // Uint8ClampedArray
  
  // Secret data to embed
  const secretData = 'This is a secret message.';
  
  // Embed the secret data in the image
  const embeddedImageData = Steganography.embedData(imageData, secretData);
  
  // ... save the embeddedImageData as a new image file ...
  
 Later, to extract the secret data from the image
  const extractedSecretData = Steganography.extractData(embeddedImageData);
  console.log(extractedSecretData); // Output: 'This is a secret message.'
   */
