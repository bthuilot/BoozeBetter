npm install -g yarn

# install and build client
pushd /var/www/html/BoozeBetter/client 
yarn install
yarn build
popd

pushd /var/www/html/BoozeBetter/src/
yarn install
popd