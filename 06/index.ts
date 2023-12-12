const f = (totalTime: number, waitTime: number) => waitTime * (totalTime - waitTime);

const totalTime = 40817772;
const distanceToBeat = 219101213651089;

let result = 0;
for (let waitTime = 0; waitTime <= totalTime; waitTime++) {
  const distance = f(totalTime, waitTime);
  if (distance > distanceToBeat) {
    result++;
  }
}

console.log(result);
