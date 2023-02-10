import './style.css';

// new version of rxjs import from 'rxjs'
import { of, map, Observable, from, interval, merge, reduce, fromEvent,debounceTime, mergeMap, bufferTime, throttleTime, Observer, scan, pairwise, switchMap, distinctUntilChanged, tap, take, filter, pipe } from 'rxjs';

// operators in pipe - old version of rxjs
//import { take, filter } from 'rxjs/operators'; 

// const multiBy = (n) => value => value * n;
// console.log([1, 2, 3].map(multiBy(6)))

// *** Create an observable that emits the numbers 1 to 5 every second and subscribe to it, logging each emitted value to the console.

// greater than
const gt = (target:number) => (num:number) => num > target;

// only return number than greater than 0 and until 5
const tick$: Observable<number> = interval(1000).pipe(
  // filter(d => d > 0),
  filter(gt(0)),
  take(5)
); 

// tick$.subscribe(console.log);
// tick$.subscribe({
//   next: value => console.log(value),
//   complete: () => console.warn("tick complete")
// })

// RxMarbles
/**
 * interval(1000):  -O-1-2-3-4-5-6-7-8-9-1O-11-12-13-14
 * take(5).      :  -0-1-2-3-4|
 * map(add(1)).  :  -1-2-3-4-5|
 */

/**
 * interval(1000):  -O-1-2-3-4-5-6-7-8-9-1O-11-12-13-14
 * filter(gt(0)) :  ---1-2-3-4-5-6-7-8-9-10-11-12-13-14
 * take(5).      :  ---1-2-3-4-5|
 */


// *** Create an observable that emits a string "Hello" every 2 seconds and subscribe to it, logging each emitted value to the console.

// use map to convert a value to a different type
// from this case convert a number to string every 2 second
// const greet$: Observable<string> = interval(2000).pipe(map(() => 'Hello'));

// RxMarbles
/**
 * interval(1000):  -O-1-2-3-4-5-6-7-8-9-1O-11-12-13-14
 * map(...).     :  -H-H-H-H-H
 */

// greet$.subscribe({ next: console.log })

/**
*  const sayHello = () => {
*    setInterval(()=>{console.log('Hello')}, 2000);
*    return 'hello';
*  }
*
*  const greet$: Observable<string> = sayHello;
*/


// *** Create an observable from an array of numbers and use the map operator to square each emitted value before logging it to the console.

// pass and array to observable object, <number> means
// emitt a number each time
const squareNum$: Observable<number> = from([1, 2, 3]).pipe(
  map(d => Math.pow(d,2))
);
// squareNum$.subscribe(console.log);


// *** Create an observable from an array of numbers and use the filter operator to only emit even numbers before logging them to the console.

const evenNum$: Observable<number> = from([1,2,3,4,5]).pipe(
  filter( d => d % 2 === 0)
);
// evenNum$.subscribe(console.log);


// *** Create two observables that emit numbers, use the merge operator to combine them into a single observable, and subscribe to it, logging each emitted value to the console.

const mergeTwo$ : Observable<number> = merge(squareNum$,evenNum$);
// mergeTwo$.subscribe(console.log)


// *** Create an observable that emits a string every second and use the take operator to only take the first three emissions before logging each value to the console.

const stringEverySecond$ : Observable<string> = interval(1000).pipe(
  map(()=>'string'), //use map for converting value's type
  take(3));
// stringEverySecond$.subscribe(console.log);


// *** Create an observable from an array of numbers and use the reduce operator to find the sum of all emitted values before logging the result to the console.

const sumNumbers$ : Observable<number> = from([7,8,9]).pipe(
  reduce((acc, num)=> acc + num, 0 )
);
// sumNumbers$.subscribe(console.log);


// *** Create an observable from a button click event and log the event object to the console every time the button is clicked.

const btnClick$ : Observable<Event> = fromEvent(
  document.getElementById('btn1'),'click');
// btnClick$.subscribe(console.log);


// *** Create an observable from a form input element and use the debounceTime operator to only emit values when the user stops typing for 500ms. Log each emitted value to the console.

const debounceInput$ = fromEvent(
  document.getElementById('input1'),
  'keydown'
).pipe(
  debounceTime(500) // send the last value in 500ms
);
// debounceInput$.subscribe(console.log);

// *** Create an observable from an HTTP GET request and subscribe to it, logging the response data to the console.

const httpGet$ = from(fetch('https://jsonplaceholder.typicode.com/todos/1')).pipe(
  // use mergeMap when there is multiple layers of observables
  mergeMap((v) => from(v.json())) 
);
// httpGet$.subscribe(console.log);


// *** Create an observable from an array of URLs and use the mergeMap operator to make a GET request for each URL and return the response data. Subscribe to the observable and log each response to the console.

const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/todos/2',
  'https://jsonplaceholder.typicode.com/todos/3'
];

// string array to Observable<string>
const url$ : Observable<string> = from(urls);

// wrap a function return json data
// when there's an Observable in Observable, use mergeMap
// to get the correct type that wanted
const startFetch = (url:string): Observable<any> => { 
  return from(fetch(url)).pipe(
    mergeMap((v) => from(v.json()))
  )  
}

