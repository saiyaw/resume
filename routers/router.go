package routers

import (
	"github.com/saiyawang/resume/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
}
