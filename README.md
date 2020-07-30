# async-ts-lambda-example

Simple AWS Lambda function explaining async/await

## Running this yourself:

```sh
#Takes source typescript from ./src-ts/*.ts and compiles to ./built/*.js
npm run compile
sam build
sam local invoke -e events/event-cloudwatch-event.json handler --skip-pull-image
```

## Code example

```ts
import { Context } from 'aws-lambda';

function sleep(ms: number, msg: string) {
  console.info(msg);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.handler = async (event: any, context: Context) => {
  console.info('Next block will take ~2 sec, a,b,c will run in parralel.');
  const a = sleep(2000, '1st');
  const b = sleep(2000, '2nd');
  const c = sleep(2000, '3rd');
  console.info(
    'Sleep 2000 (ms), called 3 times without await, awaiting now...'
  );
  await a, b, c;

  console.info('Next block will take ~6 sec, x,y,z will run line by line.');
  const x = await sleep(2000, '4th');
  const y = await sleep(2000, '5th');
  const z = await sleep(2000, '6th');
  console.info('Completed!.');
};
```

## Output

Note how the first block (without the per line `await`), executes roughly in parralel at `07:52:01.96`. The second block, which awaits (thus pauzes) for every line, takes two seconds per line.

The first example is useful when you need to perform multiple actions in parralel, for example gathering data from DynamoDB and s3.

```log
START RequestId: 829cae73-7e31-1f18-5086-cc7dd1bb586a Version: $LATEST
2020-07-27T07:52:01.957Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    Next block will take ~2 sec, a,b,c will run in parralel.
2020-07-27T07:52:01.960Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    1st
2020-07-27T07:52:01.961Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    2nd
2020-07-27T07:52:01.961Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    3rd
2020-07-27T07:52:01.961Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    Sleep 2000 (ms), called 3 times without await, awaiting now...
2020-07-27T07:52:03.967Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    Next block will take ~6 sec, x,y,z will run line by line.
2020-07-27T07:52:03.967Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    4th
2020-07-27T07:52:05.971Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    5th
2020-07-27T07:52:07.977Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    6th
2020-07-27T07:52:09.984Z        829cae73-7e31-1f18-5086-cc7dd1bb586a    INFO    Completed!.
END RequestId: 829cae73-7e31-1f18-5086-cc7dd1bb586a
REPORT RequestId: 829cae73-7e31-1f18-5086-cc7dd1bb586a  Init Duration: 120.96 ms        Duration: 8035.30 ms    Billed Duration: 8100 ms        Memory Size: 512 MB     Max Memory Used: 40 MB
```
