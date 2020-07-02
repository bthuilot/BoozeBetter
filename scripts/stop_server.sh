# Source yarn and node location
source /opt/boozebetter/node.sh

pushd /var/www/BoozeBetter/src
yarn stop &> /dev/null
popd