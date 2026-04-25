#!/bin/zsh
cd "/Users/guanshifeng/Documents/citsilaer网站/网站" || exit 1
node "./tools/generate-content.mjs"
echo ""
echo "照片列表已经更新。"
read -k 1 "?按任意键关闭..."
