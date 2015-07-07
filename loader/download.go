package main

import (
	"log"
	"os"
	"os/exec"
	"sync"
)

var wg sync.WaitGroup

func exeCommand(start string, end string) {
	wd, _ := os.Getwd()
	cmd := wd + "/script/download.js --start=" + start + " --end=" + end
	log.Println(cmd)
	scrapeCmd := exec.Command("casperjs", cmd)
	scrape, err := scrapeCmd.Output()
	log.Println(string(scrape))
	if err != nil {
		panic(err)
	}
	wg.Done()
}

func main() {
	wg.Add(16)
	go exeCommand("120001", "125000")
	go exeCommand("125001", "130000")
	go exeCommand("130001", "135000")
	go exeCommand("135001", "140000")
	go exeCommand("140001", "145000")
	go exeCommand("145001", "150000")
	go exeCommand("150001", "155000")
	go exeCommand("155001", "160000")
	go exeCommand("160001", "165000")
	go exeCommand("165001", "170000")
	go exeCommand("170001", "175000")
	go exeCommand("175001", "180000")
	go exeCommand("180001", "185000")
	go exeCommand("185001", "190000")
	go exeCommand("190001", "195000")
	go exeCommand("195001", "200000")

	wg.Wait()
	log.Println("done.")

}
