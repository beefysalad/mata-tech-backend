#!/bin/sh
set -e

echo "Running Prisma migrations..."
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma migrate deploy

echo "Starting server..."
exec npm run start
