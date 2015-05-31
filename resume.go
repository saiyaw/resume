package main

import (
	"github.com/saiyawang/resume/ws"
	"log"
)

func main() {
	ws.InitRoute()
	ws.Start(":321")
	log.Println("started....")

}
