---
layout: post
title: Makefile 是 docker 的好朋友
categories: magic
tags: deployment docker
date: 2021-06-03 05:53 +0000
---
将 `docker` 作为主要开发环境的同学时常力不从心，因为 docker 运行在虚拟容器中，一切操作都涉及到以下几个步骤：

- 通过 docker 命令前缀进入容器，找到需要执行的命令。
- 声明 volume 创建与本地文件系统的映射，因为容器无法保存状态。
- 为需要执行的命令添加必要的参数，传入需要的环境变量，最后执行命令。

如果是临时执行还可以接受，但如果是需要频繁执行的命令，敲这种庞大的命令串无疑是开发的噩梦。有两种方案可以缓解这种状况。

### 编写 shell 脚本
使用 shell 可以顺利简化陈长的 docker 命令所造成的问题。我们要编写 shell 脚本，然后通过脚本参数的形式调用其中的 shell 函数，
执行封装在函数中的命令。下面是一个使用 `jekyll` 的简单的例子：
```shell
#!env bash

VERSION="stable"
DOCKER_TAG="alex/ruby:$VERSION"

# Build docker image if it doesn't exist
build() {
  if [[ `docker images -q alexlayton/ruby:stable 2> /dev/null` == "" ]]; then
    docker build -t $DOCKER_TAG .;
  fi
}

serve() {
  build
  docker run --rm --volume="$PWD:/srv/jekyll" -w /srv/jekyll -it\
    -p 35729:35729 -p 4000:4000 alexlayton/ruby:stable\
    bundle exec jekyll serve\
      -I --unpublished -l --livereload-port 35729  -H 0.0.0.0 -P 4000\
      --config _config.yml,_config_dev.yml
}

$*
```

其中最后一句 `$*` 是必要的，这句命令允许我们通过参数指定需要调用的函数。然后我们可以像这样启动 `jekyll develop server`:
```shell
./runner.sh serve
```

编写脚本的好处是可以完全控制命令的执行，一次编写之后可以反复调用，然而编写运行脚本对于开发的本职任务来说，是不小的额外工作量。
实际上，有一款工具已经为我们实现了上述脚本的工作模式，它就是 `Makefile`.

### Make / Makefile
`make` 是一种按照依赖顺序依次构建目标（target）的工具，`Makefile` 则是 make 的配置文件。使用 make 同样可以达到上述 shell
脚本的效果，并承担了调用和维护依赖项的职责。

仍以 `jekyll develop server` 为例，首先创建 `Makefile`
```makefile
version       := stable
docker_tag    := alexlayton/ruby:$(version)
docker_runner := docker run --rm --volume="$$PWD:/srv/jekyll" -w /srv/jekyll -it
jekyll_runner := bundle exec jekyll

port     ?= 4000
liveport ?= 35729

# build image from dockerfile
define docker_build
    if [ "$(shell docker images -q $(docker_tag) 2> /dev/null)" = "" ]; then \
        docker build -t $(docker_tag) .; \
    fi
endef

.PHONY: build serve

build: build_image
	$(docker_runner) $(docker_tag) bundle install

serve: build
	$(docker_runner) -p $(port):$(port) -p $(liveport):$(liveport) $(docker_tag) $(jekyll_runner) serve \
		-I --unpublished -l --livereload-port $(liveport) -H 0.0.0.0 -P $(port)\
		--config _config.yml,_config_dev.yml

build_image:
	$(docker_build)
```

上面的 Makefile 中有三个 `target` 分别是 `build`, `serve` 和 `build_image`，其中 `build` 依赖于 `build_image`，
`serve` 依赖于 `build_image` 和 `build`，需要先构建镜像再构建项目，然后启动 develop server，这里由于 build 传递了对
build_image 的依赖，所以 serve 只依赖于 build 即可。

可以看到，Makefile 帮我们做了依赖管理，如果要启动 develop server，我们只要执行 `make serve` 即可。这在构建复杂的开发环境时很有帮助，
很多开源项目也在使用这种管理方式。

### 总结
以上两种都是主流方案，可以根据项目情况选择合适的管理方式，一般情况下，使用 make 就能满足大部分项目的需求。顺带说一下，
docker compose 和 make 并不是同类工具，compose 是以容器为单位的， 是一种编排工具，不应该作为用来简化命令行的方案。
