// //forEach example 
// var arr = ["apple", 'banana', 'Mongo', 'naspati'];
// var a;
// arr.forEach(triple);

// function triple(element, index, array){
//     array[index] = a;
//     a = element.charAt(0).toUpperCase() + element.slice(1) ;
//     console.log(a);

// }

// // map example
// const arry = [1,2,3,4,5]
// const students = ["shawon","opy","alif","arnob"]
// const newstudents = students.map(high);
// const newarr = arry.map(square);

// console.log(newarr);
// console.log(newstudents);

// function square(element){
//     return Math.pow(element, 3); 
// }

// function high(element){
//     return element.toUpperCase(); 
// }

// //filter example 
// var arri = [1,2,3,4]
// var newarri = arri.filter(check)
// console.log(newarri)

// function check(element){
//     return element > 4;
// }

// //find
// var arrie = [1,2,3,4,5]
// var newarrie = arrie.find(checks)
// console.log(newarrie)

// function checks(element){
//     return element == 2;
// }

// //async function use case 
// async function abcd(){
//     var blob = await fetch('https://randomuser.me/api/');
//     var ans = await blob.json();
//     console.log(ans.results[0].name);
// }
// abcd();

// //promise example 
// var ans = new Promise((res,rej)=>{
//     if (true){
//         return res();
//     } 
//     else {
//         return rej();
//     }
// })
// ans
// .then(()=>{
//     console.log('resolved')
// })
// .catch(()=>{
//     console.log('rejected')
// })

// //another promise example 
// var ans = new Promise((res, rej)=>{
//     return res("r ektu baki");
// }) 


// var p1 = ans.then((data)=>{
//     console.log(data)
//     return new Promise((res, rej)=>{
//         return res('dekho hoise kina')
//     })
// })

// var p2 = p1.then((data)=>{
//     console.log(data)
//     return new Promise((res, rej)=>{
//         return res('r korbo na eta hoile')
//     })
// })

// // async await example
// async function abcd(){
//     var raw = await fetch('https://randomuser.me/api/');
//     var ans = await raw.json();
//     console.log(ans);
// }

// abcd();

// fs modules of node.js
// const fs = require('fs');

// fs.readFile('./nothing.txt', 'utf8' ,function(err,data){
//     if(err) console.error(err);
//     else console.log(data)
// })
// create server example
// const http = require('http');

// const server = http.createServer((req,res) => {
//     res.end('found');
// })

// server.listen(3000); 

