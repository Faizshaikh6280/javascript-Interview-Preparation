"use strict";
// polyfill map
// const nums = [1, 2, 3, 5];

// const newArr = nums.map((num) => num * 2);

// // Polyfill of a map
// Array.prototype.mymap = function (fn, context = this) {
//   this = context;
//   const temp = [];
//   for (let i = 0; i < this.length; i++) {
//     temp.push(fn(this[i], i, this));
//   }
//   return temp;
// };

// Array.prototype.myfilter = function (fn, context = this) {
//   const temp = [];
//   this = context;

//   for (let i = 0; i < this.length; i++) {
//     if (fn(this[i], i, this)) temp.push(this[i]);
//   }
//   return temp;
// };

// Array.prototype.myReduce = function (cb, initialVal) {
//   let temp = initialVal;
//   this = context;

//   for (let i = 0; i < this.length; i++) {
//     temp = cb(temp, this[i], i, this);
//   }
//   return temp;
// };

// console.log(nums.myReduce((acc, item) => ({ ...acc, [`${item}`]: item }), {}));

// Functions Questions.
// (function (y) {
//   return (function (x) {
//     console.log(y);
//   })(1);
// })(2);

// ******* Questions on Closures **********
//Ques1. Write Once Functions

function Once(func, context) {
  let isRan = false;
  return function () {
    if (!isRan) {
      isRan = true;
      return func.apply(context || this, arguments);
    }
  };
}

// const sum = (a, b) => a + b;
// const sumOne = Once(sum);
// console.log(sumOne(2, 3));
// Ques2. Memoize Polyfill

// Question on Curry

// function sum(a) {
//   return function (b) {
//     if (b) return sum(a + b);
//     return a;
//   };
// }

// console.log(sum(2)(3)(6)());

// Queestion : Difference between Currying and Partial Applicatioon.
//Curring; In this the we return the function same number of times as many argument we need to pass.
//e.g : sum(1)(2)(3);

// Partial Function : It means that the number of return function may less than the arguments we need to pass.
//e.g : const sumwith10 = sum(10);

// console.log(sumWith10(2,3)) // 15
// console.log(sumWith10(5,3)) // 18

// Partial Function are used for reusability here we are using 10

//Question:  Convert a formal function into a curried function.

// e.g f(a,b,c) into f(a)(b)(c)

function sum(a, b) {
  return a + b;
}

function curry(func) {
  return function curried(...args) {
    if (func.length <= args.length) {
      return func(...args);
    } else {
      return function (...next) {
        return curried(...args, ...next);
      };
    }
  };
}

const curriedSum = curry(sum);

// console.log(curriedSum(1)(2));

// Polyfill of Call Function.

Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("this is not a function");
  }
  context.fn = this;
  context.fn(...args);
};

Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new Error("this is not a function");
  }
  context.fn = this;

  return function (...newargs) {
    context.fn(...args, ...newargs);
  };
};

const user = {
  name: "Faiz",
  age: 20,
};

function logInfo(habit1, habit2) {
  console.log(
    `name = ${this.name}, age = ${this.age},habit = ${
      habit1 ? habit1 + "," : ""
    }${habit2 ? habit2 + "," : ""}`
  );
}

// const logUserInfo = logInfo.bind(user, "coding");

// logUserInfo("gyming");

// Ques  : Create a memoized function

const memoized = (func) => {
  const memObj = {};
  return function (...args) {
    if (args.length > func.length) {
      console.log(func.length);
      throw new Error("Argument is more than excepted.");
    }
    const argKey = JSON.stringify(args);
    const isArgsExists = argKey in memObj;

    if (isArgsExists) {
      console.log("Answer from cache for key", argKey);
      return memObj[argKey];
    } else {
      const ans = func.apply(this, args);
      memObj[argKey] = ans;
      console.log(ans);
      return ans;
    }
  };
};

const addTwoNumber = (a, b, c) => {
  if (!a) a = 0;
  if (!b) b = 0;
  if (!c) c = 0;
  return a + b + c;
};

// const memoizedAdd = memoized(addTwoNumber);
// memoizedAdd(1, 2, 3);

const memoFindFactorial = memoized((x) => {
  {
    if (x == 0 || x == 1) return 1;
    return x * memoFindFactorial(x - 1);
  }
});

// memoFindFactorial(5);

// Ques2 : DOM Finder

function getPathFromChild(parent, child) {
  let currentElem = child;
  const path = [];
  while (currentElem !== parent) {
    const parent = currentElem.parentElement;
    const childArray = Array.from(parent.children);

    path.push(childArray.indexOf(currentElem));

    currentElem = parent;
  }

  return path;
}

function getValueFromPath(parent, path) {
  let curElem = parent;
  while (path.length) {
    curElem = curElem.children[path.pop()];
  }

  return curElem.innerText;
}

function domFinder() {
  const rootA = document.getElementById("rootA");
  const nodeA = document.getElementById("nodeA");

  const rootB = document.getElementById("rootB");

  const path = getPathFromChild(rootA, nodeA);

  const val = getValueFromPath(rootB, path);
  console.log(val);
}

domFinder();
