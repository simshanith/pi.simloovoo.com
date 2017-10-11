#!/usr/bin/env bash

set -ex

# Disable the site if enabled
rm -v /etc/nginx/sites-enabled/pi.simloovoo.com || true

# Copy nginx configuration
cp -vf pi.simloovoo.com.nginx.conf /etc/nginx/sites-available/pi.simloovoo.com
# Enable the site
ln -s /etc/nginx/sites-available/pi.simloovoo.com /etc/nginx/sites-enabled/pi.simloovoo.com

# Clear the existing content link if exists
rm -v /var/www/pi.simloovoo.com || true

# Scaffold the build directory if not yet created
mkdir -p build

# Link the website content
ln -s build /var/www/pi.simloovoo.com

# Reload nginx daemon
systemctl reload nginx