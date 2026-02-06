const url = process.argv[2];
const timeoutSeconds = Number(process.argv[3] || 30);

if (!url) {
  console.error("Usage: node scripts/wait-for.mjs <url> [timeoutSeconds]");
  process.exit(2);
}

const start = Date.now();
const timeout = timeoutSeconds * 1000;

async function ping() {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return res.status >= 200 && res.status < 500; // treat 404 as “server is up”
  } catch {
    return false;
  }
}

while (Date.now() - start < timeout) {
  // eslint-disable-next-line no-await-in-loop
  if (await ping()) process.exit(0);
  // eslint-disable-next-line no-await-in-loop
  await new Promise((r) => setTimeout(r, 500));
}

console.error(`Timed out waiting for ${url}`);
process.exit(1);
