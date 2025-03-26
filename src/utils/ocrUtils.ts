
import { toast } from "@/hooks/use-toast";

// Simulated database of known medicines
const knownMedicines = [
  { name: "Paracetamol", ingredients: ["Acetaminophen"], commonDosages: ["500mg", "650mg"] },
  { name: "Amoxicillin", ingredients: ["Amoxicillin Trihydrate"], commonDosages: ["250mg", "500mg"] },
  { name: "Ibuprofen", ingredients: ["Ibuprofen"], commonDosages: ["200mg", "400mg"] },
  { name: "Cetirizine", ingredients: ["Cetirizine Hydrochloride"], commonDosages: ["10mg"] },
  { name: "Aspirin", ingredients: ["Acetylsalicylic Acid"], commonDosages: ["75mg", "300mg"] },
  { name: "Metformin", ingredients: ["Metformin Hydrochloride"], commonDosages: ["500mg", "850mg"] },
];

interface ExtractedMedicineData {
  medicineName: string;
  expiryDate: string;
  activeIngredients: string[];
}

/**
 * Extracts medicine information from an image using OCR
 */
export const extractMedicineInfo = async (
  imageData: string
): Promise<ExtractedMedicineData | null> => {
  try {
    // In a real implementation, this would call an OCR API like Google Vision, Tesseract.js, or a custom ML model
    // For demonstration, we'll simulate OCR by returning a random medicine from our database
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
    
    // Simulate OCR extraction with a random medicine from our database
    const randomIndex = Math.floor(Math.random() * knownMedicines.length);
    const medicine = knownMedicines[randomIndex];
    
    // Generate a random expiry date between 6 months and 2 years from now
    const today = new Date();
    const monthsToAdd = Math.floor(Math.random() * 18) + 6;
    const expiryDate = new Date(today);
    expiryDate.setMonth(today.getMonth() + monthsToAdd);
    
    return {
      medicineName: medicine.name,
      expiryDate: expiryDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      activeIngredients: medicine.ingredients,
    };
  } catch (error) {
    console.error("OCR processing error:", error);
    toast({
      title: "OCR Processing Failed",
      description: "Could not extract information from the image. Please enter details manually.",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Validates extracted medicine data against database
 */
export const validateMedicineData = (
  data: ExtractedMedicineData
): { isValid: boolean; suggestions?: Partial<ExtractedMedicineData> } => {
  // Find match in our medicine database
  const matchedMedicine = knownMedicines.find(
    med => med.name.toLowerCase() === data.medicineName.toLowerCase()
  );
  
  if (matchedMedicine) {
    // Validate expiry date
    const expiryDate = new Date(data.expiryDate);
    const today = new Date();
    
    if (expiryDate < today) {
      return {
        isValid: false,
        suggestions: {
          expiryDate: "The medicine appears to be expired. Please verify the date."
        }
      };
    }
    
    // Validate ingredients
    const hasAllIngredients = matchedMedicine.ingredients.every(
      ingredient => data.activeIngredients.some(
        extractedIng => extractedIng.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
    
    if (!hasAllIngredients) {
      return {
        isValid: false,
        suggestions: {
          activeIngredients: matchedMedicine.ingredients,
          medicineName: matchedMedicine.name // Correct the medicine name if needed
        }
      };
    }
    
    return { isValid: true };
  }
  
  // No exact match found, return generic validation
  return { isValid: true };
};
