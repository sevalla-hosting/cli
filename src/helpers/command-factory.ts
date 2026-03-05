import { Command } from 'commander';
import type { ApiClient } from '../client/api-client.ts';
import { createClient } from '../client/api-client.ts';
import { handleError } from '../errors/handler.ts';
import {
  printJson,
  printTable,
  printResource,
  printSuccess,
  printTimeSeries,
} from '../output/formatter.ts';
import { startSpinner, stopSpinner } from '../output/spinner.ts';
import {
  jsonOption,
  confirmOption,
  paginationOptions,
  metricsOptions,
  resolveJsonMode,
  dryRunOption,
  dataOption,
} from './flags.ts';
import type { ColumnDef } from '../output/table.ts';
import type { PaginatedResponse, MetricsQuery } from '../client/types.ts';
import { validateId } from './validate.ts';

interface CommandContext {
  client: ApiClient;
  json: boolean;
}

function getContext(opts: Record<string, unknown>): CommandContext {
  const client = createClient({ apiUrl: opts['apiUrl'] as string | undefined });
  return { client, json: resolveJsonMode(opts) };
}

function parseDataOption(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON passed to --data. Ensure the value is valid JSON.');
  }
}

export interface ListCommandConfig<T> {
  name: string;
  description: string;
  columns: ColumnDef<T>[];
  apiCall: (
    client: ApiClient,
    opts: Record<string, unknown>,
  ) => Promise<PaginatedResponse<T> | T[]>;
  parentIdFlag?: { name: string; description: string };
}

