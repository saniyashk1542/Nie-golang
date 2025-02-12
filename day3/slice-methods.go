package main 

import "fmt"

func main(){
	slice:=[]int{3,6,9}
	fmt.Println("before Appending new elements,slice:",slice)

	//append data 
	slice= append(slice,12)
	slice =append(slice,15,18)

	fmt.Println("After Appending new elements,slice:",slice)
// length of slice
	fmt.Println("length of slice is:",len(slice))

	//copy the slice
	new_slice:=make([]int,6)
	copy_slice:=copy(new_slice,slice)

	fmt.Println("The existing slice elements are:",slice)
	fmt.Println("The newly copied slice elements are:",new_slice)

	fmt.Println("The number slice elements copied are:",copy_slice)


	//clear all elements

	new_slice =nil
	fmt.Println("new slice is empty",new_slice)


}