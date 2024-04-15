package main

import (
	"encoding/json"
	"fmt"
	"net"
)

type TinProtocol struct {
	Command string
	Data []byte
	Secretkey string
}

func main() {
	conn, err := net.Dial("tcp", "localhost:8080")
	if err != nil {
		fmt.Println("Error connecting:", err)
		return
	}

	defer conn.Close()

	protocal := TinProtocol{
        Command: "SEND",
		Data : []byte("Hello Server"),
		Secretkey: "1234",
    }	
	jsonBytes, err := json.Marshal(protocal)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}
	_, err = conn.Write([]byte(jsonBytes))
	if err != nil {
		fmt.Println("Error writing to server:", err)
		return
	}

	response := make([]byte, 1024)
	n, err := conn.Read(response)
	if err != nil {
		fmt.Println("Error reading from server:", err)
		return
	}

	fmt.Println("Server response:", string(response[:n]))
}
