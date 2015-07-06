package util

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type PeriodInfo struct {
	StartYear  int
	StartMonth int
	EndYear    int
	EndMonth   int
}

type EducationInfo struct {
	University string
	Major      string
	Degree     string
	Period     PeriodInfo
}

type ExperienceInfo struct {
	Company        string
	Period         PeriodInfo
	Position       string
	Responsibility string
}

type CareerIntentionInfo struct {
	PriceLow  float64
	PriceHigh float64
	Position  []string
	Industry  []string
	City      []string
}

type CandidateInfo struct {
	Index           int64
	Name            string
	Age             int64
	WorkingYears    int64
	Degree          string
	Phone           string
	Email           string
	IsVisible       bool
	Experience      []ExperienceInfo
	Education       []EducationInfo
	SelfEvaluation  string
	Gender          string
	Address         string
	Skills          []string
	EstimatePrice   float64
	CareerIntention CareerIntentionInfo
}

type Page struct {
	URL       string
	Doc       *goquery.Document
	Candidate CandidateInfo
}

func (p *Page) OpenDocument() {
	f, _ := os.Open(p.URL)
	defer f.Close()
	doc, err := goquery.NewDocumentFromReader(f)
	if err != nil {
		log.Fatal(err)
	}
	p.Doc = doc

}

func (p *Page) OpenPage() {
	doc, err := goquery.NewDocument(p.URL)
	if err != nil {
		log.Fatal(err)
	}
	p.Doc = doc
}

func (p *Page) GetCandidateInfo() {
	// index
	p.getIndex()

	// name
	p.getName()

	// age, working years and degree
	p.getAgeWorkingYearsAndDegree()

	// phone
	p.getPhone()

	// email
	p.getEmail()

	// work experience
	p.getWorkExperience()

	// education
	p.getEducation()

	// Self Evaluation
	p.getSelfEvaluation()

	// gender, address
	p.getGenderAndAddress()

	//skills
	p.getSkills()

	// estimate price
	p.getEstimatePrice()

	// career intention
	p.getCareerIntention()

}

func (p *Page) getIndex() {
	p.Doc.Find("#resumeid").Each(func(i int, s *goquery.Selection) {
		title, _ := s.Attr("value")
		p.Candidate.Index, _ = strconv.ParseInt(strings.TrimSpace(title), 10, 64)

		//	log.Printf("%d) %s", i+1, title)

	})

}

func (p *Page) getName() {
	p.Doc.Find(".ct-top .first .name").Each(func(i int, s *goquery.Selection) {
		//	title := s.Find("span").Text()
		title := strings.TrimSpace(s.Text())
		if i == 1 {
			p.Candidate.Name = title
		}

		//		log.Printf("%d) %s", i+1, title)
	})

}

func (p *Page) getAgeWorkingYearsAndDegree() {
	p.Doc.Find("ul.er.three").Each(func(i int, s *goquery.Selection) {
		l := strings.Split(s.Find("li").Text(), "|")

		if len(l) == 3 {
			fmt.Sscanf(strings.TrimSpace(l[0]), "%d岁", &p.Candidate.Age)
			fmt.Sscanf(strings.TrimSpace(l[1]), "%d年工作经验", &p.Candidate.WorkingYears)
			p.Candidate.Degree = strings.TrimSpace(l[2])
		}

	})

}

func (p *Page) getPhone() {
	p.Doc.Find("span.ph").Each(func(i int, s *goquery.Selection) {
		p.Candidate.Phone = strings.TrimSpace(s.Text())
		p.Candidate.IsVisible = true
		//	log.Printf("%d) %s", i+1, title)
	})

}

func (p *Page) getEmail() {
	p.Doc.Find("span.e-main").Each(func(i int, s *goquery.Selection) {
		p.Candidate.Email = strings.TrimSpace(s.Text())
		//	log.Printf("%d) %s", i+1, title)
	})

}

