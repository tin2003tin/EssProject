package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net"
)

type TinProtocol struct {
	Command   string
	Data      []byte
	SecretKey string
}

type Response struct {
    Message    string
    StatusCode int
}

func main() {
	listener, err := net.Listen("tcp","localhost:8080");
	if err != nil {
		fmt.Println("Error",err)
	}
	defer listener.Close()
	fmt.Println("Server is listerning on port 8080");
	for {
		conn,err := listener.Accept();
		if err != nil {
			fmt.Println("Error",err)
			continue
		}
		go handleClient(conn)
	}
}

func handleClient(conn net.Conn) {
	defer conn.Close()
	buffer := make([]byte, 1024);
	for {
		fmt.Println("Client connected")
		n,err := conn.Read(buffer)
		if err != nil {
			handleError(&conn,err)
			return
		}
		tp,err := BufferProtocol(buffer[:n]);
		if err != nil {
			handleError(&conn,err)
			return
		}
		err = ValidateProtocol(tp);
		if err != nil {
			handleError(&conn,err)
			return
		}

		statusCode := 200;
		response := Response{
			Message: "Welcome",
			StatusCode: statusCode,
		}
		jsonBytes,err := json.Marshal(response);
		if err != nil {
			handleError(&conn,err)
			return;
		}
		_,err = conn.Write(jsonBytes)
		if (err != nil) {
			handleError(&conn, err)
			return;
		} 
		break;
	}
}

func BufferProtocol(buffer []byte) (*TinProtocol, error) {
	rawData := string(buffer)
	var obj TinProtocol
	if err := json.Unmarshal([]byte(rawData), &obj); err != nil {
		return nil, fmt.Errorf("error unmarshaling JSON: %v", err)
	}
	return &obj, nil
}

func ValidateProtocol(tp *TinProtocol) error {
	if tp == nil {
		return errors.New("Protocol is nil")
	}
	if tp.SecretKey != "1234" {
		return errors.New("The SecretKey is incorrect")
	}
	if tp.Command == "" {
		return errors.New("The Command is required")
	}
	
	return nil
}

func handleError(conn *net.Conn, err error) {
	if err != nil {
		errorMsg := struct{ Error string }{Error: err.Error()}
		jsonBytes, jsonErr := json.Marshal(errorMsg)
		if jsonErr != nil {
			fmt.Println("Error marshaling JSON:", jsonErr)
			return
		}
		_, writeErr := (*conn).Write(jsonBytes)
		if writeErr != nil {
			fmt.Println("Error writing error message:", writeErr)
		}
	}
}

