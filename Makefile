BUNDLE := dist/src/dg.js
MINIFIED := dist/src/dg.min.js

SRC = 	./src/common.js \
	./src/Screen/Screen.js \
	./src/Screen/Achievement.js \
	./src/Screen/Battle.js \
	./src/Screen/BattleMenu.js \
	./src/Screen/Menu.js \
	./src/Screen/Sandbox.js \
	./src/Screen/Settings.js \
	./src/Screen/TeamEditor.js \
	./src/Screen/TeamView.js \
	./src/Screen/Traits.js \
	./src/Screen/Upgrade.js \
	./src/Entities/Solid.js \
	./src/Entities/Bullets/SolidBullet.js \
	./src/Entities/Bullets/Bullet.js \
	./src/Entities/Bullets/Explosion.js \
	./src/Entities/Bullets/Laser.js \
	./src/Entities/Particle.js \
	./src/Entities/Entity.js \
	./src/Entities/Char.js \
	./src/Entities/Doll.js \
	./src/UI/Prop.js \
	./src/UI/Button.js \
	./src/UI/Carrousel.js \
	./src/UI/Popup.js \
	./src/UI/Slider.js \
	./src/UI/UpgradeCard.js \
	./src/Game.js \
	./src/setup.js

all:
	cat $(SRC) > $(BUNDLE)
	npx terser $(BUNDLE) -o $(MINIFIED) --compress --mangle
	rm $(BUNDLE)
	cp -r audio font images src style.css dist

zip:
	@echo 'cd dist'
	@echo 'zip -r -9 DoG.zip *'

clean:
	rm -r dist/audio dist/font dist/images dist/style.css
