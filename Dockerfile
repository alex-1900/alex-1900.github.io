FROM ruby:3-alpine

RUN gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/ \
  && gem update --system \
  && gem install bundler:2.2.17 \
  && bundle config set --local path 'vendor/bundle' \
  && bundle config mirror.https://rubygems.org https://gems.ruby-china.com \
  && sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
  && apk update && apk add build-base ruby-dev libc-dev linux-headers openssl-dev postgresql-dev libxml2-dev libxslt-dev git
