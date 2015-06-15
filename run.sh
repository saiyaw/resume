#!/bin/sh
echo "updating the source code....."
go get -u github.com/saiyawang/resume
echo "done"
bee run resume
