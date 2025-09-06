// Eco-impact calculation service for items
class EcoImpactCalculationService {
  constructor() {
    // Base impact factors per category (per kg of item)
    this.impactFactors = {
      electronics: {
        co2Saved: 0.5, // kg CO2 per kg of electronics reused
        waterSaved: 0.1, // liters per kg
        wasteReduced: 0.8, // kg waste reduced per kg
        energySaved: 0.3, // kWh per kg
        treesEquivalent: 0.02 // trees equivalent per kg
      },
      clothing: {
        co2Saved: 0.3,
        waterSaved: 0.2,
        wasteReduced: 0.9,
        energySaved: 0.1,
        treesEquivalent: 0.015
      },
      furniture: {
        co2Saved: 0.4,
        waterSaved: 0.05,
        wasteReduced: 0.7,
        energySaved: 0.2,
        treesEquivalent: 0.02
      },
      books: {
        co2Saved: 0.2,
        waterSaved: 0.15,
        wasteReduced: 0.6,
        energySaved: 0.05,
        treesEquivalent: 0.01
      },
      sports: {
        co2Saved: 0.25,
        waterSaved: 0.1,
        wasteReduced: 0.8,
        energySaved: 0.15,
        treesEquivalent: 0.012
      },
      home_garden: {
        co2Saved: 0.35,
        waterSaved: 0.08,
        wasteReduced: 0.75,
        energySaved: 0.18,
        treesEquivalent: 0.018
      },
      vehicles: {
        co2Saved: 2.0,
        waterSaved: 0.5,
        wasteReduced: 1.5,
        energySaved: 1.0,
        treesEquivalent: 0.1
      },
      tools: {
        co2Saved: 0.4,
        waterSaved: 0.06,
        wasteReduced: 0.8,
        energySaved: 0.2,
        treesEquivalent: 0.02
      },
      art_crafts: {
        co2Saved: 0.15,
        waterSaved: 0.05,
        wasteReduced: 0.5,
        energySaved: 0.08,
        treesEquivalent: 0.008
      },
      other: {
        co2Saved: 0.2,
        waterSaved: 0.05,
        wasteReduced: 0.6,
        energySaved: 0.1,
        treesEquivalent: 0.01
      }
    };

    // Condition multipliers
    this.conditionMultipliers = {
      new: 1.0,
      like_new: 0.9,
      good: 0.7,
      fair: 0.5,
      poor: 0.3
    };

    // Transaction type multipliers
    this.transactionTypeMultipliers = {
      donation: 1.5,
      exchange: 1.2,
      sale: 1.0,
      rental: 0.8
    };
  }

  calculateEcoImpact(itemData) {
    try {
      const {
        category,
        condition = 'good',
        transactionType = 'sale',
        weight = 1, // Default 1kg if not provided
        age = 0, // Age in years
        material = 'mixed'
      } = itemData;

      // Get base impact factors for category
      const baseFactors = this.impactFactors[category] || this.impactFactors.other;
      
      // Apply condition multiplier
      const conditionMultiplier = this.conditionMultipliers[condition] || 0.7;
      
      // Apply transaction type multiplier
      const transactionMultiplier = this.transactionTypeMultipliers[transactionType] || 1.0;
      
      // Apply age penalty (older items have slightly less impact)
      const agePenalty = Math.max(0.5, 1 - (age * 0.05));
      
      // Calculate final impact
      const ecoImpact = {
        co2Saved: parseFloat((baseFactors.co2Saved * weight * conditionMultiplier * transactionMultiplier * agePenalty).toFixed(3)),
        waterSaved: parseFloat((baseFactors.waterSaved * weight * conditionMultiplier * transactionMultiplier * agePenalty).toFixed(3)),
        wasteReduced: parseFloat((baseFactors.wasteReduced * weight * conditionMultiplier * transactionMultiplier * agePenalty).toFixed(3)),
        energySaved: parseFloat((baseFactors.energySaved * weight * conditionMultiplier * transactionMultiplier * agePenalty).toFixed(3)),
        treesEquivalent: parseFloat((baseFactors.treesEquivalent * weight * conditionMultiplier * transactionMultiplier * agePenalty).toFixed(3))
      };

      // Calculate impact score (0-1000)
      const impactScore = this.calculateImpactScore(ecoImpact, transactionType);

      return {
        ...ecoImpact,
        impactScore,
        calculationMethod: 'automatic',
        metadata: {
          category,
          condition,
          transactionType,
          weight,
          age,
          material,
          baseFactors,
          conditionMultiplier,
          transactionMultiplier,
          agePenalty
        }
      };
    } catch (error) {
      console.error('Error calculating eco impact:', error);
      return {
        co2Saved: 0,
        waterSaved: 0,
        wasteReduced: 0,
        energySaved: 0,
        treesEquivalent: 0,
        impactScore: 0,
        calculationMethod: 'automatic',
        metadata: { error: error.message }
      };
    }
  }

  calculateImpactScore(ecoImpact, transactionType) {
    let score = 0;
    
    // Base score from environmental impact
    score += Math.min(ecoImpact.co2Saved * 100, 300); // Max 300 points for CO2
    score += Math.min(ecoImpact.waterSaved * 50, 200); // Max 200 points for water
    score += Math.min(ecoImpact.wasteReduced * 80, 200); // Max 200 points for waste
    score += Math.min(ecoImpact.energySaved * 60, 150); // Max 150 points for energy
    score += Math.min(ecoImpact.treesEquivalent * 1000, 150); // Max 150 points for trees
    
    // Bonus for transaction type
    const typeBonuses = {
      donation: 100,
      exchange: 75,
      sale: 50,
      rental: 25
    };
    
    score += typeBonuses[transactionType] || 50;
    
    return Math.min(Math.round(score), 1000);
  }

  // Calculate eco impact for a specific item
  async calculateItemEcoImpact(item) {
    const itemData = {
      category: item.category,
      condition: item.condition,
      transactionType: item.transactionType,
      weight: item.weight || 1,
      age: item.age || 0,
      material: item.material || 'mixed'
    };

    return this.calculateEcoImpact(itemData);
  }

  // Get eco impact statistics for a category
  getCategoryStats(category) {
    const factors = this.impactFactors[category] || this.impactFactors.other;
    return {
      category,
      averageCo2Saved: factors.co2Saved,
      averageWaterSaved: factors.waterSaved,
      averageWasteReduced: factors.wasteReduced,
      averageEnergySaved: factors.energySaved,
      averageTreesEquivalent: factors.treesEquivalent
    };
  }

  // Get all category statistics
  getAllCategoryStats() {
    const stats = {};
    Object.keys(this.impactFactors).forEach(category => {
      stats[category] = this.getCategoryStats(category);
    });
    return stats;
  }

  // Validate eco impact data
  validateEcoImpactData(ecoImpact) {
    const requiredFields = ['co2Saved', 'waterSaved', 'wasteReduced', 'energySaved', 'treesEquivalent'];
    const errors = [];

    requiredFields.forEach(field => {
      if (typeof ecoImpact[field] !== 'number' || ecoImpact[field] < 0) {
        errors.push(`${field} must be a non-negative number`);
      }
    });

    if (ecoImpact.impactScore && (ecoImpact.impactScore < 0 || ecoImpact.impactScore > 1000)) {
      errors.push('impactScore must be between 0 and 1000');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new EcoImpactCalculationService();
