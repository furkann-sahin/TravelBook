FROM jenkins/jenkins:lts-jdk21

USER root

# Tools needed by this project pipeline (Docker + Node + npm + curl)
RUN apt-get update \
    && apt-get install -y --no-install-recommends docker.io docker-cli docker-compose nodejs npm curl \
    && npm install -g npm@11 \
    && rm -rf /var/lib/apt/lists/*

USER root
