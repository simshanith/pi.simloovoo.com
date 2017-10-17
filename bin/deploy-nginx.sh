#!/usr/bin/env bash

USERNAME="pi"
HOSTNAME="raspberrypi.local"

REMOTE="$USERNAME@$HOSTNAME"

set -ex

# https://crashingdaily.wordpress.com/2007/06/29/rsync-and-sudo-over-ssh/
# Raspbian pi user configured for non-interactive sudo by default

# add ssh-key to raspberry pi for non-interactive login
# https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md
# cat ~/.ssh/id_rsa.pub | ssh $REMOTE 'cat >> .ssh/authorized_keys'

# --rsync-path="sudo rsync" allows for root access

# Copy nginx configuration
rsync -azve "ssh" --rsync-path="sudo rsync" pi.simloovoo.com.nginx.conf "$REMOTE:/etc/nginx/sites-available/pi.simloovoo.com"

# Scaffold the build directory if not yet created
mkdir -p build

# Copy website
rsync -azve "ssh" --delete --rsync-path="sudo rsync" build/ "$REMOTE:/var/www/pi.simloovoo.com"

# Reload nginx daemon
ssh $REMOTE 'sudo systemctl reload nginx'
