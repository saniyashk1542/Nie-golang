package main 

import "fmt"

func main(){
	var num int
	fmt.Println("Enter the number of array elements")
	fmt.Scan(&num)

	even:=make([]int,num)
	fmt.Println("Enter",num,"even numbers")

	for i:=0;i<num;i++{
		fmt.Scan(&even[i])
	}
	fmt.Println("Even numbers are as follows:",even)


	var remove int
	fmt.Println("eneter the index to be removed")
	fmt.Scan(&remove)

	even=append(even[:remove],even[remove+1:]...)
	fmt.Println("After removing the element ,slice:",even)

	start,end:=0,0
	fmt.Println("eneter the start and end index which to be removed")
	fmt.Scan(&start, &end)

	even=append(even[:start],even[end:]...)
	fmt.Println("After removing the multiple element ,slice:",even)


}