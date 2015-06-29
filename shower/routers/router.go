package routers

import (
	"github.com/astaxie/beego"
	"github.com/saiyawang/resumereader/showweb/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
}
