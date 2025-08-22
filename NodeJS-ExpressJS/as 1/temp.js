// note: remove comments from only console.log lines to test codes one by one

// 1st function
function age(years) {
  return years * 365;
}
//console.log(age(2));

// 2nd function
function smallest(arr) {
  let min = arr[0];
  for (let index = 1; index < arr.length; index++) {
    if (arr[index] < min) {
      min = arr[index];
    }
  }
  return min;
}
let arr = [3, 4, 5, 1, 2];
//console.log(smallest(arr));

// 3rd function
function sort_descending(arr) {
  arr.sort(function (a, b) {
    return b - a;
  });
  return arr;
}
arr = [1, 2, 3, 4, 5];
//console.log(sort_descending(arr));

// 4th function
function avg(arr) {
  let sum = 0;
  for (let index = 0; index < arr.length; index++) {
    sum += arr[index];
  }
  return sum / arr.length;
}
arr = [2, 4, 6, 8, 10];
//console.log(avg(arr)); //  30/5 = 6

// what is the output of:
//console.log([] == []); // false
//console.log({} == {}); // false
/* And explain your answer:
    The equality operator compares the references of the two arrays or the two objects, and since they have different references, the result is false.
*/

// what is the output of this code:
function main() {
  console.log("A");
  setTimeout(function print() {
    console.log("B");
  }, 0);
  console.log("C");
}
//main();
/* 
A
C
B
explaination:
C is printed before B even though the delay is set to 0 ms, the setTimeout function will still be added to the event loop and executed after any currently executing code finishes
*/

// what is the output of this code:
var num = 8;
var num = 10;
//console.log(num);
/*
10 
explaination:
in js, variable takes the last value you redeclared using the var keyword 
*/

// what is the output of this code:
function sayHi() {
  console.log(name);
  console.log(age);
  var name = "Ayush";
  let age = 21;
}
//sayHi();
/*
undefined
ReferenceError: age is not defined

explaination:
undefined because the variable name is declared using the var keyword, which gets hoisted to the top of the function scope and at that point, the variable name has not been assigned a value yet, so its value is undefined.

ReferenceError because the variable age is declared using the let keyword, which has block scope and is not hoisted, then it tries to access the variable before it has been declared or assigned a value
*/

// Thank You
