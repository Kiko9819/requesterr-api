NAME := kris9819/requesterr-api
TAG := $$(git log -1 --pretty=%!H(MISSING))
IMG := ${NAME}:${TAG}
LATEST := ${NAME}:latest

build:
	@docker build -t ${IMG} .
