package main

import (
	"github.com/astaxie/beego"
	_ "github.com/saiyawang/resume/viewer/routers"
)

func main() {
	beego.Run()
}
