#!/bin/bash



# 用不上了这个签名
# ============ 定义一个临时禁用代理的函数 ============
# 将函数定义直接放在脚本内部，确保它在运行时可用。
function run_without_proxy() {
  # 临时保存当前的代理设置
  local old_http_proxy="$http_proxy"
  local old_https_proxy="$https_proxy"
  local old_all_proxy="$ALL_PROXY"

  # 清除代理环境变量
  unset http_proxy
  unset https_proxy
  unset ALL_PROXY

  # 运行传入的命令
  "$@"

  # 恢复代理设置
  export http_proxy="$old_http_proxy"
  export https_proxy="$old_https_proxy"
  export ALL_PROXY="$old_all_proxy"
}

# ============ 签名逻辑开始 ============

# 获取你的开发者证书的 SHA-1 哈希值
# 替换为你的实际哈希值
DEVELOPER_ID_IDENTITY="D6E6B96A8DF938E2181DFADF8ED5FBF4C9A77CB7"

# Electron 应用路径
ELECTRON_APP_PATH="node_modules/electron/dist/Electron.app"

# 权限文件路径
ENTITLEMENTS_PATH="entitlements.mac.plist"

echo "🔧 正在为开发模式签名 Electron 应用..."
echo "🔐 开发者身份哈希: $DEVELOPER_ID_IDENTITY"
echo "📍 Electron 应用路径: $ELECTRON_APP_PATH"

if [ ! -d "$ELECTRON_APP_PATH" ] || [ ! -f "$ENTITLEMENTS_PATH" ]; then
    echo "❌ 错误: 缺少 Electron.app 或 entitlements.mac.plist 文件。"
    exit 1
fi

echo "✅ 签名准备就绪，开始执行..."

# 签名主应用
run_without_proxy codesign --force --sign "$DEVELOPER_ID_IDENTITY" --timestamp --options runtime --entitlements "$ENTITLEMENTS_PATH" "$ELECTRON_APP_PATH"

echo "✅ 签名完成，正在验证..."

# 验证签名
run_without_proxy codesign --verify --verbose --deep --strict "$ELECTRON_APP_PATH"
if [ $? -eq 0 ]; then
    echo "✅ 签名验证通过"
else
    echo "❌ 签名验证失败，请检查脚本和证书设置。"
fi
echo "---"
