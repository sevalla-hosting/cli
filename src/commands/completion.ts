import { Command } from 'commander';

function bashScript(name: string): string {
  return `# bash completion for ${name}
_${name}_completions() {
  local cur words
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  words=("\${COMP_WORDS[@]:1:COMP_CWORD-1}")

  local IFS=$'\\n'
  COMPREPLY=($(compgen -W "$(${name} __complete "\${words[@]}" 2>/dev/null)" -- "$cur"))
}
complete -o default -F _${name}_completions ${name}
`;
}

function zshScript(name: string): string {
  return `#compdef ${name}
# zsh completion for ${name}
_${name}() {
  local -a completions
  local IFS=$'\\n'
  completions=($(${name} __complete "\${words[@]:1:$((CURRENT-1))}" 2>/dev/null))
  compadd -a completions
}
compdef _${name} ${name}
`;
}

function fishScript(name: string): string {
  return `# fish completion for ${name}
complete -c ${name} -f -a '(commandline -cop | string match -v -- "${name}" | ${name} __complete 2>/dev/null)'
`;
}

const shells: Record<string, (name: string) => string> = {
  bash: bashScript,
  zsh: zshScript,
  fish: fishScript,
};

export function makeCompletionCommand(): Command {
  return new Command('completion')
    .description('Generate shell completion scripts')
    .argument('<shell>', `Shell type (${Object.keys(shells).join(', ')})`)
    .action((shell: string) => {
      const generator = shells[shell];
      if (!generator) {
        console.error(`Unsupported shell: ${shell}. Supported: ${Object.keys(shells).join(', ')}`);
        process.exit(1);
      }
      process.stdout.write(generator('sevalla'));
    });
}

export function makeCompleteCommand(program: Command): Command {
  const cmd = new Command('__complete')
    .description('Internal command for shell completions')
    .argument('[words...]', 'Words to complete')
    .helpOption(false)
    .allowUnknownOption()
    .action((words: string[]) => {
      const completions = getCompletions(program, words);
      for (const c of completions) {
        console.log(c);
      }
    });
  return cmd;
}

function getCompletions(program: Command, words: string[]): string[] {
  let cmd = program;
  let consumed = 0;

  // Walk down the command tree following the words
  for (let i = 0; i < words.length; i++) {
    const word = words[i] as string;
    const sub = cmd.commands.find((c) => c.name() === word || c.aliases().includes(word));
    if (sub) {
      cmd = sub;
      consumed = i + 1;
    } else {
      break;
    }
  }

  const partial = words.length > consumed ? words[words.length - 1] : '';
  const results: string[] = [];

  // If the previous word is an option that takes a value, don't suggest anything
  // (the user needs to provide a value)
  if (words.length >= 2) {
    const prev = words[words.length - 2] as string;
    if (prev.startsWith('-')) {
      const opt = cmd.options.find((o) => o.short === prev || o.long === prev);
      if (opt && opt.required) {
        return results;
      }
    }
  }

  // Suggest subcommands
  for (const sub of cmd.commands) {
    if (sub.name().startsWith('__')) continue; // hide internal commands
    if (!partial || sub.name().startsWith(partial)) {
      results.push(sub.name());
    }
  }

  // Suggest options
  for (const opt of cmd.options) {
    if (opt.long && opt.long !== '--version' && (!partial || opt.long.startsWith(partial))) {
      results.push(opt.long);
    }
  }

  return results;
}
