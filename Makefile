BUNDLE := dist/src/dg.js
MINIFIED := dist/src/dg.min.js

SRC := \
  ./src/common.js \
  ./src/setup.js \
  ./src/Game.js \
  $(wildcard ./src/Screen/*.js) \
  $(wildcard ./src/Entities/*.js) \
  $(wildcard ./src/Entities/Bullets/*.js) \
  $(wildcard ./src/UI/*.js)

all:
	cat $(SRC) > $(BUNDLE)
	npx terser $(BUNDLE) -o $(MINIFIED) --compress --mangle
	rm $(BUNDLE)
	cp -r audio font images src style.css dist

zip: all
	cd dist
	zip -r -9 DoG.zip *
	cd ..

clean:
	rm -r dist/audio dist/font dist/images dist/style.css
