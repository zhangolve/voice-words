#!/bin/bash

# 进入你的项目目录
cd /root/voice-words

local_head=$(git rev-parse HEAD)
# 执行git pull命令来获取最新的代码
git pull origin master
remote_head=$(git rev-parse HEAD)

# 检查是否有代码更新
if [ "$local_head" != "$remote_head" ]; then
    echo "代码已更新，执行 Docker 相关操作"
    # 构建 Docker 镜像
    docker build -t nextjs-docker .
    # 删除已经存在的同名容器
    if docker ps -a --format '{{.Names}}' | grep -q '^nextjs-docker$'; then
        docker rm nextjs-docker -f
    fi
    # docker rm nextjs-docker -f
    # 运行新的 Docker 容器
    docker run --name nextjs-docker -p 3000:3000 --restart always -d nextjs-docker
    # 清理未被使用的 Docker 镜像
    docker image prune -f
else
    echo "代码未更新，不执行任何操作"
fi
                           