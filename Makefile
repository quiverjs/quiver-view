build: src
	babel --presets 'quiver-babel/node-jsx-preset' --out-dir dist src

test: build
	node dist/test

test-app:
	cd test-app && webpack-dev-server --content-base public/

.PHONY: build test test-app
