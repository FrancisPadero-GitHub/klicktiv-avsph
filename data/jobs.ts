interface JobCategory {
  label: string;
  items: string[];
}

export const CLEANING_CATEGORY_GROUPS: JobCategory[] = [
  {
    label: "Air System Cleaning",
    items: [
      "HVAC",
      "Air Duct",
      "Vent Cleaning",
      "Exhaust Vent",
      "Return Vent",
      "Intake Vent",
    ],
  },
  {
    label: "Appliance Vent Cleaning",
    items: ["Dryer Vent", "Kitchen Exhaust", "Range Hood", "Bathroom Vent"],
  },
  {
    label: "Fireplace and Chimney",
    items: ["Chimney", "Fireplace", "Flue Cleaning", "Smoke Chamber"],
  },
  {
    label: "Home Surface Cleaning",
    items: [
      "Carpet",
      "Upholstery",
      "Mattress",
      "Tile and Grout",
      "Hardwood Floor",
      "Vinyl Floor",
    ],
  },
  {
    label: "Exterior Cleaning",
    items: [
      "Window Cleaning",
      "Pressure Washing",
      "Gutter Cleaning",
      "Roof Cleaning",
      "Solar Panel Cleaning",
      "Siding Cleaning",
    ],
  },
  {
    label: "Water Systems",
    items: ["Drain Cleaning", "Sewer Line", "Grease Trap"],
  },
  {
    label: "Specialized Cleaning",
    items: ["Mold Remediation", "Odor Removal", "Sanitization", "Disinfection"],
  },
  {
    label: "General Cleaning",
    items: [
      "Deep Cleaning",
      "Move-In Cleaning",
      "Move-Out Cleaning",
      "Post-Construction Cleaning",
    ],
  },
  {
    label: "Commercial Cleaning",
    items: [
      "Office Cleaning",
      "Warehouse Cleaning",
      "Restaurant Cleaning",
      "Industrial Equipment Cleaning",
    ],
  },
] as const;
