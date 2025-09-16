#!/bin/bash

echo "重置 macOS 语音识别权限..."

# 重置语音识别权限
sudo tccutil reset SpeechRecognition

# 重置麦克风权限
sudo tccutil reset Microphone

echo "✅ 权限已重置"
echo "请重新运行应用，系统会再次询问权限"
echo ""
echo "如果仍有问题，请手动检查："
echo "系统偏好设置 > 安全性与隐私 > 隐私 > 语音识别"
echo "系统偏好设置 > 安全性与隐私 > 隐私 > 麦克风"
