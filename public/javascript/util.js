function arrayRemoveIndices(array, indices) {
    let myArray = [];
    for (const index of indices) {
        myArray.push(index);
    }
    myArray.sort((a, b) => { return a - b; });
    while (myArray.length > 0) {
        array.splice(myArray.pop(), 1);
    }
}