.PHONY: build clean

build:
	npx tsc
	npx webpack

clean:
	rm -r dist
	rm tsconfig.tsbuildinfo
