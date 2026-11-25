@echo off
cd /d "%~dp0\.."
echo Starting Xweet Wallpaper Local Upload Studio...
start "" http://localhost:4321
node local-studio/server.mjs
pause
