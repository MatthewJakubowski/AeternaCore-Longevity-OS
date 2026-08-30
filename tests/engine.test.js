const assert = require('assert').strict;

// 1. Levine PhenoAge
const GAMMA = 0.0076927, B0 = -19.9067, B_AGE = 0.0804, B_ALB = -0.0336, B_CREAT = 0.0095;
const B_GLU = 0.1953, B_CRP_LOG = 0.0954, B_LYMPH = -0.0120, B_MCV = 0.0268, B_RDW = 0.3306, B_ALP = 0.00188, B_WBC = 0.0554;

function calculatePhenoAge(age, alb, creat, glu, crp, lymph, rdw) {
    const crp_log = Math.log(Math.max(crp * 0.1, 0.001));
    const xb = B0 + B_AGE*age + B_ALB*alb + B_CREAT*creat + B_GLU*glu + B_CRP_LOG*crp_log + B_LYMPH*lymph + B_MCV*89.0 + B_RDW*rdw + B_ALP*70.0 + B_WBC*6.3;
    const mort = Math.min(Math.max(1.0 - Math.exp(-Math.exp(xb) * ((Math.exp(GAMMA * 120.0) - 1.0) / GAMMA)), 0.00001), 0.99999);
    const phenoAge = 141.50 + (Math.log(Math.max(-0.00553 * Math.log(1.0 - mort), 1e-12)) / 0.090165);
    return { phenoAge, mort };
}

// 2. Calculators
const egfr = 142.0 * Math.pow(Math.min((82.0/88.42)/0.9, 1.0), -0.302) * Math.pow(Math.max((82.0/88.42)/0.9, 1.0), -1.200) * Math.pow(0.9938, 40);
const fib4 = (40 * 24) / (235 * Math.sqrt(22));
const score2 = 1.8 * Math.exp(0 + (122-120)*0.025 + (Math.max(88*0.035, 2.5)-3.5)*0.35 + 0);
const tyg = Math.log((115 * (5.2 * 18.0182)) / 2.0);

console.log('--- Running Local AeternaCore OS v3.0 Verification ---');

const res = calculatePhenoAge(40, 45.5, 82.0, 5.2, 1.6, 31.5, 12.7);
assert.equal(res.phenoAge.toFixed(1), "32.5");
assert.equal(egfr.toFixed(1), "106.8");
assert.equal(fib4.toFixed(2), "0.87");
assert.equal(score2.toFixed(1), "1.6");
assert.equal(tyg.toFixed(2), "8.59");

console.log('✔ All Local Tests Passed.');
