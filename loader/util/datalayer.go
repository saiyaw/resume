package util

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
)

type Candidate struct {
	Id             int64
	Fullname       string
	Age            int64
	Workingyears   int64
	Degree         string
	Selfevaluation string
	Gender         string
	Address        string
	Estimateprice  float64
	Email          string
	Phone          string
	Isvisible      bool
	Resumeid       int64
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

type Experience struct {
	Id             int64
	Candidateid    int64
	Company        string
	Position       string
	Responsibility string
	Startdate      time.Time
	Enddate        time.Time
}

type Education struct {
	Id          int64
	Candidateid int64
	University  string
	Major       string
	Degree      string
	Startdate   time.Time
	Enddate     time.Time
}

type Careerintention struct {
	Id          int64
	Candidateid int64
	Pricelow    float64
	Pricehigh   float64
	Position    string
	Industry    string
	City        string
}

type Skillpool struct {
	Id    int64
	Skill string
}

type Candidateskill struct {
	Id          int64
	Candidateid int64
	Skillid     int64
}

func init() {
	orm.Debug = false

	orm.RegisterDriver("postgres", orm.DR_Postgres)

	connstr := "user=postgres password=123456 dbname=resume sslmode=disable"

	orm.RegisterDataBase("default", "postgres", connstr)

	orm.RegisterModel(new(Candidate), new(Document), new(Comment), new(Experience), new(Education), new(Careerintention), new(Skillpool), new(Candidateskill))

}

func Test() {
	o := orm.NewOrm()
	fmt.Println(o.Driver().Name() == "default")
	fmt.Println(o.Driver().Type() == orm.DR_Postgres)
}

func ImportCandidate(cinfo CandidateInfo) {
	o := orm.NewOrm()
	o.Begin()

	// basic information
	//	log.Println("basic information")
	var c Candidate
	c.Degree = cinfo.Degree
	c.Fullname = cinfo.Name
	c.Age = cinfo.Age
	c.Workingyears = cinfo.WorkingYears
	c.Selfevaluation = cinfo.SelfEvaluation
	c.Gender = cinfo.Gender
	c.Address = cinfo.Address
	c.Estimateprice = cinfo.EstimatePrice
	c.Email = cinfo.Email
	c.Phone = cinfo.Phone
	c.Isvisible = cinfo.IsVisible
	c.Resumeid = cinfo.Index
	_, candidateid, err := o.ReadOrCreate(&c, "fullname", "email", "phone")
	if err != nil {
		log.Fatal(err)
		o.Rollback()
	}
	//	log.Println("-------------------ok")
	// career intention
	//	log.Println("career intention")
	var ci Careerintention
	ci.Candidateid = candidateid
	ci.Pricelow = cinfo.CareerIntention.PriceLow
	ci.Pricehigh = cinfo.CareerIntention.PriceHigh
	ci.Position = strings.Join(cinfo.CareerIntention.Position, "|")
	ci.Industry = strings.Join(cinfo.CareerIntention.Industry, "|")
	ci.City = strings.Join(cinfo.CareerIntention.City, "|")
	_, _, err = o.ReadOrCreate(&ci, "candidateid")
	if err != nil {
		log.Fatal(err)
		o.Rollback()
	}
	//	log.Println("-------------------ok")

	//education
	//	log.Println("education")
	//var edulist []Education
	for _, v := range cinfo.Education {
		var edu Education
		edu.Candidateid = candidateid
		edu.Degree = v.Degree
		edu.Major = v.Major
		edu.University = v.University
		if v.Period.StartYear > 0 {
			edu.Startdate = time.Date(v.Period.StartYear, time.Month(v.Period.StartMonth), 1, 0, 0, 0, 0, time.UTC)
		}
		if v.Period.EndYear > 0 {
			edu.Enddate = time.Date(v.Period.EndYear, time.Month(v.Period.EndMonth), 1, 0, 0, 0, 0, time.UTC)
		}

		_, _, err = o.ReadOrCreate(&edu, "candidateid", "degree", "university", "major", "startdate")
		if err != nil {
			log.Fatal(err)
			o.Rollback()
		}

		//edulist = append(edulist, edu)
	}
	/*
		if len(edulist) > 0 {
			_, err = o.InsertMulti(len(edulist), edulist)
			if err != nil {
				log.Fatal(err)
				o.Rollback()
			}

		}
	*/

	//	log.Println("-------------------ok")

	// experience
	//	log.Println("experience")
	//	var explist []Experience
	for _, v := range cinfo.Experience {
		var exp Experience
		exp.Candidateid = candidateid
		exp.Company = v.Company
		exp.Position = v.Position
		exp.Responsibility = v.Responsibility

		if v.Period.StartYear > 0 {
			exp.Startdate = time.Date(v.Period.StartYear, time.Month(v.Period.StartMonth), 1, 0, 0, 0, 0, time.UTC)
		}

		if v.Period.EndYear > 0 {
			exp.Enddate = time.Date(v.Period.EndYear, time.Month(v.Period.EndMonth), 1, 0, 0, 0, 0, time.UTC)
		}

		_, _, err = o.ReadOrCreate(&exp, "candidateid", "company", "position")
		if err != nil {
			log.Fatal(err)
			o.Rollback()
		}

		//		explist = append(explist, exp)
	}
	/*
		if len(explist) > 0 {
			_, err = o.InsertMulti(len(explist), explist)
			if err != nil {
				log.Fatal(err)
				o.Rollback()
			}
		}
	*/
	//	log.Println("-------------------ok")

	//skills
	for _, v := range cinfo.Skills {
		// do not import empty skill
		if strings.TrimSpace(v) == "" {
			continue
		}
		// insert into skills table
		var sp Skillpool
		sp.Skill = v
		_, skillid, err := o.ReadOrCreate(&sp, "skill")
		if err != nil {
			log.Fatal(err)
			o.Rollback()
		}
		// insert into candidate skill
		var cs Candidateskill
		cs.Candidateid = candidateid
		cs.Skillid = skillid
		_, _, err = o.ReadOrCreate(&cs, "candidateid", "skillid")
		if err != nil {
			log.Fatal(err)
			o.Rollback()
		}

	}

	o.Commit()
}
