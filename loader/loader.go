package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/saiyawang/resumereader/cvreader/util"
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

func importResumeInFolder(foldername string) {
	fnlst := getfilelist(foldername)
	for _, v := range fnlst {
		ImportOneCandidateInfo(foldername, v)

	}

}

func main() {

	importResumeInFolder("android")
	importResumeInFolder("java")
	importResumeInFolder("php")
	importResumeInFolder("web")

	//	ImportOneCandidateInfo("web", "11365.html")

}
