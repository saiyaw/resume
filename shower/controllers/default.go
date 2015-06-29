package controllers

import (
	"github.com/astaxie/beego"
	"github.com/saiyawang/resumereader/showweb/models"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplNames = "index.tpl"
	var b1, b2, b3, b4 models.Blog
	b1.Id = 3143
	b2.Id = 10991
	b3.Id = 11086
	b4.Id = 11207

	var list []models.Blog
	list = append(list, b1)
	list = append(list, b2)
	list = append(list, b3)
	list = append(list, b4)

	c.Data["blogs"] = list
}
