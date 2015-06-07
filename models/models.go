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
}

type Contacttype struct {
	Id   int
	Type string
}

type Documenttype struct {
	Id   int
	Type string
}

type Contact struct {
	Id          int64
	Candidateid int64
	Typeid      int64
	Info        string
}

type Document struct {
	Id          int64
	Candidateid int64
	Typeid      int64
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

	orm.RegisterDataBase("default", "postgres", connstr)

	orm.RegisterModel(new(Candidate), new(Contacttype), new(Contact), new(Documenttype), new(Document), new(Comment))
}

func NewResume(info ResumeInfo) {
	o := orm.NewOrm()

	contacttype_email := Contacttype{Type: "EMAIL"}
	err := o.Read(&contacttype_email, "type")
	if err != nil {
		beego.Error(err)
	}

	contacttype_phone := Contacttype{Type: "PHONE"}
	err = o.Read(&contacttype_phone, "type")
	if err != nil {
		beego.Error(err)
	}

	contacttype_mobile := Contacttype{Type: "MOBILE"}
	err = o.Read(&contacttype_mobile, "type")
	if err != nil {
		beego.Error(err)
	}

	doctype_doc := Documenttype{Type: "WORD"}
	err = o.Read(&doctype_doc, "type")
	if err != nil {
		beego.Error(err)
	}

	o.Begin()

	var c Candidate
	c.Age, _ = strconv.ParseInt(info.Age, 0, 64)
	c.Fullname = info.Name
	c.Education = info.Education
	c.Experience, _ = strconv.ParseInt(info.Experience, 0, 64)
	candidateid, err := o.Insert(&c)
	if err != nil {
		beego.Error(err)
		o.Rollback()
	}
	beego.Debug(candidateid)

	contact_email := Contact{Candidateid: candidateid, Typeid: int64(contacttype_email.Id), Info: info.Email}
	_, err = o.Insert(&contact_email)
	if err != nil {
		beego.Error(err)
		beego.Error("insert contact :MAIL failed")
		o.Rollback()
	}

	contact_phone := Contact{Candidateid: candidateid, Typeid: int64(contacttype_phone.Id), Info: info.Phone}
	_, err = o.Insert(&contact_phone)
	if err != nil {
		beego.Error(err)
		beego.Error("insert contact :PHONE failed")
		o.Rollback()
	}

	contact_mobile := Contact{Candidateid: candidateid, Typeid: int64(contacttype_mobile.Id), Info: info.Mobile}
	_, err = o.Insert(&contact_mobile)
	if err != nil {
		beego.Error(err)
		beego.Error("insert contact :MOBILE failed")
		o.Rollback()
	}

	document_word := Document{Candidateid: candidateid, Typeid: int64(doctype_doc.Id), Filepath: info.Resumefile}
	_, err = o.Insert(&document_word)
	if err != nil {
		beego.Error(err)
		beego.Error("insert contact :WORD failed")
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
