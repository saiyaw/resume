package routers

import (
	"github.com/astaxie/beego"
	"github.com/saiyawang/resume/shower/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
}
