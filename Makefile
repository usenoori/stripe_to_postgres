.PHONY: all buildx

all: buildx

buildx:
	@docker buildx build --platform linux/amd64,linux/arm64 -t whollacsek/stripe_to_postgres --push .
