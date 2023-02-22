.PHONY: build clean

build: node_modules
	npx tsc
	./bin/bundle.sh

node_modules:
	npm ci

clean:
	rm -fr dist
	rm -fr node_modules
	rm -f build/**/*.js
	rm -f tsconfig.tsbuildinfo
