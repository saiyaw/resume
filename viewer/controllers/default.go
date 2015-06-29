package controllers

import (
	"encoding/json"
	"io"
	"os"

	"github.com/astaxie/beego"
	"github.com/saiyawang/resume/viewer/models"
)

type ViewResumeController struct {
	beego.Controller
}

type AddResumeController struct {
	beego.Controller
}

type EditResumeController struct {
	beego.Controller
}

type SkillPoolController struct {
	beego.Controller
}

func (c *ViewResumeController) Get() {
	remoteAddr := c.Ctx.Request.RemoteAddr
	beego.Informational(remoteAddr)
	c.Layout = "layout.tpl"
	c.TplNames = "index.tpl"
}

func (c *AddResumeController) Get() {
	c.Layout = "layout.tpl"
	c.TplNames = "new.tpl"
}

func (c *EditResumeController) Get() {
	c.Layout = "layout.tpl"
	c.TplNames = "edit.tpl"
}

func (c *AddResumeController) UpLoadFile() {
	c.Ctx.Request.ParseMultipartForm(1 << 22)
	file, handler, err := c.GetFile("uploadresume")
	if err != nil {
		beego.Error(err)
		return
	}
	defer file.Close()
	pwd, _ := os.Getwd()
	beego.Debug(pwd)
	f, err := os.OpenFile(pwd+"/static/files/"+handler.Filename, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		beego.Error(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)

	//	c.Ctx.Redirect(200, "/")
	c.Ctx.WriteString("upload file...ok")
	//	c.Ctx.Redirect(200, "/")

}

func (c *AddResumeController) Submit() {
	var info models.ResumeInfo

	info.Name = c.GetString("name")
	info.Age = c.GetString("age")

	info.Email = c.GetString("email")
	info.Education = c.GetString("education")
	info.Experience = c.GetString("experience")
	info.Phone = c.GetString("phone")
	info.Mobile = c.GetString("mobile")
	info.Comment = c.GetString("comment")

	info.Resumefile = "/static/files/" + c.GetString("resumefile")

	models.NewResume(info)

	c.Ctx.WriteString("add resume...ok")

}

func (c *SkillPoolController) GetSkillPool() {

	result := models.GetSkillPool()

	str, _ := json.Marshal(result)

	c.Ctx.WriteString(string(str))

}
