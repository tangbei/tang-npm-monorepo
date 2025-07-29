import chalk from 'chalk';

/**
 * @description 帮助信息
 */
const help = (program) => {
  program.addHelpText(
    'after',
    `Run ${chalk.green('my-cli <command> --help')} for detailed usage of given command.`
  );
};

export default help;
