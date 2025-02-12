package main

import "fmt"

func main(){
	var arr =[5]int{2,4,6,8,10,}
	fmt.Println("Array of First % Even NUmbers:",arr)
	//array is fixed
	// array=append(arr,10) it is static so it will not append it will Throw error

	slice:=[]int{5,10,15,20}
	fmt.Println("slice contains:",slice)
	//slice has dynamic size
}