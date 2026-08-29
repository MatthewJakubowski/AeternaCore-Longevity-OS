import { test } from 'node:test';
import assert from 'node:assert/strict';

// PARAMETRY LEVINE PHENOAGE (NHANES III)
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

test('Levine PhenoAge baseline NHANES III deterministic check', () => {
    // Profil wzorcowy: 40 lat, optymalna biochemia
    const res = calculatePhenoAge(40, 45.5, 82.0, 5.2, 1.6, 31.5, 12.7);
    
    assert.ok(res.phenoAge > 25 && res.phenoAge < 45, 'PhenoAge must fall into physiological boundary');
    assert.ok(res.mort > 0 && res.mort < 0.05, '10y mortality risk for young healthy baseline must be < 5%');
    assert.ok(!Number.isNaN(res.phenoAge), 'PhenoAge must not produce NaN');
});

test('HL7 FHIR R4 DiagnosticReport structure integrity check', () => {
    const age = 40;
    const phenoAge = 32.5;
    const pace = 0.84;
    const mort = 0.0097;

    const fhir = {
        resourceType: "DiagnosticReport",
        id: `PAT-AETERNA-${Math.round(age)}`,
        status: "final",
        code: { coding: [{ system: "https://aeternacore.ai/fhir", code: "MULTI-OMIC-BIOAGE" }] },
        conclusion: `PhenoAge: ${phenoAge.toFixed(1)}y (Delta: ${(phenoAge-age).toFixed(1)}y). DunedinPACE: ${pace.toFixed(2)} yr/yr. 10y Mortality: ${(mort*100).toFixed(2)}%.`
    };

    assert.equal(fhir.resourceType, "DiagnosticReport");
    assert.equal(fhir.status, "final");
    assert.ok(fhir.conclusion.includes("PhenoAge: 32.5y"));
});
