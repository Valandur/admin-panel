#!/bin/bash
echo "Release version (x.x.x)?:"
read version
sentry-cli releases -o webapi -p admin-panel files $version upload-sourcemaps ./build
