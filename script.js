'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Mohammed Elsaadany',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 8624,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const from = document.querySelector('.form');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////////////////////////////////
// PROJECT WORK

// COMPUTING USERNAMES
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user.charAt(0))
      .join('');
  });
};
createUserName(accounts);

// DISPLAYING THE MOVEMENTS
const displayMovement = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// SETTING THE CURRENT BALANCE
const setCurrentBalance = function (acc) {
  acc.currentBalance = acc.movements.reduce(
    (accumulate, cur) => accumulate + cur,
    0,
  );
  labelBalance.textContent = `${acc.currentBalance.toFixed(2)}€`;
};

// SETTING THE STATISTICS

const calcDisplaySummary = function (acc) {
  // 1) DEPOSIT
  const sumDeposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, depo) => acc + depo, 0);
  labelSumIn.textContent = `${sumDeposit.toFixed(2)}€`;

  // 2) WITHDRAW
  const sumWithdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, depo) => acc + depo, 0);
  labelSumOut.textContent = `${Math.abs(sumWithdraw).toFixed(2)}€`;

  // 3) INTEREST
  const calcInsterest = acc.movements
    .filter(mov => mov > 0)
    .map(depo => (depo * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((int, cur) => int + cur, 0);
  labelSumInterest.textContent = `${calcInsterest.toFixed(2)}€`;
};

// EVENT HANDLERS

// A function to clear inputs:
const clearInputs = function (firstInput, secondInput) {
  firstInput.value = secondInput.value = '';
  firstInput.blur();
  secondInput.blur();
};

// A function to update current account's information:
const updateUI = function (acc) {
  // Display movement.
  displayMovement(acc);
  // Display balance.
  setCurrentBalance(acc);
  // Display statistics summary.
  calcDisplaySummary(acc);
};

let currentAccount;

// 1) LOGIN
btnLogin.addEventListener('click', function (e) {
  // NOTE: preventDefault() is used to prevent the form from submitting each time we click its button.
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = '1';

    // Display welocme message.
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;

    updateUI(currentAccount);

    // Clear inputs
    clearInputs(inputLoginUsername, inputLoginPin);
  } else {
    // containerApp.style.opacity = '0';
  }
});

// 2) TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // Inputs:
  let receiverUser = inputTransferTo.value;
  let amount = Number(inputTransferAmount.value);

  const receiverAcc = accounts.find(acc => acc.username === receiverUser);

  // Constraints:
  if (
    receiverAcc?.username === receiverUser &&
    amount > 0 &&
    currentAccount.currentBalance >= amount &&
    currentAccount.username !== receiverAcc.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }

  clearInputs(inputTransferTo, inputTransferAmount);
});

// 3) REQUEST A LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  let loanCondition = currentAccount.movements.some(mov => mov >= amount * 0.1);

  if (amount > 0 && loanCondition) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// 4) DELETE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  clearInputs(inputCloseUsername, inputClosePin);
});

// SORT BUTTON
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovement(currentAccount, !sorted);
  sorted = !sorted;
});
//-----------
// CHALLENGES
// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
// const calcAverageHumanAge = arr => {
//   const data = arr.slice();
//   const dogAgeInHumanYears = data
//     .map(dogAge => {
//       if (dogAge <= 2) return dogAge * 2;
//       else if (dogAge > 2) return 16 + dogAge * 4;
//     })
//     .filter(dogAge => dogAge >= 18)
//     .reduce((acc, age, _, arr) => acc + age / arr.length, 0);

//   return dogAgeInHumanYears;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// let jD = {};

// accounts.forEach(function (acc) {
//   if (acc.owner === 'Jessica Davis') jD = acc;
// });
// console.log(jD);

// console.log(movements);

// const latestLargeAmount = movements.findLastIndex(mov => mov > 1000);
// console.log(latestLargeAmount);
// console.log(
//   `Your latest large movement was ${movements.length - latestLargeAmount} movements ago.`,
// );

// console.log(accounts);

// const allMovements = accounts.map(acc => acc.movements).flat();
// console.log(allMovements);

// const sumAllMovements = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(sumAllMovements);

// const arr = [[[1, 2], 3], 4];
// console.log(arr.flat().flat());

