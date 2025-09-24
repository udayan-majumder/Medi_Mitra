import { create } from "zustand";

const DiseasesStore = create((set) => ({
  DiseasesList: [
    "Diabetes (Type 1 & Type 2)",
    "Hypertension (High Blood Pressure)",
    "Asthma",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Arthritis (Rheumatoid / Osteoarthritis)",
    "HIV/AIDS",
    "Chronic Kidney Disease",
    "Coronary Artery Disease / Heart Disease",
    "Parkinson’s Disease",
    "Alzheimer’s Disease (Dementia)",
  ],
  AllergiesList: [
    "Allergic Rhinitis (Hay Fever)",
    "Asthma (Allergic type)",
    "Atopic Dermatitis (Eczema)",
    "Urticaria (Hives)",
    "Drug Allergy",
    "Insect Sting Allergy",
    "Latex Allergy",
    "Food Allergy",
    "Sinus Allergy",
    "Allergic Conjunctivitis",
  ],
}));

export default DiseasesStore