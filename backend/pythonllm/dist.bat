@echo off
setlocal EnableDelayedExpansion

REM Create the output directory if it doesn't exist
if not exist "dist\images" (
    mkdir "dist\images"
)

REM Define the images to save
set IMAGES=mongo:latest ollama/ollama:latest socket-server:latest

REM Save each image with the .docker.img suffix
for %%I in (%IMAGES%) do (
    REM Sanitize the image name
    call :sanitize_image_name "%%I" FILENAME

    echo Saving %%I as dist\images\!FILENAME!.docker.img...
    docker image save %%I -o "dist\images\!FILENAME!.docker.img"
)

goto :eof

:sanitize_image_name
REM Replace / and : with _
setlocal
set "IMG=%~1"
set "IMG=%IMG:/=_%"
set "IMG=%IMG::=_%"
endlocal & set "%~2=%IMG%"
goto :eof
