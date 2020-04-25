/*
 *	----- 48450 -- week 5 lab handout 3 part 1------ 
By programing the handout 3 part 1, you will follow the lecture notes to implement the Named pipe (FIFO). In this handout, we have created 2 processes. the writing process -- P3-named_pipes_part1.c and reading process P3-named_pipes_part2.c. You need to compile the both c files and run them in two linux terminals. Once you open the two terminals, one is run the writing process which you can type the characters and you will see all the characters appear on the reading process terminal.  
*
*/
// This side writes data into FIFO 
#include <stdio.h> 
#include <string.h> 
#include <fcntl.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <unistd.h> 
#include <stdlib.h>
  
int main() 
{ 
    int fd; 
  
    // FIFO file path 
    char * myfifo = "./myfifo"; 
  
    /* The difference between the Pipe and Name pipe(FIFO) is here */
    // Creating the named file(FIFO) 
    // mkfifo(<pathname>, <permission>) 
    mkfifo(myfifo, 0666);  //difference 1
  
    char arr2[80];
    int abc=1234; //this is an exit number to let the program exit
 
    while (1) 
    { 
        // Open FIFO for write only 
        fd = open(myfifo, O_WRONLY); // difference 2
  
	printf("Process 1 is waiting for data input to FIFO\n");
        // Take an input arr2ing from user. 
        // 80 is maximum length 
        fgets(arr2, 80, stdin); 
	printf("Write into FIFO\n\n");
  
        // Write the input arr2ing on FIFO 
        // and close it 
        write(fd, arr2, strlen(arr2)+1); 
        close(fd); 
	printf("the characters written into FIFO: %s\n",arr2);

  	if (abc==atoi(arr2)) {printf("this is an exit number '1234'!\n"); 
exit(0);}
    } 
    return 0; 
} 
