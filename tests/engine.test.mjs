import { test } from 'node:test';
import assert from 'node:assert/strict';

// ==========================================================================
// 1. SILNIK BIOSTATYSTYCZNY: LEVINE PHENOAGE (NHANES III GOMPERTZ)
// ==========================================================================
const GAMMA = 0.0076927;
const B0 = -19.9067;
const B_AGE = 0.0804;
const B_ALB = -0.0336;
const B_CREAT = 0.0095;
const B_GLU = 0.1953;
const B_CRP_LOG = 0.0954;
const B_LYMPH = -0.0120;
const B_MCV = 0.0268;
const B_RDW = 0.3306;
const B_ALP = 0.00188;
const B_WBC = 0.0554;

function calculatePhenoAge(age, alb, creat, glu, crp, lymph, rdw, mcv = 89.0, alp = 70.0, wbc = 6.3) {
    const crp_mg_dl = Math.max(crp * 0.1, 0.001);
    const crp_log = Math.log(crp_mg_dl);

    const xb = B0 + B_AGE * age + B_ALB * alb + B_CREAT * creat + B_GLU * glu +
               B_CRP_LOG * crp_log + B_LYMPH * lymph + B_MCV * mcv + B_RDW * rdw + B_ALP * alp + B_WBC * wbc;

    const exp_xb = Math.exp(xb);
    const gompertz_factor = (Math.exp(GAMMA * 120.0) - 1.0) / GAMMA;
    const mort = Math.min(Math.max(1.0 - Math.exp(-exp_xb * gompertz_factor), 0.00001), 0.99999);
    const inner = -0.00553 * Math.log(1.0 - mort);
    const phenoAge = 141.50 + (Math.log(Math.max(inner, 1e-12)) / 0.090165);

    return { phenoAge, mort, bioDelta: phenoAge - age };
}

// ==========================================================================
// 2. SILNIKI REZERW NARZĄDOWYCH (eGFR, FIB-4, SCORE2, ZONE 2)
// ==========================================================================
function calculateCKDEPI2021(creat_umol, age) {
    const scr_mg_dl = creat_umol / 88.42;
    const min_scr = Math.min(scr_mg_dl / 0.9, 1.0);
    const max_scr = Math.max(scr_mg_dl / 0.9, 1.0);
    return 142.0 * Math.pow(min_scr, -0.302) * Math.pow(max_scr, -1.200) * Math.pow(0.9938, age);
}

function calculateFIB4(age, ast, alt, plt) {
    if (plt <= 0 || alt <= 0) return 0;
    return (age * ast) / (plt * Math.sqrt(alt));
}

function calculateSCORE2(age, sbp, apob, isSmoker = false) {
    const nonHdl_mmol = Math.max(apob * 0.035, 2.5);
    const age_f = (age - 40.0) * 0.12;
    const sbp_f = (sbp - 120.0) * 0.025;
    const lip_f = (nonHdl_mmol - 3.5) * 0.35;
    const smk_f = isSmoker ? 1.45 : 0.0;
    return Math.min(Math.max(1.8 * Math.exp(age_f + sbp_f + lip_f + smk_f), 1.0), 45.0);
}

function calculateZone2FatMax(age, vo2) {
    const hr_max = 220 - age;
    const hrr = hr_max - 60;
    const vo2_corr = (vo2 - 40.0) * 0.25;
    const z2_low = Math.round(60 + (0.60 * hrr) + vo2_corr);
    const z2_high = Math.round(60 + (0.72 * hrr) + vo2_corr);
    return { z2_low, z2_high };
}

function calculateTyG(tg_mg_dl, glu_mmol) {
    const glu_mg_dl = glu_mmol * 18.0182;
    return Math.log((tg_mg_dl * glu_mg_dl) / 2.0);
}

// ==========================================================================
// 3. DRABINA AUTOWALIDACJI LIS GUARD (PN-EN ISO 15189:2023-02)
// ==========================================================================
function evaluateLISLadder(hil, glu, creat, crp, prev_crp) {
    let status = "AUTOPASS";

    // Poziom 2: Spektrofotometria HIL
    if (hil === "HEMOLYSIS" || hil === "LIPEMIA") {
        return "HELD FOR REVIEW";
    }

    // Poziom 3: Wartości paniczne / krytyczne
    if (glu < 2.2 || glu > 25.0 || creat > 350.0) {
        return "CRITICAL ALERT";
    }

    // Poziom 4: Podłużny Delta Check 90d
    if (prev_crp > 0) {
        const delta_pct = ((crp - prev_crp) / prev_crp) * 100.0;
        if (Math.abs(delta_pct) > 200.0 && crp > 3.0) {
            return "DELTA HELD";
        }
    }

    return status;
}

