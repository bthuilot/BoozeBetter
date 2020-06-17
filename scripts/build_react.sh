# Source yarn and node location
source /opt/boozebetter/node.sh

npm install -g yarn

cp /opt/boozebetter/production.yml /var/www/BoozeBetter/src/config/secrets

# install and build client
pushd /var/www/BoozeBetter/client 
yarn install
yarn build
popd

pushd /var/www/BoozeBetter/src/
yarn install
popd