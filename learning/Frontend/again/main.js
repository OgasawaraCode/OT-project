const scores = [65, 80, 92, 45, 73, 88, 100];

function countPass(scores) {
  let count = 0;

  for(let i = 0; i < scores.length; i++) {
    if (scores[i] >= 80) {
      count++;
    }
  }
  return count;
}

console.log(countPass(scores));


// API
async function getUserByCompany() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  const users = await response.json();

  for (let i = 0; i < users.length; i++) {
    if (users[i].company.name === "Romaguera-Crona") {
      return users[i].name;
    }
  }
}

async function main() {
  const userName = await getUserByCompany();

  console.log(userName);
}

main();