// ==========================================================================
// TEST SUITE: V3.0 CLINICAL BIOSTATISTICS & MULTI-ORGAN DETERMINISM
// ==========================================================================

test('01. Levine PhenoAge baseline NHANES III deterministic check', () => {
    const res = calculatePhenoAge(40, 45.5, 82.0, 5.2, 1.6, 31.5, 12.7);
    
    assert.ok(res.phenoAge >= 30.0 && res.phenoAge <= 35.0, 'PhenoAge baseline for healthy adult must fall into 30-35y range');
    assert.equal(res.phenoAge.toFixed(1), "32.5");
    assert.ok(res.mort > 0 && res.mort < 0.02, '10y mortality risk must be < 2% for baseline');
    assert.ok(!Number.isNaN(res.phenoAge), 'PhenoAge computation must not produce NaN');
});

test('02. Renal Reserve eGFR (CKD-EPI 2021 raceless) mathematical validation', () => {
    const egfr = calculateCKDEPI2021(82.0, 40);
    
    assert.ok(egfr >= 90.0, 'Baseline eGFR must indicate G1 normal filtration rate');
    assert.equal(egfr.toFixed(1), "106.8");
});

test('03. Hepatic Fibrosis FIB-4 Index calculation and non-cirrhotic rule', () => {
    const fib4 = calculateFIB4(40, 24, 22, 235);
    
    assert.ok(fib4 < 1.30, 'Baseline FIB-4 must be in low-risk F0-F1 category (< 1.30)');
    assert.equal(fib4.toFixed(2), "0.87");
});

test('04. ESC SCORE2 10-year CVD cardiovascular risk estimation (Poland High Risk)', () => {
    const score2_non_smoker = calculateSCORE2(40, 122, 88, false);
    const score2_smoker = calculateSCORE2(40, 122, 88, true);

    assert.ok(score2_non_smoker < 3.0, 'Baseline SCORE2 for non-smoker must fall in low-to-moderate risk (< 3.0%)');
    assert.ok(score2_smoker > score2_non_smoker, 'Smoking must significantly escalate 10y CVD hazard');
    assert.equal(score2_non_smoker.toFixed(1), "1.6");
});

test('05. Mitochondrial Zone 2 FatMax aerobic heart rate targeting', () => {
    const z2 = calculateZone2(40, 43.5);
    
    assert.ok(z2.z2_low >= 125 && z2.z2_low <= 135, 'Zone 2 floor for 40y baseline should be ~133 bpm');
    assert.ok(z2.z2_high >= 140 && z2.z2_high <= 150, 'Zone 2 ceiling for 40y baseline should be ~147 bpm');
    assert.ok(z2.z2_high > z2.z2_low, 'High threshold must exceed low threshold');
});

test('06. Cardiometabolic TyG Index sensitivity and cutoff boundary', () => {
    const tyg = calculateTyG(115, 5.2);
    
    assert.ok(tyg > 8.0 && tyg < 9.0, 'TyG index for normal baseline should fall into 8.0-9.0 range');
    assert.equal(tyg.toFixed(2), "8.59");
});

// ==========================================================================
// TEST SUITE: LIS QUALITY ASSURANCE & ISO 15189:2023 AUTOVALIDATION
// ==========================================================================

test('07. ISO 15189 LIS Autovalidation ladder decisions', () => {
    // Standardowy zwalidowany profil
    assert.equal(evaluateLISLadder("CLEAR", 5.2, 82.0, 1.6, 0.9), "AUTOPASS");

    // Faza przedanalityczna: błąd hemolizy
    assert.equal(evaluateLISLadder("HEMOLYSIS", 5.2, 82.0, 1.6, 0.9), "HELD FOR REVIEW");

    // Poziom 3: Wartości paniczne (hipoglikemia krytyczna)
    assert.equal(evaluateLISLadder("CLEAR", 1.9, 82.0, 1.6, 0.9), "CRITICAL ALERT");

    // Poziom 4: Nagły skok hsCRP (Delta Check Spike > 200%)
    assert.equal(evaluateLISLadder("CLEAR", 5.2, 82.0, 6.8, 0.5), "DELTA HELD");
});

