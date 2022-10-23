
//Första
function getSum(n){
    var sum=0;
    for(let i = 0; i<=n; i++){
        sum += i; 
    }
    return sum;
}



//andra
function getSumOfNumbers(arrayNumbers){
    let sum=0;
    for(const number of numbers){
        sum += number;
    }
    return sum;

}

getSumOfNumbers([3,1,7])


//Tredje 
function getEvenNumbers(number){
    const evenNumbers[];
    for(const number of numbers);

}


[2,4]
getEvenNumbers([3,1,2,7,4]) //-->



//
let counter = 0;
function count(){
    counter +=1;
    return counter 
}

const one = count();
const two = count();
//const three = count();



//
function makeGetThree(){
     function getThree(){
        return 3;
    }
    return getThree

}
const getThree = makeGetThree()
const three = getThree()


//

function makeCount(){

    let counter = 0;
    

    return function(){
        counter += 1;
        return counter
    }
}


const firstCount = makeCount()
firstCount() → 1
firstCount() → 2
const secondCount = makeCount()
secondCount() → 1
secondCount() → 2
secondCount() → 3
secondCount() → 4
firstCount() → 3