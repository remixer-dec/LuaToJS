**LuaToJS - Translate lua syntax to js** 
[remixer-dec.github.io/LuaToJS/](https://remixer-dec.github.io/LuaToJS/)
Experimental project created to simplify translation of Lua code to JS.
> What's the difference between this project and some similar like [lua2js](https://github.com/mherkender/lua.js)?

This one works without NodeJS, (in browser) and not uses abstraction (like usage of functions to get the value of a table). You get similar to the original code but with some limitations. 
> What are these limitations?

 - Every function must have a return statement in the end.
 - Every reserved keyword will be replaced even if it's inside a string or is a function name. 

> What is unimplemented yet or not working?

* [ ] native functions  
* [ ] constants  
* [ ] 1 line functions  
* [ ] multiple returns  
* [ ] prints with and without brackets  
* [ ] tables with unusual indexes  
* [ ] functions inside tables, created after a tables (like function a.b() )  
* [ ] array / object concatenation  
* [ ] inheritance  
* [ ] __index  
* [ ] dofile/require/loadstring/loadfile  
* [ ] multiple variable assignment  
** **
*[created by Remixer Dec](https://github.com/remixer-dec) | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/legalcode)*

