/*
 * Uploads local images as Sanity assets and sets them as a property's gallery.
 *
 * Usage: node upload-gallery.mjs <documentId> <file>|<alt> [<file>|<alt> ...]
 *
 * Order of arguments is the order of the gallery, and gallery[0] is the card
 * and OG image, so the first file passed is the cover.
 *
 * Uses the Sanity CLI's own auth token rather than SANITY_API_TOKEN from
 * .env.local: that one is a read-only viewer token created for draft mode and
 * cannot write.
 */
import { createClient } from '@sanity/client';
import fs from 'fs';
import { execSync } from 'child_process';

for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const debug = execSync('npx sanity debug --secrets', { encoding: 'utf8' });
const token = debug.match(/'(sk[A-Za-z0-9]+)'/)?.[1];
if (!token) throw new Error('could not read the Sanity CLI auth token');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const [docId, ...pairs] = process.argv.slice(2);
if (!docId || pairs.length === 0) throw new Error('need a document id and at least one file|alt');

const gallery = [];
for (const pair of pairs) {
  const idx = pair.indexOf('|');
  const file = pair.slice(0, idx);
  const alt = pair.slice(idx + 1);
  const asset = await client.assets.upload('image', fs.createReadStream(file), {
    filename: file.split(/[\\/]/).pop(),
  });
  console.log(`uploaded ${file} -> ${asset._id} (${asset.metadata.dimensions.width}x${asset.metadata.dimensions.height})`);
  gallery.push({
    _type: 'image',
    _key: `img${gallery.length}`,
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  });
}

await client.patch(docId).set({ gallery }).commit();
console.log(`gallery set on ${docId}: ${gallery.length} image(s)`);
