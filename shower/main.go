package main

import (
	"github.com/astaxie/beego"
	_ "github.com/saiyawang/resume/shower/routers"
)

func main() {
	beego.SetStaticPath("/web", "D:\\Cloud\\data\\web")
	beego.SetStaticPath("/java", "D:\\Cloud\\data\\java")
	beego.SetStaticPath("/php", "D:\\Cloud\\data\\php")
	beego.SetStaticPath("/android", "D:\\Cloud\\data\\android")
	beego.Run()
}
