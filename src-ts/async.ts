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
