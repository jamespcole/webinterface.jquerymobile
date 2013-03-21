#!/bin/sh
echo "Building jquery mobile xbmc remote plugin"
mkdir -p webinterface.jquerymobile
cp index.html addon.xml icon.png changelog.txt LICENSE.txt README.md webinterface.jquerymobile
cp -r resources js css lang webinterface.jquerymobile
zip -r webinterface.jquerymobile_V0.0.1.zip webinterface.jquerymobile
rm -r ~/.xbmc/addons/webinterface.jquerymobile/webinterface.jquerymobile

mv webinterface.jquerymobile_V0.0.1.zip ~/Ubuntu\ One/public/
echo "Addon build finished"