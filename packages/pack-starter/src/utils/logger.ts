/**
 * 日志工具类
 * 提供彩色控制台输出和格式化功能
 */

import chalk from 'chalk';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4
}

export class Logger {
  private level: LogLevel = LogLevel.INFO;
  private isProgressActive = false;
  private lastProgressMessage = '';

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * 错误日志
   */
  error(message: string, error?: any): void {
    if (this.level >= LogLevel.ERROR) {
      this.clearProgress();
      console.error(chalk.red(`[pack] ERROR: ${message}`));
      if (error) {
        console.error(chalk.red(error));
      }
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, data?: any): void {
    if (this.level >= LogLevel.WARN) {
      this.clearProgress();
      console.warn(chalk.yellow(`[pack] WARN: ${message}`));
      if (data) {
        console.warn(chalk.yellow(data));
      }
    }
  }

  /**
   * 信息日志
   */
  info(message: string, data?: any): void {
    if (this.level >= LogLevel.INFO) {
      this.clearProgress();
      console.log(chalk.blue(`[pack] INFO: ${message}`));
      if (data) {
        console.log(chalk.blue(data));
      }
    }
  }

  /**
   * 成功日志
   */
  success(message: string, data?: any): void {
    if (this.level >= LogLevel.INFO) {
      this.clearProgress();
      console.log(chalk.green(`[pack] SUCCESS: ${message}`));
      if (data) {
        console.log(chalk.green(data));
      }
    }
  }

  /**
   * 调试日志
   */
  debug(message: string, data?: any): void {
    if (this.level >= LogLevel.DEBUG) {
      this.clearProgress();
      console.log(chalk.gray(`[pack] DEBUG: ${message}`));
      if (data) {
        console.log(chalk.gray(data));
      }
    }
  }

  /**
   * 详细日志
   */
  verbose(message: string, data?: any): void {
    if (this.level >= LogLevel.VERBOSE) {
      this.clearProgress();
      console.log(chalk.gray(`[pack] VERBOSE: ${message}`));
      if (data) {
        console.log(chalk.gray(data));
      }
    }
  }

  /**
   * 进度显示（单行更新）
   */
  progress(message: string): void {
    if (this.level >= LogLevel.INFO) {
      // 清除之前的进度行
      if (this.isProgressActive) {
        process.stdout.write('\r\x1b[K'); // 清除当前行
      }
      
      // 显示新的进度
      process.stdout.write(chalk.cyan(`[pack] ${message}`));
      this.isProgressActive = true;
      this.lastProgressMessage = message;
    }
  }

  /**
   * 清除进度显示
   */
  clearProgress(): void {
    if (this.isProgressActive) {
      process.stdout.write('\r\x1b[K'); // 清除当前行
      this.isProgressActive = false;
      this.lastProgressMessage = '';
    }
  }

  /**
   * 表格显示
   */
  table(data: any[]): void {
    if (this.level >= LogLevel.INFO) {
      this.clearProgress();
      
      if (data.length === 0) {
        console.log(chalk.gray('暂无数据'));
        return;
      }

      // 获取表头
      const headers = Object.keys(data[0]);
      
      // 计算每列的最大宽度
      const columnWidths = headers.map(header => {
        const maxWidth = Math.max(
          header.length,
          ...data.map(row => String(row[header] || '').length)
        );
        return Math.min(maxWidth, 50); // 限制最大宽度
      });

      // 打印表头
      const headerRow = headers.map((header, index) => 
        chalk.bold(header.padEnd(columnWidths[index]))
      ).join(' | ');
      console.log(chalk.cyan(headerRow));
      console.log(chalk.cyan('-'.repeat(headerRow.length)));

      // 打印数据行
      data.forEach(row => {
        const dataRow = headers.map((header, index) => {
          const value = String(row[header] || '');
          return value.padEnd(columnWidths[index]);
        }).join(' | ');
        console.log(dataRow);
      });
    }
  }

  /**
   * 分隔线
   */
  separator(char: string = '='): void {
    if (this.level >= LogLevel.INFO) {
      this.clearProgress();
      console.log(chalk.gray(char.repeat(80)));
    }
  }

  /**
   * 空行
   */
  newline(): void {
    if (this.level >= LogLevel.INFO) {
      this.clearProgress();
      console.log();
    }
  }

  /**
   * 获取当前进度消息
   */
  getLastProgressMessage(): string {
    return this.lastProgressMessage;
  }

  /**
   * 检查是否正在显示进度
   */
  isProgressShowing(): boolean {
    return this.isProgressActive;
  }
}

// 导出默认实例
export const logger = new Logger(); 