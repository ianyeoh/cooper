import { Server } from 'node:http';
import serverConfig from '@cooper/backend/serverConfig.json';

interface ConsoleCommands {
  [command: string]: {
    action: (args: string[], server: Server) => void;
    info: string;
    usage: string;
  };
}

const commands: ConsoleCommands = {
  help: {
    action: () => {
      console.log('\nAVAILABLE COMMANDS:\n');
      console.table(
        Object.entries(commands).map(([command, { info, usage }]) => {
          return {
            Command: command,
            Info: info,
            Usage: usage,
          };
        }),
      );
      console.log();
    },
    info: 'Displays information and usage of all available commands.',
    usage: 'help',
  },
  quit: {
    action: (_args, server) => {
      console.log('[server]: Shutting down...');
      server.close(() => {
        console.log('[server]: Server shutdown successful.');
        process.exit();
      });
    },
    info: 'Gracefully shutdown the server.',
    usage: 'quit',
  },
};

if (process.env.NODE_ENV == 'dev') {
  commands.reset = {
    action: () => {
      const hostname = serverConfig.hostname;
      const port = serverConfig.port;

      fetch(`http://${hostname}:${port}/testing/reset`).then((response) => {
        if (response.status === 200) {
          console.log('Reset in-memory database successfully.');
        } else {
          console.log('Failed to reset in-memory database:');
          console.log(`${response.status}: ${JSON.stringify(response.body)}`);
        }
      });
    },
    info: 'Reset in-memory database to hard-coded defaults. Only available when server is running in development mode.',
    usage: 'reset',
  };
}

export default function enableConsoleCommands(server: Server) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function (text: string) {
    const args = text.trim().split(' ');
    const command = args.shift();

    if (command && command in commands) {
      commands[command].action(args, server);
    } else {
      console.log(
        'Invalid command. Use command help to view a list of available commands.',
      );
    }
  });

  console.log(
    '[server]: Console commands are enabled for this session. Type "help" to view a list of available commands.',
  );
}
