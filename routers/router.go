package routers

import (
	"github.com/astaxie/beego"
	"github.com/saiyawang/resume/controllers"
)

func init() {
	beego.Router("/", &controllers.ViewResumeController{})
	beego.Router("/new", &controllers.AddResumeController{})
	beego.Router("/edit", &controllers.EditResumeController{})
	beego.Router("/uploadresume", &controllers.AddResumeController{}, "POST:UploadResume")
	beego.Router("/submit", &controllers.AddResumeController{}, "POST:Submit")

}
