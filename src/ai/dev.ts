import { config } from 'dotenv';
config();

import '@/ai/flows/generate-preliminary-report.ts';
import '@/ai/flows/detect-data-anomalies.ts';