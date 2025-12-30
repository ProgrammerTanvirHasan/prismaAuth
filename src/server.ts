import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 5000;
async function main() {
  try {
    await prisma.$connect();
    console.log("connect successfully");
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error, "SOMETHING WENT WRONG");
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();

// app.listen app er moddhe thaka shob  কাজকে "অনলাইনে পাওয়া যাবে" এমন করে সার্ভার চালু করে পোর্টে বেঁধে দেয়।
// server.ts hocce amader main server.eikhane mainly database er shathe connection hocce and port a run hocce eitar shathe link kora hoice app er..jar moddhe use koreci postRouter ke..postRouter er shathe link thakce cotroler and service er..tarmane ami jokhon module er moddhe ekadhik router use korbo shob gula ke define korbo app.ts file a ..and finally app.ts file ta ke import kore listen korbo server.ts file a..r ami run korbo ei server.ts file ta k.