/*
YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 28,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 32,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];

// const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;

// const dogBothActivities = breeds.find(
//   breed =>
//     breed.activities.includes('fetch') && breed.activities.includes('running'),
// ).breed;

// const allActivities = breeds.flatMap(breed => breed.activities);

// const uniqueActivities = [...new Set(allActivities)];

// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(breed => breed.activities.includes('swimming'))
//       .flatMap(breed => breed.activities)
//       .filter(activity => activity !== 'swimming'),
//   ),
// ];
// console.log(swimmingAdjacent);

// console.log(breeds.every(breed => breed.averageWeight >= 10));

// console.log(breeds.some(breed => breed.activities.length >= 3));

// const heaviestFetchBreed = Math.max(
//   ...breeds
//     .filter(breed => breed.activities.includes('fetch'))
//     .map(breed => breed.averageWeight),
// );
// console.log(heaviestFetchBreed);

// console.log(movements);

// const groupedMovements = Object.groupBy(movements, mov =>
//   mov > 0 ? 'Deposit' : 'Withdrawal',
// );

// const groupByActivity = Object.groupBy(accounts, acc => {
//   const movementCount = acc.movements.length;
//   if (movementCount >= 8) return 'very active';
//   if (movementCount >= 5) return 'moderate';
//   if (movementCount >= 2) return 'not active';
// });

// const z = Array.from({ length: 5 }, (cur, i) => i + 1);
// console.log(z);

// const arrRandomDiceRolls = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 6) + 1,
// );

// console.log(arrRandomDiceRolls);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', '')),
//   );
//   console.log(movementsUI);
// });

// 1.
// const totalBankDeposits = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((cur, i) => cur + i, 0);
// console.log(totalBankDeposits);

// // 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(dep => dep >= 1000).length;
// console.log(numDeposits1000);

// // 3.
// const { deposit, withdrawal } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposit += cur) : (sums.withdrawal += cur);
//       sums[cur > 0 ? 'deposit' : 'withdrawal'] += cur;
//       return sums;
//     },
//     { deposit: 0, withdrawal: 0 },
//   );
// console.log(deposit, withdrawal);

// // 4.
// const capitalizePhrase = function (str) {
//   const capitalize = str
//     .split(' ')
//     .map(
//       word =>
//         (word[0] === 'a' ? word[0] : word.charAt(0).toUpperCase()) +
//         word.slice(1).toLowerCase(),
//     )
//     .join(' ');
//   console.log(capitalize);
// };

// capitalizePhrase('this is a LONG journey');

///////////////////////////////////////////

// CHALLENGE 5
// Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

// - Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// - Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// - Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

// YOUR TASKS:
// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs whose dogs eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
// 6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
// 9. Group the dogs by the number of owners they have
// 10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// // TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
//   { weight: 18, curFood: 244, owners: ['Joe'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1.
// dogs.forEach(function (dog) {
//   dog.recFood = Math.round(dog.weight ** 0.75 * 28);
// });

// // 2.
// const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah's dog is eating ${sarahsDog.curFood > sarahsDog.recFood ? 'too much' : 'too little'}.`,
// );

// // 3.
// const ownersTooMuch = dogs
//   .filter(dog => {
//     if (dog.curFood > dog.recFood) return dog;
//   })
//   .flatMap(dog => dog.owners);
// console.log(ownersTooMuch);

// const ownersTooLittle = dogs
//   .filter(dog => {
//     if (dog.curFood < dog.recFood) return dog;
//   })
//   .flatMap(dog => dog.owners);
// console.log(ownersTooLittle);

// // 4.
// console.log(`${ownersTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersTooLittle.join(' and ')}'s dogs eat too little!`);

// // 5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 6.
// console.log(dogs.every(dog => dog.curFood >= dog.recFood));

// // 7.
// const fineDogs = dogs.filter(dog => dog.curFood >     = dog.recFood);
// console.log(fineDogs);

// // 8.
// const dogType = Object.groupBy(dogs, dog => {
//   if (dog.curFood > dog.recFood) return (dog.type = 'tooMuch');
//   if (dog.curFood === dog.recFood) return (dog.type = 'exact');
//   if (dog.curFood < dog.recFood) return (dog.type = 'tooLittle');
// });
// console.log(dogType);

// // 9.
// const ownerNum = Object.groupBy(dogs, dog => {
//   if (dog.owners.length === 3) return (dog.numOfOwners = 'ThreeOwners');
//   if (dog.owners.length === 2) return (dog.numOfOwners = 'TwoOwners');
//   if (dog.owners.length === 1) return (dog.numOfOwners = 'OneOwner');
// });
// console.log(ownerNum);

// const sortedDogsArr = dogs.toSorted((a, b) => a.recFood - b.recFood);
// console.log(sortedDogsArr);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// console.log(randomInt(10, 100));

console.log(new Date());
