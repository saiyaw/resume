package routers

import (
	"github.com/astaxie/beego"
	"github.com/saiyawang/resume/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/uploadresume", &controllers.UploadController{})

}
