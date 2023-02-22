.PHONY: build clean

build:
	npx tsc
	./bin/bundle.sh

clean:
	rm -r dist
	rm tsconfig.tsbuildinfo
