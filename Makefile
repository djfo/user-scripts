.PHONY: build clean

build:
	npx tsc
	./bin/bundle.sh

clean:
	rm -fr dist
	rm -fr node_modules
	rm -f build/**/*.js
	rm -f tsconfig.tsbuildinfo
