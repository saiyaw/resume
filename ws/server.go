package ws

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
)

const TEMPLATE_FOLDER = "/tmpl/"

func Start(port string) {
	http.ListenAndServe(port, nil)
}

func InitRoute() {
	http.HandleFunc(TEMPLATE_FOLDER, staticHandler)

	http.HandleFunc("/", viewHandler)

	http.HandleFunc("/submit", submitHandler)
}

func staticHandler(w http.ResponseWriter, r *http.Request) {
//	log.Println(r.URL.Path[1:])
	http.ServeFile(w, r, r.URL.Path[1:])
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	renderHandler(w, r, "index.html")
}

func renderHandler(w http.ResponseWriter, r *http.Request, templatefile string) {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
//	log.Println(wd)
	t, err := template.ParseFiles(wd + TEMPLATE_FOLDER + templatefile)
	if err != nil {
		log.Fatal(err)
	}
	t.Execute(w, nil)
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	name := r.PostFormValue("name")
	age := r.PostFormValue("age")

	fmt.Fprint(w, name+":"+age)

}
