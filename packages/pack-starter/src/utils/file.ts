/**
 * 文件操作工具类
 * 提供文件读写、路径处理等功能
 */

import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { logger } from './logger';

export class FileUtils {
  /**
   * 检查文件是否存在
   */
  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 读取文件内容
   */
  static async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    try {
      return await fs.readFile(filePath, encoding);
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 写入文件内容
   */
  static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf8');
      logger.debug(`File written: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 复制文件或目录
   */
  static async copy(src: string, dest: string): Promise<void> {
    try {
      await fs.copy(src, dest);
      logger.debug(`Copied: ${src} -> ${dest}`);
    } catch (error) {
      logger.error(`Failed to copy: ${src} -> ${dest}`, error);
      throw error;
    }
  }

  /**
   * 删除文件或目录
   */
  static async remove(filePath: string): Promise<void> {
    try {
      await fs.remove(filePath);
      logger.debug(`Removed: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to remove: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 创建目录
   */
  static async mkdir(dirPath: string): Promise<void> {
    try {
      await fs.ensureDir(dirPath);
      logger.debug(`Directory created: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to create directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * 获取文件扩展名
   */
  static getExt(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * 获取文件名（不含扩展名）
   */
  static getBasename(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * 获取文件名（含扩展名）
   */
  static getFilename(filePath: string): string {
    return path.basename(filePath);
  }

  /**
   * 获取目录名
   */
  static getDirname(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * 解析路径
   */
  static resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }

  /**
   * 连接路径
   */
  static join(...paths: string[]): string {
    return path.join(...paths);
  }

  /**
   * 获取相对路径
   */
  static relative(from: string, to: string): string {
    return path.relative(from, to);
  }

  /**
   * 检查是否为绝对路径
   */
  static isAbsolute(filePath: string): boolean {
    return path.isAbsolute(filePath);
  }

  /**
   * 获取绝对路径
   */
  static absolute(filePath: string, base?: string): string {
    if (this.isAbsolute(filePath)) {
      return filePath;
    }
    return path.resolve(base || process.cwd(), filePath);
  }

  /**
   * 查找文件
   */
  static async findFiles(pattern: string, options?: any): Promise<string[]> {
    return glob.glob(pattern, options || {});
  }

  /**
   * 读取JSON文件
   */
  static async readJson<T = any>(filePath: string): Promise<T> {
    try {
      return await fs.readJson(filePath);
    } catch (error) {
      logger.error(`Failed to read JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 写入JSON文件
   */
  static async writeJson(filePath: string, data: any, options?: fs.WriteOptions): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeJson(filePath, data, { spaces: 2, ...options });
      logger.debug(`JSON file written: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to write JSON file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 获取文件统计信息
   */
  static async stat(filePath: string): Promise<fs.Stats> {
    try {
      return await fs.stat(filePath);
    } catch (error) {
      logger.error(`Failed to get file stats: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * 检查是否为目录
   */
  static async isDirectory(filePath: string): Promise<boolean> {
    try {
      const stats = await this.stat(filePath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * 检查是否为文件
   */
  static async isFile(filePath: string): Promise<boolean> {
    try {
      const stats = await this.stat(filePath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * 列出目录内容
   */
  static async readdir(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      logger.error(`Failed to read directory: ${dirPath}`, error);
      throw error;
    }
  }

  /**
   * 递归列出目录内容
   */
  static async readdirRecursive(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const processDirectory = async (currentPath: string): Promise<void> => {
      const items = await this.readdir(currentPath);
      
      for (const item of items) {
        const fullPath = this.join(currentPath, item);
        const isDir = await this.isDirectory(fullPath);
        
        if (isDir) {
          await processDirectory(fullPath);
        } else {
          files.push(fullPath);
        }
      }
    };

    await processDirectory(dirPath);
    return files;
  }
} 