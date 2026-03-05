import { createProgram } from './program.ts';

const program = createProgram();
program.parseAsync(process.argv).catch(() => {
  process.exit(1);
});
