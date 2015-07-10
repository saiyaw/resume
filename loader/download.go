package main

import (
	"io"
	"log"
	"os"
	"os/exec"
	"strconv"
	"sync"
)

func checkError(err error) {
	if err != nil {
		log.Fatalf("Error: %s", err)
	}
}

func exeCommand(start int, end int, wg *sync.WaitGroup) {
	wd, _ := os.Getwd()
	cmdstr := wd + "/script/download.js --start=" + strconv.Itoa(start) + " --end=" + strconv.Itoa(end)
	log.Println(cmdstr)
	cmd := exec.Command("casperjs", cmdstr)
	stdout, err := cmd.StdoutPipe()
	checkError(err)
	/*
		scanner_out := bufio.NewScanner(stdout)
		go func() {
			for scanner_out.Scan() {
				log.Println(scanner_out.Text())
			}
		}()
	*/
	stderr, err := cmd.StderrPipe()
	checkError(err)
	/*
		scanner_err := bufio.NewScanner(stderr)
		go func() {
			for scanner_err.Scan() {
				log.Println(scanner_err.Text())
			}
		}()
	*/

	err = cmd.Start()
	checkError(err)

	go io.Copy(os.Stdout, stdout)
	go io.Copyopy(os.Stderr, stderr)

	cmd.Wait()

	wg.Done()
}

func main() {
	//	runtime.GOMAXPROCS(runtime.NumCPU())
	wg := new(sync.WaitGroup)
	num := 20

	wg.Add(num)

	start := 1630000

	for i := 0; i < num; i++ {
		end := start + 25000
		go exeCommand(start, end, wg)
		start = end
	}

	wg.Wait()
	log.Println("done.")

}
