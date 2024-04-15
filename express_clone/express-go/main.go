package main

import (
	"fmt"
	"net/http"
)


func handleRoot(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, World!")
}
func main() {
    app := myExpress()
	app.get("/",handleRoot);
    // Define port number
    port := ":3000"

    // Start the server
    app.listen(port, func(err error) {
        if err != nil {
            fmt.Println("Error starting server:", err)
        } else {
            fmt.Println("Server listening on port", port)
        }
    })
}

func myExpress() *App {
    app := &App{}
    return app
}

type Route struct {
	Path string
	Handler http.HandlerFunc
}

// App represents the application.
type App struct{
	Routes []Route
}

func (app *App) getHandlerIndex(path string) int {
	for i, route := range app.Routes {
		if (route.Path == path) {
			return i;
		}
	}
	return -1;
}

func (app *App) getHandlerFunc(path string) http.HandlerFunc {
	index := app.getHandlerIndex(path);
	if (index != -1) {
		return app.Routes[index].Handler
	}	
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound) 
		fmt.Fprintf(w, "Cannot %s %s", r.Method, r.URL.Path)
	}
}

func (app *App) get(path string, handler http.HandlerFunc) {
	app.Routes = append(app.Routes, Route{Path: path, Handler: handler})
}

func (app *App) listen(port string, callback func(error)) {
    http.HandleFunc("/", app.requestHandler)
    err := http.ListenAndServe(port, nil)
    callback(err)
}

func (app *App) requestHandler(w http.ResponseWriter, r *http.Request) {
    method := r.Method;
	urlPath := r.URL.Path
	if (method == "GET") {
		handler := app.getHandlerFunc(urlPath)
		handler(w,r)
	} else {
		w.WriteHeader(http.StatusNotFound)
        fmt.Fprintf(w, "Cannot %s %s", method, urlPath)
	}
}
