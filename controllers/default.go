package controllers

import (
	"io"
	"os"

	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplNames = "index.tpl"
}

type UploadController struct {
	beego.Controller
}

func (c *UploadController) Post() {
	c.Ctx.Request.ParseMultipartForm(32 << 20)
	file, handler, err := c.GetFile("uploadresume")
	if err != nil {
		beego.Error(err)
		return
	}
	defer file.Close()
	f, err := os.OpenFile("./static/files/"+handler.Filename, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		beego.Error(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)
	c.Ctx.Redirect(302, "/uploadresume")

}
