package main

import "fmt"

func main(){
	number:=20
	if number%2 ==0{
		fmt.Println(number,"is even number")
	}else{
		fmt.Println(number," is odd number")
	}

	day:="Monday"
	switch day{
	case "Monday":
		fmt.Println("Start of week")
	case "Saturday":
		fmt.Println("end of week")
	default:
		fmt.Println("Maybe regular day")

	}
}