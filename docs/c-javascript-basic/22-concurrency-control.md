---
sidebar_position: 22
---

# 并发控制

## 概述

```js
/**
 * @description 并发控制:实现思路为顶第一个请求池+递归实现
 * @param {*} tasks promise数组
 * @param {*} pool 并发数
 */
function conCurrencyRequest(tasks, pool = 5) {
  let index = 0;
  const results = [];
  let conCurrency = new Array(pool).fill(null);
  conCurrency = conCurrency.map(() => {
    return new Promise((resolve, reject) => {
      const run = () => {
        //递归出口
        if (index >= tasks.length) {
          resolve();
          return;
        }
        const preIndex = index;
        const task = tasks[index++];
        task.then((result) => {
          results[preIndex] = result;
          run();
        });
      };
      run();
    });
  });
  return Promise.all(conCurrency).then(() => {
    return results;
  });
}

function sleep(duration = 5) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(duration);
    }, duration);
  });
}

const together = [sleep(6), sleep(4), sleep(5), sleep(3), sleep(2), sleep(1)];

conCurrencyRequest(together).then((res) => {
  console.log(res);
});
```