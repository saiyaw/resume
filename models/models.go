package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
)

type Candidate struct {
	Id         int
	Name       string
	Age        int64
	Email      string
	Experience int64
	City       string
}

func init() {
	orm.Debug, _ = beego.AppConfig.Bool("ormdebug")
	orm.RegisterModel(new(Candidate))
	orm.RegisterDriver("postgres", orm.DR_Postgres)
	user := beego.AppConfig.String("postuser")
	pwd := beego.AppConfig.String("postpwd")
	db := beego.AppConfig.String("postdb")

	connstr := "user=" + user + " password=" + pwd + " dbname=" + db + " sslmode=disable"

	orm.RegisterDataBase("default", "postgres", connstr)
}

func InsertOneCandidate(c Candidate) int64 {
	o := orm.NewOrm()
	id, _ := o.Insert(&c)
	return id

}
