#!/usr/bin/env bash

set -ex

# Disable the site if enabled
rm -v /etc/nginx/sites-enabled/pi.simloovoo.com

# Copy nginx configuration
cp -v pi.simloovoo.com.nginx.conf /etc/nginx/sites-available/pi.simloovoo.com
# Enable the site
ln -s /etc/nginx/sites-available/pi.simloovoo.com /etc/nginx/sites-enabled/pi.simloovoo.com

# Clear the existing content
rm -rvf /var/www/pi.simloovoo.com/
# Recreate the directory
mkdir -p /var/www/pi.simloovoo.com
mkdir -p build
# Copy the website content
cp -rvf build/ /var/www/pi.simloovoo.com

systemctl reload nginx
