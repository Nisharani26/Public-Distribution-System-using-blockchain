const bcrypt = require("bcryptjs");

async function b() {
  const passwords = ["admin123", "shop123"]; // add any passwords you want to hash
  for (const pwd of passwords) {
    const hashed = await bcrypt.hash(pwd, 10); // 10 is the salt rounds
    console.log(`Plain: ${pwd} --> Hashed: ${hashed}`);
  }
}

b();
