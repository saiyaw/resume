package models

import (
	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
	"github.com/saiyawang/resume/loader/util"
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

func init() {
	orm.Debug, _ = beego.AppConfig.Bool("ormdebug")

	orm.RegisterDriver("postgres", orm.DR_Postgres)
	user := beego.AppConfig.String("postuser")
	pwd := beego.AppConfig.String("postpwd")
	db := beego.AppConfig.String("postdb")

	connstr := "user=" + user + " password=" + pwd + " dbname=" + db + " sslmode=disable"
	beego.Debug(connstr)

	//	orm.RegisterDataBase("default", "postgres", connstr)

	//	orm.RegisterModel(new(util.Candidate), new(util.Document), new(util.Comment))
}

func NewResume(info ResumeInfo) {
	o := orm.NewOrm()

	o.Begin()

	var c util.Candidate
	c.Age, _ = strconv.ParseInt(info.Age, 0, 64)
	c.Fullname = info.Name
	c.Degree = info.Education
	c.Workingyears, _ = strconv.ParseInt(info.Experience, 0, 64)
	c.Email = info.Email
	c.Phone = info.Phone
	candidateid, err := o.Insert(&c)
	if err != nil {
		beego.Error(err)
		o.Rollback()
	}

	document := util.Document{Candidateid: candidateid, Filepath: info.Resumefile}
	_, err = o.Insert(&document)
	if err != nil {
		beego.Error(err)
		beego.Error("insert DOCUMENT failed")
		o.Rollback()
	}

	comment := util.Comment{Candidateid: candidateid, Info: info.Comment}
	_, err = o.Insert(&comment)
	if err != nil {
		beego.Error(err)
		beego.Error("insert Comment failed")
		o.Rollback()
	}

	o.Commit()

}

func GetSkillPool() []util.Skillpool {
	o := orm.NewOrm()

	var result []util.Skillpool

	num, err := o.QueryTable("skillpool").All(&result)
	beego.Debug("Returned Rows Num:", num, ", error:", err)

	return result

}
