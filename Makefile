version := stable

docker_tag := alexlayton/ruby:$(version)

docker_runner := docker run --rm --volume="$$PWD:/srv/jekyll" -w /srv/jekyll -it

jekyll_runner := bundle exec jekyll

port ?= 4000
liveport ?= 35729

# build image from dockerfile
define docker_build
	if [ "$(shell docker images -q $(docker_tag) 2> /dev/null)" = "" ]; then \
		docker build -t $(docker_tag) .; \
	fi
endef

.PHONY: build serve shell .docker_build

.SILENT: .docker_build serve shell

build:
	$(docker_build)
	$(docker_runner) $(docker_tag) bundle install

serve:
	$(docker_build)
	$(docker_runner) -p $(port):$(port) -p $(liveport):$(liveport) $(docker_tag) $(jekyll_runner) serve \
-I --unpublished -l --livereload-port $(liveport) -H 0.0.0.0 -P $(port) --config _config.yml,_config_dev.yml

shell:
	@echo Container starting...
	$(docker_runner) $(docker_tag) sh

%:
	$(docker_build)
	@echo bundle exec jekyll $@ $(cmd)
	$(docker_runner) $(docker_tag) $(jekyll_runner) $@ $(cmd)
