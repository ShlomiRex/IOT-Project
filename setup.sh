sudo apt install npm nodejs
sudo npm install
sudo npm install -g --unsafe-perm node-red
sudo npm install node-red-node-mongodb
sudo npm install -g nodemon

bash esp32-mqtt/setup.sh
bash node-red/setup.sh

sudo pip install pymongo

# To add git submodule:
# git submodule add https://github.com/ShlomiRex/esp32-mqtt