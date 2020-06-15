pushd /var/www/html/BoozeBetter/src
PORT=80 yarn start &
$! > ../pid.tmp
popd