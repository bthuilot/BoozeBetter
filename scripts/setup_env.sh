# I want to make sure that the directory is clean and has nothing left over from
# previous deployments. The servers auto scale so the directory may or may not
# exist.
if [ -d /var/www/BoozeBetter ]; then
    rm -rf /var/www/BoozeBetter
fi
mkdir -vp /var/www/BoozeBetter