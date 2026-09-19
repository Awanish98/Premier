import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function generatePremierPng(size) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const center = size / 2;
  const radius = size * 0.44;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Dark obsidian (#06080e)
      let r = 6, g = 8, b = 14, a = 255;

      // Outer glow circle
      if (dist < radius) {
        // Neon gradient border (#95FF50 to #10b981)
        if (dist > radius - (size * 0.06)) {
          r = 149; g = 255; b = 80; a = 255;
        } else if (dist > radius - (size * 0.08)) {
          r = 40; g = 180; b = 80; a = 255;
        } else {
          // Inner card background
          r = 12; g = 18; b = 30; a = 255;

          // Draw "P" logo letter in neon green
          const nx = x / size;
          const ny = y / size;

          // Vertical bar of P: nx from 0.32 to 0.44, ny from 0.25 to 0.75
          const inVerticalBar = (nx >= 0.30 && nx <= 0.42 && ny >= 0.25 && ny <= 0.75);

          // Loop of P: ny from 0.25 to 0.55, nx from 0.30 to 0.70
          const loopDist = Math.hypot(nx - 0.45, ny - 0.40);
          const inLoopOuter = (nx >= 0.30 && nx <= 0.70 && ny >= 0.25 && ny <= 0.55) || (loopDist < 0.16 && nx >= 0.42);
          const inLoopInner = (nx >= 0.42 && nx <= 0.58 && ny >= 0.34 && ny <= 0.46) || (loopDist < 0.08 && nx >= 0.42);

          const inP = inVerticalBar || (inLoopOuter && !inLoopInner);

          if (inP) {
            r = 149; g = 255; b = 80; a = 255;
          }
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type 6: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', zlib.deflateSync(rawData));
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pubDir = path.resolve('public');
fs.writeFileSync(path.join(pubDir, 'pwa-192.png'), generatePremierPng(192));
fs.writeFileSync(path.join(pubDir, 'pwa-512.png'), generatePremierPng(512));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), generatePremierPng(180));
console.log('✅ Generated pwa-192.png, pwa-512.png, and apple-touch-icon.png successfully!');
