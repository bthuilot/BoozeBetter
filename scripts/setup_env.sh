# I want to make sure that the directory is clean and has nothing left over from
# previous deployments. The servers auto scale so the directory may or may not
# exist.
if [ -d /var/www/BoozeBetter ]; then
    rm -rf /var/www/BoozeBetter
fi
mkdir -vp /var/www/BoozeBetter

mkdir -p /var/log/BoozeBetter

#!/bin/bash
# Set ownership for all folders and files
chown -R ec2-user:ec2-user /var/www/
chown -R ec2-user:ec2-user /var/log/BoozeBetter
chown -R root:root /var/www/protected

# set files to 644 
find /var/www/ -type f -print0 | xargs -0 chmod 0644

# set folders to 755
find /var/www/ -type d -print0 | xargs -0 chmod 0755