const apiData$ = url$.pipe(
  mergeMap((url)=> startFetch(url))
);
//apiData$.subscribe(console.log);


// *** Create an observable from a sequence of mouse events (e.g. mousemove) and use the bufferTime operator to collect events emitted within a time window of 100ms. Log the collected events to the console every time a buffer is emitted.

const mouseDown$ : Observable<MouseEvent> = fromEvent<MouseEvent>(document,'mousedown');
const mouseMove$ : Observable<MouseEvent> = fromEvent<MouseEvent>(document,'mousemove');
const mouseUp$ : Observable<MouseEvent> = fromEvent<MouseEvent>(document,'mouseup');

const mouseEvents$ : Observable<MouseEvent[]> = merge(mouseDown$,mouseMove$, mouseUp$).pipe(
  bufferTime(1000),
  filter( d => d.length > 0 ) // avoid empty array
);
// mouseEvents$.subscribe(console.log);


// *** Create an observable from a sequence of scroll events and use the throttleTime operator to only log the most recent scroll event emitted within a time window of 500ms.

const scrollEvent$ = fromEvent(document,'scroll').pipe(
  throttleTime(500) // the first value in 500ms time period
);
// scrollEvent$.subscribe(console.log);


// *** Create an observable from a sequence of keydown events and use the scan operator to track the total number of characters typed by the user. Log the current count to the console every time a key is pressed.

const keydownCount$ = fromEvent(
  document.getElementById('input1'),'keydown').pipe(
    map((event)=> 1 ), // convert event to a number
    scan( (total, count)=> total + count) // similar to reduce to accumulating
  );
 // keydownCount$.subscribe(console.log);


// *** Create an observable from an array of numbers and use the scan operator to implement a simple counter. The counter should increment by 1 for each emitted value, and reset to 0 if the value is greater than 10. Log the current count to the console every time a value is emitted.

const arrayCounter$: Observable<number> = from([2,4,6,4,14,9,11,54,7,23]).pipe(
  scan((total,number)=>
    number < 10 ? total + 1 : 0, // pure function return directly
     0 // default value of 'total' (seed)
  )
);
// arrayCounter$.subscribe(console.log);


// *** Create an observable from a sequence of mouse events (e.g. mousedown, mouseup) and use the pairwise operator to log the time difference between each pair of events to the console.

const mouseEventPair$ = merge(mouseDown$).pipe(
  map(() => Date.now()), // return time when there's event passing pipe
  pairwise(), // return an array with length 2 => [ value1 , value2 ]
  map(([first, second]) => second - first ) // ES6 syntax
);
// mouseEventPair$.subscribe(console.log);


// *** Create an observable from a sequence of HTTP GET requests and use the switchMap operator to cancel in-flight requests whenever a new request is made. Log the response data to the console every time a response is received.

// mergeMap will merged all in the output Observable.
// switchMap emitting values only from the most recently projected Observable

const response$ = url$.pipe(
switchMap( url => from(fetch(url)))
);
// response$.subscribe(console.log);


// *** Create an observable from a sequence of search terms entered by the user and use the debounceTime and distinctUntilChanged operators to only make an HTTP GET request for unique search terms entered by the user after a pause of 500ms. Log the response data to the console every time a response is received.

const distinctSearch$ = fromEvent<KeyboardEvent>(
  document.getElementById('input1'),
  'keyup'
).pipe(
  debounceTime(500),
  map( e => (e.target as any)?.value), // return value of input target
  map( value => value.trim()), // trim space
  filter( value => value !== ""), // no empty value
  distinctUntilChanged(), // no same value with last one
  map( term => `https://jsonplaceholder.typicode.com/todos/1?k=${term}`), // make url
  tap((url)=> console.log('url: ', url)), 
  switchMap( url => from(fetch(url))),
);

// distinctSearch$.subscribe(console.log);

// * optimization *

// custom operator -
// use pipe to combine reusable operators, and wrap it in arrow function
// usually stores in independent .ts file and export for using
const distinctUntilInputChange = (dueTime:number = 500) => pipe(
  // define input is Event, and the 'target' below will be usable 
  debounceTime<Event>(dueTime), 
  map( e => (e.target as any)?.value), // convert event to input value
  map( value => value.trim()),
  filter( value => value !== ""),
  distinctUntilChanged()
);


const searchTerm$ : Observable<string> = fromEvent(  
  document.getElementById('input1'),
  'keyup').pipe(
  distinctUntilInputChange() // call custom operator
);

// sending request
const response2$ = searchTerm$.pipe(
  map( term => `https://jsonplaceholder.typicode.com/todos/1?k=${term}`),
  tap((url)=> console.log('url: ', url)),
  switchMap( url => from(fetch(url))),
);

 response2$.subscribe(console.log);

// input 2 not sending http
const printInput$ = fromEvent(document.getElementById('input2'),'keyup').pipe(
  distinctUntilInputChange(100)
);

// printInput$.subscribe(console.log);