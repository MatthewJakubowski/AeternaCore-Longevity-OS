---
title: AeternaCore OS - Longevity Intelligence Platform
emoji: 🧬
colorFrom: indigo
colorTo: blue
sdk: static
pinned: false
license: mit
---

<div align="center">

# 🧬 AeternaCore OS: Omniscient Longevity Engine
### *Clinical Biostatistics • Epigenetic Clocks • Explainable AI (SHAP Waterfall) • HL7 FHIR R4 • CPIC PGx*

[![Hugging Face Space](https://img.shields.io/badge/🤗%20Hugging%20Face-Live%20Demo-teal.svg)](https://huggingface.co/spaces/matthewjakubowski/aeternacore-longevity-os)
[![CI Verification](https://github.com/MatthewJakubowski/AeternaCore-Longevity-OS/actions/workflows/ci.yml/badge.svg)](https://github.com/MatthewJakubowski/AeternaCore-Longevity-OS/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Standards: HL7 FHIR R4](https://img.shields.io/badge/Standards-HL7%20FHIR%20R4%20%7C%20LOINC-firebrick.svg)](https://hl7.org/fhir/)
[![CPIC PGx Guidelines](https://img.shields.io/badge/Pharmacogenomics-CPIC%20%7C%20PharmGKB-emerald.svg)](https://cpicpgx.org/)
[![Runtime: 100% Client-Side](https://img.shields.io/badge/Architecture-Sovereign%20Client--Side-blue.svg)](#)

[**English Version**](#-english-version) &nbsp;•&nbsp; [**Wersja Polska**](#-wersja-polska)

</div>

---

## 🇬🇧 English Version

### 🔬 Vision & Overview
**AeternaCore OS** is an enterprise-grade clinical longevity intelligence platform designed to bridge the gap between routine laboratory diagnostics (**LIS**), multi-omic parametric biostatistics, and explainable artificial intelligence (XAI).

Unlike conventional diagnostic calculators that rely on static reference ranges, **AeternaCore OS** models biological age acceleration, systemic allostatic load degradation, and non-linear cross-system dynamics via coupled ODE systems.


```text
┌────────────────────────────────────────────────────────────────────────┐
│         HL7 FHIR R4 Bundle / LIS Pre-Analytical QC Layer               │
│     (Delta Check, Hemolysis/Lipemia Index, Range Guard)                │
└───────────────────────────────────┬────────────────────────────────────┘
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ Levine PhenoAge   │     │ DunedinPACE       │     │ Extended PGx      │
│ Canonical Gompertz│     │ 173 CpG Array     │     │ (CYP450 + SLCO    │
│ & XAI Waterfall   │     │ DNAm Rate Clock   │     │ + MTHFR Matrix)   │
└─────────┬─────────┘     └─────────┬─────────┘     └─────────┬─────────┘
          └─────────────────────────┼─────────────────────────┘
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│ Coupled Bio-ODE Engine & Organ Capacity Decomposition                 │
│ (d[hsCRP]/dt <-> d[Glu]/dt <-> Endothelial Stress)                    │
└───────────────────────────────────┬───────────────────────────────────┘
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│ Actionable Clinical Longevity Matrix & Monte Carlo                    │
│ (Evidence-Based Protocols + 30-Year Trajectory Sim)                   │
└───────────────────────────────────────────────────────────────────────┘
```

---

### ⚡ Core Mathematical & Biological Pillars

#### 1. 🌊 Explainable AI (SHAP-Style Waterfall Decomposition)
Provides complete mathematical transparency. Anchored on the patient's **Chronological Age**, the model isolates the marginal impact of each individual biomarker in biological years:

> **ΔYears_i = [ β_i · (X_i - X_ref,i) ] / 0.090165**

#### 2. 🧬 Canonical Dual-Clock Biostatistics
* **Levine PhenoAge (NHANES III Calibration)**: 120-month Gompertz hazard modeling calibrated on 9 systemic blood biomarkers:
  `Mortality Risk = 1 - exp( -exp(xb) · (exp(120 · γ) - 1) / γ )`
* **DunedinPACE (3rd Gen Epigenetic Clock)**: Instantaneous rate of biological aging measured across the 173 CpG methylation network.

#### 3. 🛡 Pharmacogenomics & Safety Matrix (CPIC / PharmGKB)
* **CYP450 Isoforms**: Detection of metabolic collisions (e.g., CYP3A4 / CYP2D6 inhibition with concurrent statin therapy).
* **SLCO1B1 (OATP1B1)**: Genotypic risk assessment for statin-induced myopathy.
* **MTHFR (C677T & A1298C)**: One-carbon cycle optimization (5-MTHF supplementation vs. synthetic folic acid contraindication).

#### 4. 🔒 Sovereign Client-Side Execution
* **Zero Backend Exposure**: 100% of mathematical modeling, simulation (N=500 Monte Carlo iterations), and visualization executes directly within the client's web browser RAM.
* **Zero Telemetry / Data Privacy**: No patient biomarkers or genomic inputs are transmitted across external servers.

---

### 📑 Diagnostic LOINC Mapping Standard

| LOINC Code | Biomarker Description | Unit Standard | Physiological Target |
| :--- | :--- | :--- | :--- |
| `1751-7` | Serum Albumin | g/L | ≥ 45.0 g/L |
| `2160-0` | Serum Creatinine | µmol/L | 65.0 - 85.0 µmol/L |
| `2345-7` | Fasting Plasma Glucose | mmol/L | 4.0 - 5.0 mmol/L |
| `30522-7` | High-Sensitivity CRP (hsCRP) | mg/L | < 0.8 mg/L |
| `26474-7` | Lymphocyte Percentage | % | 30.0 - 38.0% |
| `789-8` | Red Cell Distribution Width (RDW) | % | < 12.5% |
| `1884-6` | Apolipoprotein B (ApoB) | mg/dL | < 80 mg/dL |

---

## 🇵🇱 Wersja Polska

### 🔬 Wizja i Przeznaczenie Systemu
**AeternaCore OS** to zaawansowana platforma diagnostyki długowieczności i medycyny precyzyjnej. Została zaprojektowana z myślą o bezpośredniej integracji z laboratoryjnymi systemami informatycznymi (**LIS**), oferując przejście od tradycyjnych, statycznych zakresów referencyjnych do dynamicznego modelowania tempa starzenia i rezerw wielonarządowych.

Platforma umożliwia identyfikację utraty homeostazy na poziomie przedklinicznym, łącząc klasyczne wskaźniki hematologiczne i biochemiczne z epigenetyką i farmakogenomiką.

---

### ⚡ Kluczowe Moduły Kliniczne

#### 1. 🌊 Wyjaśnialna Dekompozycja Wieku Biologicznego (XAI Waterfall)
Eliminuje efekt „czarnej skrzynki”. System wizualizuje, jak poszczególne parametry laboratoryjne przesuwają wiek fenotypowy pacjenta:
* **Czynniki protekcyjne (zielone)**: np. wysoka albumina, optymalna dystrybucja limfocytów.
* **Czynniki ryzyka (czerwone)**: np. utajony stan zapalny (hsCRP), przyspieszona anizocytoza (RDW), zaburzenia glikemii.

#### 2. 🧬 Podwójny Zegar Wieloomiczny
* **Kanoniczny Levine PhenoAge**: Wyliczenie wieku biologicznego i 10-letniego ryzyka zgonu w oparciu o model przeżywalności Gompertza (kalibracja kohorty NHANES III).
* **Epigenetyczny DunedinPACE**: Pomiar chwilowego tempa starzenia biologicznego (wyrażany w latach starzenia na każdy rok metrykalny).

#### 3. 🛡 Firewall Farmakogenomiczny (Wytyczne CPIC)
* **Interakcje Lek-Nutraceutyk**: Blokowanie groźnych połączeń (np. kurkumina/berberyna a metabolizm statyn przez CYP3A4/CYP2D6).
* **Transporter Wątrobowy SLCO1B1**: Dobór bezpiecznych statyn hydrofilnych w przypadku polimorfizmu zaburzającego klirens wątrobowy.
* **Cykl Jednowęglowy MTHFR**: Identyfikacja wariantów C677T/A1298C i wdrożenie aktywnych form metylowanych (5-MTHF, metylokobalamina, TMG).

#### 4. 📄 Standard Szpitalny HL7 FHIR R4
* Natywne generowanie i eksport zasobu `DiagnosticReport` z pełnym mapowaniem kodów ontologii **LOINC**.

---

### 👨‍🔬 Autor / Author
**Mateusz Jakubowski**
* *Biolog Eksperymentalny & Starszy Technolog Laboratoryjny*
* *Experimental Biologist & Medical Laboratory Technologist*
* *#FromPipetteToPython | #BuildInPublic*


---

## ⚖️ Legal, Clinical & Regulatory Disclaimer / Zastrzeżenie Prawne

### 🇬🇧 English: Research & Educational Proof of Concept (PoC)
> **IMPORTANT NOTICE:** **AeternaCore OS** is an experimental, open-source computational **Proof of Concept (PoC)** developed strictly for educational, scientific research, and architectural demonstration purposes.
>
> 1. **Non-Medical Device Status:** This software is **NOT** a certified Medical Device under the European Union Medical Device Regulation (EU MDR 2017/745), US FDA regulations (21 CFR Part 820), or any other regulatory jurisdiction. It is not intended for use in the diagnosis, cure, mitigation, treatment, or prevention of any disease or physiological condition.
> 2. **No Medical Advice:** All calculations, biological age metrics (Levine PhenoAge, DunedinPACE), biomarker decompositions, and pharmacogenomic alerts are purely algorithmic simulations based on published literature and do not constitute clinical guidance, diagnostic advice, or medical prescriptions.
> 3. **Limitation of Liability:** The authors and contributors assume no legal liability, responsibility, or financial indemnification for any direct, indirect, incidental, or consequential damages arising from the use, interpretation, or reliance on any output provided by this software. Healthcare decisions must be made exclusively by licensed medical professionals based on verified diagnostic laboratory testing.

---

### 🇵🇱 Polski: Eksperymentalny Demonstrator Badawczy (PoC)
> **WAŻNA INFORMACJA PRAWNA:** **AeternaCore OS** jest eksperymentalnym modelem obliczeniowym typu **Proof of Concept (PoC)**, stworzonym wyłącznie do celów edukacyjnych, badawczo-naukowych oraz demonstracji architektury systemowej.
>
> 1. **Brak statusu wyrobu medycznego:** Oprogramowanie **NIE JEST** wyrobem medycznym w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) MDR 2017/745, przepisów Ustawy o wyrobach medycznych ani wytycznych FDA. System nie służy do diagnozowania, leczenia, monitorowania ani prewencji stanów chorobowych.
> 2. **Brak porady medycznej:** Wszystkie prezentowane wyniki (wiek fenotypowy Levine PhenoAge, tempo DunedinPACE, dekompozycja SHAP Waterfall, alerty PGx) stanowią symulacje algorytmiczne i nie zastępują indywidualnej konsultacji lekarskiej, diagnozy specjalistycznej ani profesjonalnych badań laboratoryjnych.
> 3. **Wyłączenie odpowiedzialności cywilnej:** Autor nie ponosi jakiejkolwiek odpowiedzialności prawnej, cywilnej ani odszkodowawczej za decyzje zdrowotne, terapeutyczne lub farmakologiczne podejmowane na podstawie danych generowanych przez aplikację. Wszelkie decyzje kliniczne wymagają weryfikacji przez uprawnionego lekarza.
