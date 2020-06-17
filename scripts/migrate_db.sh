# Source yarn and node location
source /opt/boozebetter/node.sh

# Source DB Enviorment variables
source /opt/boozebetter/postgres-db.sh
export DATABASE_URL=postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}

pushd /var/www/BoozeBetter/src
yarn migrate up
popd