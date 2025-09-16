#!/bin/bash

echo "🎤 正在请求语音识别权限..."

# 简化的权限请求方法
osascript -e '
tell application "System Events"
    try
        do shell script "echo \"Testing speech recognition access\" | /usr/bin/say -v Kyoko --rate=200"
        delay 0.5
        return "语音识别权限请求已发送"
    on error errorMsg
        return "权限请求过程中出现错误: " & errorMsg
    end try
end tell
'

echo "✅ 权限请求完成"
echo ""
echo "📋 如果权限对话框没有出现，请手动设置："
echo "   1. 系统偏好设置 > 安全性与隐私 > 隐私"
echo "   2. 点击左侧的 '语音识别'"
echo "   3. 点击锁图标解锁"
echo "   4. 勾选 'Electron' 或您的应用"
echo ""
echo "   或者："
echo "   1. 系统偏好设置 > 键盘 > 听写"
echo "   2. 启用听写功能"
