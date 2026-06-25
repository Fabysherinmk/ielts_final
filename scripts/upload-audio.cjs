const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const accessKey = 'd62519588af382c80dcfb04de2dc2d22';
const secretKey = '5b4f44392a064761151a138928e69790051982867e925fa674ae9ef27c2d408d';
const host = '4fd82676dc0328c3ae8812138409e980.r2.cloudflarestorage.com';
const bucket = 'test-bucket';

function sign(method, path, headers = {}, bodySha256) {
  const service = 's3';
  const region = 'auto';
  const amzDate = new Date().toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
  const dateStamp = amzDate.substr(0, 8);

  headers['host'] = host;
  headers['x-amz-date'] = amzDate;
  headers['x-amz-content-sha256'] = bodySha256;

  const sortedKeys = Object.keys(headers).sort();
  const canonicalHeaders = sortedKeys.map(k => `${k.toLowerCase()}:${headers[k].trim()}`).join('\n') + '\n';
  const signedHeaders = sortedKeys.map(k => k.toLowerCase()).join(';');

  const canonicalRequest = [
    method,
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    headers['x-amz-content-sha256']
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const hashedRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    hashedRequest
  ].join('\n');

  const kDate = crypto.createHmac('sha256', 'AWS4' + secretKey).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return headers;
}

async function uploadFile(filePath, key) {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  
  const headers = sign('PUT', `/${bucket}/${key}`, {
    'content-type': 'audio/mpeg'
  }, hash);

  const url = `https://${host}/${bucket}/${key}`;
  console.log(`Uploading ${filePath} -> ${url}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: content
  });
  console.log(`Response status for ${key}: ${res.status}`);
}

async function main() {
  const files = [
    'cambridge-17-test-1-part-1.mp3',
    'cambridge-17-test-1-part-2.mp3',
    'cambridge-17-test-1-part-3.mp3',
    'cambridge-17-test-1-part-4.mp3'
  ];

  const audioDir = path.resolve(__dirname, '../public/uploads/audio');
  for (const file of files) {
    const filePath = path.join(audioDir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      continue;
    }
    await uploadFile(filePath, `audio/${file}`);
  }
}

main().catch(console.error);
