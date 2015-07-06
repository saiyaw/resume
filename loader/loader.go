package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/saiyawang/resume/loader/util"
)

func testdb() {
	util.Test()

}

func ImportOneCandidateInfo(foldername string, filename string) {
	url := "http://127.0.0.1:7070/" + foldername + "/" + filename
	log.Println(url)
	var page util.Page
	page.URL = url
	page.OpenPage()
	page.GetCandidateInfo()
	util.ImportCandidate(page.Candidate)
	log.Println("................................ok")
}

func getfilelist(foldername string) []string {
	folder := "d:/cloud/data/" + foldername
	var filelist []string
	filepath.Walk(folder, func(path string, f os.FileInfo, err error) error {
		if f.IsDir() != true {
			filelist = append(filelist, f.Name())
		}

		return nil
	})
	return filelist

}

func getfilelistinfolder(folderpath string) []string {
	var filelist []string
	filepath.Walk(folderpath, func(path string, f os.FileInfo, err error) error {
		if f.IsDir() != true {
			if strings.Contains(f.Name(), "html") {
				filelist = append(filelist, path)
			}
		}
		return nil
	})
	return filelist
}

func importResumeInFolder(foldername string) {
	fnlst := getfilelist(foldername)
	for _, v := range fnlst {
		ImportOneCandidateInfo(foldername, v)

	}
}

func importOneLocalResume(f string, b bool) {
	var page util.Page
	page.URL = f
	page.OpenDocument()
	page.GetCandidateInfo()
	log.Println(page.Candidate)
	if b {
		util.ImportCandidate(page.Candidate)
		ss := strings.Split(f, "\\")
		//	log.Println(ss[len(ss)-1])
		newpath := "d:/imported/" + ss[len(ss)-1]
		log.Println(newpath)
		/*
			err := os.Rename(f, newpath)
			if err != nil {
				log.Println(err)
			}
		*/
	}

	log.Println("................................ok")
}

func importResumeInLocalFolder(folderpath string, b bool) {
	fnlst := getfilelistinfolder(folderpath)
	//	log.Println(fnlst)
	for _, v := range fnlst {
		importOneLocalResume(v, b)
	}
}

func main() {
	/*
		importResumeInFolder("android")
		importResumeInFolder("java")
		importResumeInFolder("php")
		importResumeInFolder("web")
	*/
	//	ImportOneCandidateInfo("web", "11365.html")
	//	filepath := "D:/cloud/data/web/3143.html"
	//	importOneLocalResume(filepath)

	//	importResumeInLocalFolder("F:/resume", true)
	importResumeInLocalFolder("F:/dig50000", true)
	//importResumeInLocalFolder("D:/Cloud/data", true)

}