export function makeListCommand<T>(config: ListCommandConfig<T>): Command {
  const cmd = new Command(config.name).description(config.description);
  cmd.addOption(jsonOption());

  if (config.parentIdFlag) {
    cmd.requiredOption(`--${config.parentIdFlag.name} <id>`, config.parentIdFlag.description);
  }

  for (const opt of paginationOptions()) {
    cmd.addOption(opt);
  }

  cmd.action(async (opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      if (config.parentIdFlag) {
        const camelName = config.parentIdFlag.name.replace(/-([a-z])/g, (_: string, c: string) =>
          c.toUpperCase(),
        );
        validateId(opts[camelName] as string, config.parentIdFlag.name);
      }
      if (!json) startSpinner('Fetching...');
      const result = await config.apiCall(client, opts);
      stopSpinner();
      if (json) {
        printJson(Array.isArray(result) ? result : result.data);
      } else {
        printTable(result, config.columns);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface GetCommandConfig<T> {
  name: string;
  description: string;
  idArg?: { name: string; description: string };
  displayFields: (item: T) => Record<string, unknown>;
  apiCall: (client: ApiClient, id: string, opts: Record<string, unknown>) => Promise<T>;
}

export function makeGetCommand<T>(config: GetCommandConfig<T>): Command {
  const cmd = new Command(config.name).description(config.description);
  const argName = config.idArg?.name ?? 'id';
  cmd.argument(`<${argName}>`, config.idArg?.description ?? 'Resource ID');
  cmd.addOption(jsonOption());

  cmd.action(async (id: string, opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      validateId(id, argName);
      if (!json) startSpinner('Fetching...');
      const result = await config.apiCall(client, id, opts);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printResource(config.displayFields(result));
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface CreateCommandConfig<T> {
  name: string;
  description: string;
  options: Array<{ flags: string; description: string; required?: boolean }>;
  displayFields?: (item: T) => Record<string, unknown>;
  apiCall: (client: ApiClient, opts: Record<string, unknown>) => Promise<T>;
  successMessage?: string | ((item: T) => string);
  apiPath?: string;
}

export function makeCreateCommand<T>(config: CreateCommandConfig<T>): Command {
  const cmd = new Command(config.name).description(config.description);
  cmd.addOption(jsonOption());
  cmd.addOption(dryRunOption());

  if (config.apiPath) {
    cmd.addOption(dataOption());
  }

  for (const opt of config.options) {
    if (opt.required) {
      cmd.requiredOption(opt.flags, opt.description);
    } else {
      cmd.option(opt.flags, opt.description);
    }
  }

  cmd.action(async (opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      // Handle --data with raw JSON body
      if (opts['data'] && config.apiPath) {
        const body = parseDataOption(opts['data'] as string);
        if (opts['dryRun']) {
          printJson({
            dry_run: true,
            command: config.name,
            method: 'POST',
            path: config.apiPath,
            body,
          });
          return;
        }
        if (!json) startSpinner('Creating...');
        const result = await client.post<T>(config.apiPath, body);
        stopSpinner();
        if (json) {
          printJson(result);
        } else {
          printSuccess(
            typeof config.successMessage === 'string'
              ? config.successMessage
              : 'Created successfully.',
          );
          if (config.displayFields) {
            printResource(config.displayFields(result));
          }
        }
        return;
      }

      // Handle --dry-run (flag-based)
      if (opts['dryRun']) {
        const dryOpts = { ...opts };
        delete dryOpts['json'];
        delete dryOpts['dryRun'];
        delete dryOpts['apiUrl'];
        delete dryOpts['data'];
        printJson({ dry_run: true, command: config.name, options: dryOpts });
        return;
      }

      if (!json) startSpinner('Creating...');
      const result = await config.apiCall(client, opts);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        const msg =
          typeof config.successMessage === 'function'
            ? config.successMessage(result)
            : (config.successMessage ?? 'Created successfully.');
        printSuccess(msg);
        if (config.displayFields) {
          printResource(config.displayFields(result));
        }
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface UpdateCommandConfig<T> {
  name: string;
  description: string;
  idArg?: string;
  options: Array<{ flags: string; description: string; required?: boolean }>;
  displayFields?: (item: T) => Record<string, unknown>;
  apiCall: (client: ApiClient, id: string, opts: Record<string, unknown>) => Promise<T>;
  apiPath?: string;
}

export function makeUpdateCommand<T>(config: UpdateCommandConfig<T>): Command {
  const cmd = new Command(config.name).description(config.description);
  const argName = config.idArg ?? 'id';
  cmd.argument(`<${argName}>`, 'Resource ID');
  cmd.addOption(jsonOption());
  cmd.addOption(dryRunOption());

  if (config.apiPath) {
    cmd.addOption(dataOption());
  }

  for (const opt of config.options) {
    if (opt.required) {
      cmd.requiredOption(opt.flags, opt.description);
    } else {
      cmd.option(opt.flags, opt.description);
    }
  }

  cmd.action(async (id: string, opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      validateId(id, argName);

      // Handle --data with raw JSON body
      if (opts['data'] && config.apiPath) {
        const body = parseDataOption(opts['data'] as string);
        const path = `${config.apiPath}/${id}`;
        if (opts['dryRun']) {
          printJson({ dry_run: true, command: config.name, method: 'PATCH', path, body });
          return;
        }
        if (!json) startSpinner('Updating...');
        const result = await client.patch<T>(path, body);
        stopSpinner();
        if (json) {
          printJson(result);
        } else {
          printSuccess('Updated successfully.');
          if (config.displayFields) {
            printResource(config.displayFields(result));
          }
        }
        return;
      }

      // Handle --dry-run (flag-based)
      if (opts['dryRun']) {
        const dryOpts = { ...opts };
        delete dryOpts['json'];
        delete dryOpts['dryRun'];
        delete dryOpts['apiUrl'];
        delete dryOpts['data'];
        printJson({ dry_run: true, command: config.name, id, options: dryOpts });
        return;
      }

      if (!json) startSpinner('Updating...');
      const result = await config.apiCall(client, id, opts);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printSuccess('Updated successfully.');
        if (config.displayFields) {
          printResource(config.displayFields(result));
        }
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface DeleteCommandConfig {
  name: string;
  description: string;
  idArg?: string;
  apiCall: (client: ApiClient, id: string, opts: Record<string, unknown>) => Promise<void>;
  successMessage?: string;
}

export function makeDeleteCommand(config: DeleteCommandConfig): Command {
  const cmd = new Command(config.name).description(config.description);
  const argName = config.idArg ?? 'id';
  cmd.argument(`<${argName}>`, 'Resource ID');
  cmd.addOption(jsonOption());
  cmd.addOption(confirmOption());
  cmd.addOption(dryRunOption());

  cmd.action(async (id: string, opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      validateId(id, argName);

      if (opts['dryRun']) {
        printJson({ dry_run: true, command: config.name, action: 'delete', id });
        return;
      }

      if (!opts['confirm']) {
        console.error('Use --confirm to confirm deletion.');
        process.exit(1);
      }
      if (!json) startSpinner('Deleting...');
      await config.apiCall(client, id, opts);
      stopSpinner();
      if (json) {
        printJson({ deleted: true, id });
      } else {
        printSuccess(config.successMessage ?? 'Deleted successfully.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface ActionCommandConfig<T = void> {
  name: string;
  description: string;
  idArg?: string;
  options?: Array<{ flags: string; description: string; required?: boolean }>;
  apiCall: (client: ApiClient, id: string, opts: Record<string, unknown>) => Promise<T>;
  successMessage?: string | ((result: T) => string);
  spinnerText?: string;
  displayFields?: (item: T) => Record<string, unknown>;
}

export function makeActionCommand<T = void>(config: ActionCommandConfig<T>): Command {
  const cmd = new Command(config.name).description(config.description);
  const argName = config.idArg ?? 'id';
  cmd.argument(`<${argName}>`, 'Resource ID');
  cmd.addOption(jsonOption());
  cmd.addOption(dryRunOption());

  if (config.options) {
    for (const opt of config.options) {
      if (opt.required) {
        cmd.requiredOption(opt.flags, opt.description);
      } else {
        cmd.option(opt.flags, opt.description);
      }
    }
  }

  cmd.action(async (id: string, opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      validateId(id, argName);

      if (opts['dryRun']) {
        printJson({ dry_run: true, command: config.name, action: config.name, id });
        return;
      }

      if (!json) startSpinner(config.spinnerText ?? 'Processing...');
      const result = await config.apiCall(client, id, opts);
      stopSpinner();
      if (json) {
        printJson(result === undefined ? { success: true } : result);
      } else {
        const msg =
          typeof config.successMessage === 'function'
            ? config.successMessage(result)
            : (config.successMessage ?? 'Done.');
        printSuccess(msg);
        if (config.displayFields && result !== undefined) {
          printResource(config.displayFields(result));
        }
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface MetricsCommandConfig {
  name: string;
  description: string;
  label: string;
  apiCall: (
    client: ApiClient,
    id: string,
    query: MetricsQuery,
  ) => Promise<Array<{ time: string; value: number }>>;
  parentIds?: string[];
}

export function makeMetricsCommand(config: MetricsCommandConfig): Command {
  const cmd = new Command(config.name).description(config.description);
  const args = config.parentIds ?? ['id'];
  for (const arg of args) {
    cmd.argument(`<${arg}>`, `${arg} ID`);
  }
  cmd.addOption(jsonOption());
  for (const opt of metricsOptions()) {
    cmd.addOption(opt);
  }

  cmd.action(async (...actionArgs: unknown[]) => {
    const ids = actionArgs.slice(0, args.length) as string[];
    const opts = actionArgs[args.length] as Record<string, unknown>;
    const { client, json } = getContext(opts);

    for (let i = 0; i < ids.length; i++) {
      validateId(ids[i] as string, args[i] as string);
    }

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const query: MetricsQuery = {
      from: (opts['from'] as string | undefined) ?? dayAgo.toISOString(),
      to: (opts['to'] as string | undefined) ?? now.toISOString(),
      interval_in_seconds: (opts['interval'] as string | undefined) ?? '3600',
    };
    try {
      if (!json) startSpinner('Fetching metrics...');
      const compositeId = ids.join('/');
      const result = await config.apiCall(client, compositeId, query);
      stopSpinner();
      if (json) {
        printJson(result);
      } else {
        printTimeSeries(result, config.label);
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

// Sub-resource command factory for two-level resources (e.g., apps/<id>/domains/<domain_id>)
export interface SubResourceDeleteConfig {
  name: string;
  description: string;
  parentIdName: string;
  childIdName: string;
  apiCall: (
    client: ApiClient,
    parentId: string,
    childId: string,
    opts: Record<string, unknown>,
  ) => Promise<void>;
  successMessage?: string;
}

export function makeSubResourceDeleteCommand(config: SubResourceDeleteConfig): Command {
  const cmd = new Command(config.name).description(config.description);
  cmd.argument(`<${config.parentIdName}>`, `${config.parentIdName} ID`);
  cmd.argument(`<${config.childIdName}>`, `${config.childIdName} ID`);
  cmd.addOption(jsonOption());
  cmd.addOption(confirmOption());
  cmd.addOption(dryRunOption());

  cmd.action(async (parentId: string, childId: string, opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      validateId(parentId, config.parentIdName);
      validateId(childId, config.childIdName);

      if (opts['dryRun']) {
        printJson({
          dry_run: true,
          command: config.name,
          action: 'delete',
          [config.parentIdName]: parentId,
          [config.childIdName]: childId,
        });
        return;
      }

      if (!opts['confirm']) {
        console.error('Use --confirm to confirm deletion.');
        process.exit(1);
      }
      if (!json) startSpinner('Deleting...');
      await config.apiCall(client, parentId, childId, opts);
      stopSpinner();
      if (json) {
        printJson({
          deleted: true,
          [config.parentIdName]: parentId,
          [config.childIdName]: childId,
        });
      } else {
        printSuccess(config.successMessage ?? 'Deleted successfully.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}

export interface SubResourceActionConfig<T = void> {
  name: string;
  description: string;
  parentIdName: string;
  childIdName: string;
  apiCall: (
    client: ApiClient,
    parentId: string,
    childId: string,
    opts: Record<string, unknown>,
  ) => Promise<T>;
  successMessage?: string;
  spinnerText?: string;
}

export function makeSubResourceActionCommand<T = void>(
  config: SubResourceActionConfig<T>,
): Command {
  const cmd = new Command(config.name).description(config.description);
  cmd.argument(`<${config.parentIdName}>`, `${config.parentIdName} ID`);
  cmd.argument(`<${config.childIdName}>`, `${config.childIdName} ID`);
  cmd.addOption(jsonOption());
  cmd.addOption(dryRunOption());

  cmd.action(async (parentId: string, childId: string, opts: Record<string, unknown>) => {
    const { client, json } = getContext(opts);
    try {
      validateId(parentId, config.parentIdName);
      validateId(childId, config.childIdName);

      if (opts['dryRun']) {
        printJson({
          dry_run: true,
          command: config.name,
          action: config.name,
          [config.parentIdName]: parentId,
          [config.childIdName]: childId,
        });
        return;
      }

      if (!json) startSpinner(config.spinnerText ?? 'Processing...');
      const result = await config.apiCall(client, parentId, childId, opts);
      stopSpinner();
      if (json) {
        printJson(result === undefined ? { success: true } : result);
      } else {
        printSuccess(config.successMessage ?? 'Done.');
      }
    } catch (error) {
      stopSpinner();
      handleError(error, json);
    }
  });

  return cmd;
}
