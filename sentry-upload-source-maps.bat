set /p version=Release version (x.x.x)?:
sentry-cli releases -o webapi -p admin-panel files %version% upload-sourcemaps ./build
