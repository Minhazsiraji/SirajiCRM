import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Load the single repo-root .env for the standalone scripts (migrate, seed),
// which run from packages/db and otherwise wouldn't see it. dotenv silently
// does nothing if the file is absent (e.g. CI, where vars are set directly).
config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env') });
