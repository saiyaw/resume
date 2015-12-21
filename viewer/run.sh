#!/bin/sh
echo "updating the source code....."
#go get -u -v github.com/saiyawang/resume/loader
go get -u -v github.com/saiyawang/resume/viewer
#go get -u -v github.com/saiyawang/resume/shower

echo "launch the app..."
bee run viewer


