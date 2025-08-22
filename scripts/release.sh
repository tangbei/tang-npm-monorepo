#!/bin/bash

# Changeset 发布脚本
# 支持预发布版本和稳定版本发布

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[Release]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[Release]✅${NC} $1"
}

log_error() {
    echo -e "${RED}[Release]❌${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[Release]⚠️${NC} $1"
}

# 检查是否在预发布模式
check_pre_mode() {
    if pnpm changeset status > /dev/null 2>&1; then
        # 检查是否有预发布标记
        if grep -q "prerelease" .changeset/pre.json 2>/dev/null; then
            return 0  # 在预发布模式中
        fi
    fi
    return 1  # 不在预发布模式中
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}
📦 Changeset 发布脚本

用法:
  ./scripts/release.sh [选项]

选项:
  --beta              发布 beta 版本
  --alpha             发布 alpha 版本  
  --rc                发布 rc 版本
  --stable            发布稳定版本
  --dry-run           预演模式，不实际执行
  --help, -h          显示帮助信息

示例:
  ./scripts/release.sh --beta                    # 发布 beta 版本
  ./scripts/release.sh --stable --dry-run       # 预演稳定版本发布
${NC}"
}

# 解析命令行参数
RELEASE_TYPE=""
DRY_RUN="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        --beta)
            RELEASE_TYPE="beta"
            shift
            ;;
        --alpha)
            RELEASE_TYPE="alpha"
            shift
            ;;
        --rc)
            RELEASE_TYPE="rc"
            shift
            ;;
        --stable)
            RELEASE_TYPE="stable"
            shift
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            log_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

# 检查是否指定了发布类型
if [ -z "$RELEASE_TYPE" ]; then
    log_error "请指定发布类型: --beta, --alpha, --rc, 或 --stable"
    show_help
    exit 1
fi

# 执行命令函数
execute_command() {
    local command="$1"
    local description="$2"
    
    log "执行: $description"
    echo -e "${BLUE}$ $command${NC}"
    
    if [ "$DRY_RUN" = "true" ]; then
        log_warning "[DRY RUN] 跳过执行: $command"
        return 0
    fi
    
    if eval "$command"; then
        log_success "$description 完成"
    else
        log_error "$description 失败"
        exit 1
    fi
}

# 预发布版本流程
prerelease_flow() {
    log "开始预发布流程 - 类型: $RELEASE_TYPE"
    
    # 1. 创建 changeset
    log "步骤 1: 创建 changeset"
    execute_command "pnpm changeset" "创建 changeset 文件"
    
    # 2. 进入预发布环境
    log "步骤 2: 进入预发布环境"
    execute_command "pnpm changeset pre enter $RELEASE_TYPE" "进入 $RELEASE_TYPE 预发布环境"
    
    # 3. 更新版本号
    log "步骤 3: 更新版本号"
    execute_command "pnpm changeset version" "更新包版本号"
    
    # 4. 发布到 npm
    log "步骤 4: 发布到 npm"
    execute_command "pnpm changeset publish" "发布包到 npm 仓库"
    
    log_success "预发布流程完成！"
}

# 稳定版本流程
stable_flow() {
    log "开始稳定版本发布流程"
    
    # 1. 检查并退出预发布环境（如果存在）
    if check_pre_mode; then
        log "检测到预发布模式，正在退出..."
        execute_command "pnpm changeset pre exit" "退出预发布环境"
    else
        log "当前不在预发布模式中，跳过退出步骤"
    fi
    
    # 2. 创建 changeset
    log "步骤 2: 创建 changeset"
    execute_command "pnpm changeset" "创建 changeset 文件"
    
    # 3. 更新版本号
    log "步骤 3: 更新版本号"
    execute_command "pnpm changeset version" "更新包版本号"
    
    # 4. 发布到 npm
    log "步骤 4: 发布到 npm"
    execute_command "pnpm changeset publish" "发布包到 npm 仓库"
    
    log_success "稳定版本发布流程完成！"
}

# 主函数
main() {
    if [ "$DRY_RUN" = "true" ]; then
        log_warning "这是预演模式，不会实际执行发布操作"
    fi
    
    case $RELEASE_TYPE in
        beta|alpha|rc)
            prerelease_flow
            ;;
        stable)
            stable_flow
            ;;
        *)
            log_error "不支持的发布类型: $RELEASE_TYPE"
            exit 1
            ;;
    esac
}

# 执行主函数
main 