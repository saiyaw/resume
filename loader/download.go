package main

import (
	"log"
	"os"
	"os/exec"
	"strconv"
	"sync"
)

var wg sync.WaitGroup

func exeCommand(start int, end int) {
	wd, _ := os.Getwd()
	cmd := wd + "/script/download.js --start=" + strconv.Itoa(start) + " --end=" + strconv.Itoa(end)
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
	num := 32

	wg.Add(num)

	start := 137000

	for i := 0; i < num; i++ {
		end := start + 1000
		go exeCommand(start, end)
		start = end
	}
	/*
		go exeCommand("120000", "121000")
		go exeCommand("121000", "122000")
		go exeCommand("122000", "123000")
		go exeCommand("123000", "124000")
		go exeCommand("124000", "125000")
		go exeCommand("125000", "126000")
		go exeCommand("126000", "127000")
		go exeCommand("127000", "128000")
		go exeCommand("128000", "129000")
		go exeCommand("129000", "130000")
		go exeCommand("130000", "131000")
		go exeCommand("131000", "132000")
		go exeCommand("132000", "133000")
		go exeCommand("133000", "134000")
		go exeCommand("134000", "135000")
		go exeCommand("135000", "136000")
	*/
	wg.Wait()
	log.Println("done.")

}
