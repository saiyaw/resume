package models

import (
	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
)

type ResumeInfo struct {
	Name       string
	Age        string
	Email      string
	Education  string
	Experience string
	Phone      string
	Mobile     string
	Resumefile string
	Comment    string
}

type Candidate struct {
	Id         int64
	Fullname   string
	Age        int64
	Experience int64
	Education  string
	Phone      string
	Mobile     string
	Email      string
}

type Document struct {
	Id          int64
	Candidateid int64
	Filepath    string
}

type Comment struct {
	Id          int64
	Candidateid int64
	Info        string
}

func init() {
	orm.Debug, _ = beego.AppConfig.Bool("ormdebug")

	orm.RegisterDriver("postgres", orm.DR_Postgres)
	user := beego.AppConfig.String("postuser")
	pwd := beego.AppConfig.String("postpwd")
	db := beego.AppConfig.String("postdb")

	connstr := "user=" + user + " password=" + pwd + " dbname=" + db + " sslmode=disable"
	beego.Debug(connstr)

	orm.RegisterDataBase("default", "postgres", connstr)

	orm.RegisterModel(new(Candidate), new(Document), new(Comment))
}

func NewResume(info ResumeInfo) {
	o := orm.NewOrm()

	o.Begin()

	var c Candidate
	c.Age, _ = strconv.ParseInt(info.Age, 0, 64)
	c.Fullname = info.Name
	c.Education = info.Education
	c.Experience, _ = strconv.ParseInt(info.Experience, 0, 64)
	c.Email = info.Email
	c.Mobile = info.Mobile
	c.Phone = info.Phone
	candidateid, err := o.Insert(&c)
	if err != nil {
		beego.Error(err)
		o.Rollback()
	}

	document := Document{Candidateid: candidateid, Filepath: info.Resumefile}
	_, err = o.Insert(&document)
	if err != nil {
		beego.Error(err)
		beego.Error("insert DOCUMENT failed")
		o.Rollback()
	}

	comment := Comment{Candidateid: candidateid, Info: info.Comment}
	_, err = o.Insert(&comment)
	if err != nil {
		beego.Error(err)
		beego.Error("insert Comment failed")
		o.Rollback()
	}

	o.Commit()

}
