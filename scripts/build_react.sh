npm install -g yarn

# install and build client
pushd /var/www/BoozeBetter/client 
yarn install
yarn build
popd

pushd /var/www/BoozeBetter/src/
yarn install
popd