func (p *Page) getWorkExperience() {
	p.Doc.Find(".c-nr.c-nr1").Each(func(i int, s *goquery.Selection) {
		var exp ExperienceInfo
		exp.Company = strings.TrimSpace(s.Find("span.fl").Text())

		//		log.Println(s.Find("span.fl").Text())
		//		log.Println(s.Find("span.fr").Text())
		//		log.Println(s.Find(".he-text").Text())
		exp.Position = strings.TrimSpace(s.Find(".he-text").Text())
		fmt.Sscanf(strings.TrimSpace(s.Find("span.fr").Text()), "%d年%d月—%d年%d月", &exp.Period.StartYear, &exp.Period.StartMonth, &exp.Period.EndYear, &exp.Period.EndMonth)
		//	title := strings.TrimSpace(s.Text())
		//	log.Printf("%d) %s", i+1, title)

		// exp.Responsibility = strings.TrimSpace(s.Find(".ct-center-works1").Text())
		exp.Responsibility = strings.TrimSpace(s.Find(".ct-center-works1").Text())
		p.Candidate.Experience = append(p.Candidate.Experience, exp)

	})

}

func (p *Page) getEducation() {
	p.Doc.Find(".NoobSchool").Each(func(i int, s *goquery.Selection) {
		var edu EducationInfo
		//	title := s.Find(".nian.fr").Text()
		edu.University = strings.TrimSpace(s.Find(".xuxiao").Text())
		edu.Major = strings.TrimSpace(s.Find(".zhuye").Text())
		edu.Degree = strings.TrimSpace(s.Find(".ke").Text())
		fmt.Sscanf(strings.TrimSpace(s.Find(".nian.fr").Text()), "%d年%d月-%d年%d月", &edu.Period.StartYear, &edu.Period.StartMonth, &edu.Period.EndYear, &edu.Period.EndMonth)
		//	title := strings.TrimSpace(s.Text())
		//log.Printf("%d) %s", i+1, title)

		p.Candidate.Education = append(p.Candidate.Education, edu)

	})

}

func (p *Page) getSelfEvaluation() {
	p.Doc.Find(".ping").Each(func(i int, s *goquery.Selection) {
		p.Candidate.SelfEvaluation = strings.TrimSpace(s.Text())
		//		title := strings.TrimSpace(s.Text())
		//		log.Printf("%d) %s", i+1, title)
	})

}

func (p *Page) getGenderAndAddress() {
	p.Doc.Find(".dang span").Each(func(i int, s *goquery.Selection) {
		//	title := strings.TrimSpace(s.Text())
		//	log.Printf("%d) %s", i+1, title)

		switch i {
		case 5:
			p.Candidate.Gender = strings.TrimSpace(s.Text())
		case 7:
			p.Candidate.Address = strings.TrimSpace(s.Text())
		}
	})
}

func (p *Page) getSkills() {
	p.Doc.Find(".jineng1 span").Each(func(i int, s *goquery.Selection) {
		p.Candidate.Skills = append(p.Candidate.Skills, strings.TrimSpace(s.Text()))
		//		log.Printf("%d) %s", i+1, title)

	})

}

func (p *Page) getEstimatePrice() {
	p.Doc.Find(".pg-sj span").Each(func(i int, s *goquery.Selection) {
		if i == 1 {
			//		title := strings.TrimSpace(s.Text())
			fmt.Sscanf(strings.TrimSpace(s.Text()), "%fW/年", &p.Candidate.EstimatePrice)
			//		log.Printf("%d) %s", i+1, title)
		}

	})

}

func (p *Page) getCareerIntention() {
	p.Doc.Find(".zhiye-hope").Each(func(i int, s *goquery.Selection) {
		switch i {
		case 0:
			p.Candidate.CareerIntention.Position = strings.Split(strings.TrimSpace(s.Text()), "/")
		case 1:
			p.Candidate.CareerIntention.Industry = strings.Split(strings.TrimSpace(s.Text()), ",")
		case 2:
			fmt.Sscanf(strings.TrimSpace(s.Text()), "%fK-%fK", &p.Candidate.CareerIntention.PriceLow, &p.Candidate.CareerIntention.PriceHigh)
		case 3:
			p.Candidate.CareerIntention.City = strings.Split(strings.TrimSpace(s.Text()), ";")
		}

		//		title := strings.TrimSpace(s.Text())
		//		log.Printf("%d) %s", i+1, title)

	})

}