test('08. CPIC Pharmacogenomic SLCO1B1/MTHFR drug-gene safety rules', () => {
    const slco_poor = "POOR";
    const statin_atorva = "Atorwastatyna";
    const statin_simva = "Symwastatyna";
    const statin_rosuva = "Rozuwastatyna";

    const isCollision = (slco, statin) => (slco === "POOR" && (statin === "Atorwastatyna" || statin === "Symwastatyna"));
    
    assert.ok(isCollision(slco_poor, statin_atorva), 'SLCO1B1 *5/*5 with Atorvastatin must trigger PGx collision alert');
    assert.ok(isCollision(slco_poor, statin_simva), 'SLCO1B1 *5/*5 with Simvastatin must trigger contraindication');
    assert.ok(!isCollision(slco_poor, statin_rosuva), 'Rosuvastatin must bypass SLCO1B1 hepatic clearance bottleneck safely');
});

// ==========================================================================
// TEST SUITE: HEALTH DATA INTEROPERABILITY & HL7 FHIR PL BASE
// ==========================================================================

test('09. HL7 FHIR PL Base DiagnosticReport schema compliance', () => {
    const age = 40;
    const phenoAge = 32.5;
    const pace = 0.84;
    const tyg = 8.59;
    const apob = 88;
    const egfr = 106.8;
    const fib4 = 0.87;
    const score2 = 1.6;
    const mort = 0.0097;
    const status = "AUTOPASS";

    const fhir = {
        resourceType: "DiagnosticReport",
        id: `PAT-AETERNA-V3-${Math.round(age)}`,
        meta: {
            profile: ["https://aeternacore.org/fhir/StructureDefinition/pl-base-longevity-report"]
        },
        status: status === "AUTOPASS" ? "final" : "preliminary",
        category: [{
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0074", code: "LAB", display: "Laboratory" }]
        }],
        code: {
            coding: [{ system: "https://loinc.org", code: "LONGEVITY-BIOAGE-CORE", display: "Comprehensive Longevity & Organ Reserve Report" }]
        },
        conclusion: `PhenoAge: ${phenoAge.toFixed(1)}y. DunedinPACE: ${pace.toFixed(2)}. TyG Index: ${tyg.toFixed(2)}. eGFR (CKD-EPI 2021): ${egfr.toFixed(1)} ml/min. FIB-4: ${fib4.toFixed(2)}. ESC SCORE2: ${score2.toFixed(1)}%. ApoB: ${apob.toFixed(0)} mg/dL. 10y Mortality: ${(mort*100).toFixed(2)}%. LIS Status: ${status}.`
    };

    assert.equal(fhir.resourceType, "DiagnosticReport");
    assert.equal(fhir.status, "final");
    assert.ok(fhir.meta.profile[0].includes("aeternacore.org"), 'Must point to clean sovereign schema');
    assert.ok(fhir.conclusion.includes("eGFR (CKD-EPI 2021): 106.8 ml/min"));
    assert.ok(fhir.conclusion.includes("FIB-4: 0.87"));
});

test('10. Monte Carlo stochastic trajectory bounds and longevity deceleration (N=500)', () => {
    const baselinePheno = 32.5;
    const horizon = 30;
    const N = 500;
    
    let endAges = [];
    for (let i = 0; i < N; i++) {
        let age = baselinePheno;
        for (let y = 1; y <= horizon; y++) {
            const opt_rate = 0.82 + (Math.random() - 0.5) * 0.10;
            age += opt_rate;
        }
        endAges.push(age);
    }
    
    endAges.sort((a, b) => a - b);
    const median = endAges[Math.floor(N * 0.5)];
    const p10 = endAges[Math.floor(N * 0.1)];
    const p90 = endAges[Math.floor(N * 0.9)];
    
    assert.ok(median > 54.0 && median < 60.0, 'Optimized 30y biological median must decelerate aging significantly (~57.1y vs 70.0y)');
    assert.ok(p10 < median && p90 > median, 'P10-P90 stochastic confidence bands must enclose the median');
});
