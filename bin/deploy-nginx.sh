#!/usr/bin/env bash

USERNAME="pi"
HOSTNAME="raspberrypi.local"

REMOTE="$USERNAME@$HOSTNAME"

set -ex

# Copy nginx configuration
rsync -azve "ssh" --rsync-path="sudo rsync" pi.simloovoo.com.nginx.conf "$REMOTE:/etc/nginx/sites-available/pi.simloovoo.com"

# Scaffold the build directory if not yet created
mkdir -p build

# Copy website
rsync -azve "ssh" --delete --rsync-path="sudo rsync" build/ "$REMOTE:/var/www/pi.simloovoo.com"

# Reload nginx daemon
ssh $REMOTE 'sudo systemctl reload nginx'
