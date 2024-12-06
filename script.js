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

// Array.prototype.myReduce = function (cb, initialVal,context) {
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

// domFinder();

// Ques3 : Flatten an array.
// [[1,2,[3,8]],4,[5,6]];

function flattenArray(arr) {
  return arr.reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      acc = acc.concat(flattenArray(cur));
    } else {
      acc.push(cur);
    }
    return acc;
  }, []);
}

// console.log(flattenArray([[1, 2, [3, 8]], 4, [5, 6]]));

// Ques : Flatten Deeply Nested Object

const obj = {
  A: "12",
  B: 23,
  C: {
    P: 23,
    O: {
      L: 56,
    },
    Q: [1, 2],
  },
  F: {
    A: {
      I: {
        Z: "Faiz",
      },
    },
  },
};

const answer = {
  A: "12",
  B: "23",
  "C.P": "23",
  "C.O.L": "56",
  "C.Q.0": 1,
  "C.Q.1": "2",
};

function flattenDeeplyNestedObject(obj, prevKey) {
  let ans = {};

  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const ansKey = prevKey ? prevKey + "." + keys[i] : keys[i];

    if (Array.isArray(obj[keys[i]])) {
      let arr = obj[keys[i]];
      for (let j = 0; j < arr.length; j++) {
        ans[ansKey + "." + j] = arr[j];
      }
    } else if (typeof obj[keys[i]] === "object") {
      ans = {
        ...ans,
        ...flattenDeeplyNestedObject(obj[keys[i]], ansKey),
      };
    } else {
      ans[ansKey] = obj[keys[i]];
    }
  }

  return ans;
}

// const ansobj = flattenDeeplyNestedObject(obj, "");

// Build Polyfill of Promise.all()

function createPromise(id) {
  const BASE_URL = "https://dummyjson.com/products/";
  return fetch(`${BASE_URL}${id}`);
}

const tasks = [createPromise(50), createPromise(2), createPromise(3)];

function myPromiseAll(tasks) {
  const output = [];
  return new Promise((res, rej) => {
    tasks.forEach((promise, indx) => {
      promise
        .then((data) => {
          output[indx] = data;
          if (indx == tasks.length - 1) {
            res(output);
          }
        })
        .catch((err) => rej(err));
    });
  });
}

// myPromiseAll(tasks).then((data) => {
//   console.log(data);
// });

// Ques : Create a polyfill of arr.spit(str,deliminator)

// mySplit("This is my world"," ") -> ["this","is","my","world"];

function mySplit(str, delimiter) {
  if (delimiter === "") return Array.from(str);
  const res = [];
  let si = 0;
  let ei = str.indexOf(delimiter);
  while (ei != -1) {
    res.push(str.slice(si, ei));
    si = ei + delimiter.length;
    ei = str.indexOf(delimiter, si);
  }

  const last = str.slice(si);
  if (last) res.push(last);

  return res;
}

// Ques : Task Schedules
const Schedules = [
  { id: "a", dependency: ["b", "c"] },
  { id: "b", dependency: ["d"] },
  { id: "c", dependency: ["e"] },
  { id: "d", dependency: [] },
  { id: "e", dependency: ["f"] },
  { id: "f", dependency: [] },
];

function executeTask(tasks, taskname) {
  // Build an adjacency list
  const adjList = new Map();
  for (const task of tasks) {
    adjList.set(task.id, task.dependency);
  }

  const visited = new Set();
  const visiting = new Set();

  const result = [];

  function dfs(task) {
    if (visited.has(task)) return true; // Already processed
    if (visiting.has(task)) return false; // Cycle detected

    visiting.add(task); // Mark as being visited

    for (const dep of adjList.get(task) || []) {
      if (!dfs(dep)) return false; // Cycle detected
    }

    visiting.delete(task); // Remove from being visited
    visited.add(task); // Mark as visited
    result.push(task); // Add to result in topological order
    return true;
  }

  if (!dfs(taskname)) {
    console.log("Cycle exists");
    return false;
  }

  console.log(result.join(" -> ")); // Reverse to get the correct order
  return true;
}

// executeTask(Schedules, "a");

Array.prototype.myReduce = function (cb, initialVal) {
  if (!this.length) {
    if (initialVal !== undefined) return initialVal;
    throw Error("If array is empty , initial value must be provided");
  }

  let i = 0;
  let ans = [];

  if (typeof initialVal === "undefined") {
    ans = this[0];
    i++;
  } else {
    ans = initialVal;
  }

  for (; i < this.length; i++) {
    ans = cb(ans, this[i], i, this);
  }

  return ans;
};

let arr = [1, 2, 3, 4, 5];

// removed initial value from reduce (no 0)
let result = [1, 2].myReduce((sum, cur) => sum + cur);
// console.log(result);

Array.prototype.myfilter = function (fn, context) {
  const temp = [];

  for (let i = 0; i < this.length; i++) {
    if (fn.call(context, this[i], i, this)) temp.push(this[i]);
  }

  return temp;
};

function flattenEmployeeData(employee) {
  // Your code here
  const ans = [];
  helper(employee, ans);
  return ans;
}

function helper(employee, ans) {
  const obj = {
    id: employee.id,
    name: employee.name,
    position: employee.position,
  };

  ans.push(obj);

  const dr = employee.directReports;

  for (let i = 0; i < dr.length; i++) {
    helper(dr[i], ans);
  }
}

const employeeData = {
  id: 1,
  name: "John Doe",
  position: "Manager",
  directReports: [
    {
      id: 2,
      name: "Jane Smith",
      position: "Team Lead",
      directReports: [
        {
          id: 3,
          name: "Bob Johnson",
          position: "Software Engineer",
          directReports: [],
        },
        // ... other direct reports of Jane Smith
      ],
    },
    {
      id: 4,
      name: "Alice Williams",
      position: "Team Lead",
      directReports: [
        {
          id: 5,
          name: "Charlie Brown",
          position: "UI/UX Designer",
          directReports: [],
        },
        // ... other direct reports of Alice Williams
      ],
    },
    // ... other direct reports of John Doe
  ],
};

// Example Usage:
const flatEmployeeData = flattenEmployeeData(employeeData);
// console.log(flatEmployeeData);

// Polyfill of Promises
function PromisePolyfill(executor) {
  let onResolve, onReject, isFullfilled, isCalled, value;

  function resolve(val) {
    isFullfilled = true;
    value = val;
    if (typeof onResolve === "function") {
      onResolve(val);
      isCalled = true;
    }
  }

  function reject(err) {
    isFullfilled = false;
    value = err;
    if (typeof onReject === "function") {
      onReject(err);
      isCalled = true;
    }
  }

  this.then = function (cb) {
    onResolve = cb;

    if (isFullfilled && !isCalled) {
      onResolve(value);
      isCalled = true;
    }

    return this;
  };

  this.catch = function (cb) {
    onReject = cb;
    if (isFullfilled && !isCalled) {
      onReject(value);
      isCalled = true;
    }
    return this;
  };

  executor(resolve, reject);
}

const promiseObject = new PromisePolyfill((res, rej) => {
  res("hello");
});

promiseObject
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
