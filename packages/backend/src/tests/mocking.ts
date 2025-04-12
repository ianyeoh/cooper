// Creates a global seed used for generating mock data for this test
// Mock data is generated using faker.js based on the Zod schema which
// is defined in our ts-rest contract

// Generates a random integer between min and max inclusive
function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Use seed from npm command line (or generate one if not found)
// npm --seed 123456 run test
let usingRandomSeed = process.env.npm_config_seed == null;

let seed: number = Number(process.env.npm_config_seed);

if (!Number.isSafeInteger(seed)) {
    usingRandomSeed = true;
}

if (usingRandomSeed) {
    seed = randInt(1, 100000);
    console.log(`Running tests with random seed [${seed}]`);
} else {
    console.log(`Running tests with set seed [${seed}]`);
}

export { seed };
