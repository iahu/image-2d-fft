import fs from 'node:fs/promises';

const fp = './img.png';
const utf8 = await fs.readFile(fp, { encoding: 'utf8' });
const hex = await fs.readFile(fp, { encoding: 'hex' });
const binary = await fs.readFile(fp, { encoding: 'binary' });
const bf = await fs.readFile(fp);

const textToTypedArray = (text: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(text);
};

const textToBlob = (text: string, contentType?: string) => new Blob([text], { type: contentType });

// fs.writeFile('./utf8.text', utf8);
// fs.writeFile('./hex.text', hex);
// fs.writeFile('./binary.text', binary);

fs.writeFile('./out-buffer.png', bf);
fs.writeFile('./out-utf8.png', Buffer.from(utf8, 'utf8'));
fs.writeFile('./out-hex.png', Buffer.from(hex, 'hex'));
fs.writeFile('./out-binary.png', Buffer.from(binary, 'binary'));
fs.writeFile('./out-u2h.png', Buffer.from(Buffer.from(utf8, 'utf8').toString('hex'), 'hex'));
