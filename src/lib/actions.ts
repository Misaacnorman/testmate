'use server';

import { z } from 'zod';

const anomalySchema = z.object({
  experimentalData: z.string().min(1, 'Experimental data cannot be empty.'),
  description: z.string().min(1, 'Experiment description cannot be empty.'),
});

const reportSchema = z.object({
  experimentalData: z.string().min(1, 'Experimental data cannot be empty.'),
});
