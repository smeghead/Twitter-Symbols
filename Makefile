FILES = README.md background.js icon.png manifest.json options.html options.js style.css twitter_symbols.js

.PHONY: dist
default:

dist:
	rm -rf dist
	mkdir -p dist/Twitter-Symbols
	cp $(FILES) dist/Twitter-Symbols/
	cd dist && zip -r Twitter-Symbols.zip Twitter-Symbols
