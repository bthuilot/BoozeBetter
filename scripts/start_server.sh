# Source yarn and node location
source /opt/boozebetter/node.sh

pushd /var/www/BoozeBetter/src
PORT=5000 yarn start:prod &
popd