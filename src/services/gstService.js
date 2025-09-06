class GSTService {
  constructor() {
    // GST rates for different categories as per Indian tax laws
    this.gstRates = {
      // 0% GST
      'books': 0,
      'newspapers': 0,
      'milk': 0,
      'fresh_vegetables': 0,
      'fresh_fruits': 0,
      'donation': 0,
      
      // 5% GST
      'medicines': 5,
      'food_items': 5,
      'educational_books': 5,
      'agricultural_products': 5,
      
      // 12% GST
      'clothing': 12,
      'footwear': 12,
      'home_textiles': 12,
      'kitchen_utensils': 12,
      'furniture_wooden': 12,
      
      // 18% GST
      'electronics': 18,
      'furniture': 18,
      'sports_equipment': 18,
      'beauty_products': 18,
      'home_appliances': 18,
      'books_other': 18,
      'stationery': 18,
      'toys': 18,
      'musical_instruments': 18,
      'camera_equipment': 18,
      'computer_accessories': 18,
      'mobile_accessories': 18,
      
      // 28% GST
      'automotive': 28,
      'luxury_items': 28,
      'tobacco': 28,
      'alcohol': 28,
      'cosmetics_luxury': 28,
      'jewelry': 28,
      
      // Default rate
      'default': 18
    };

    // HSN codes for different categories
    this.hsnCodes = {
      'electronics': '8517',
      'clothing': '6203',
      'furniture': '9403',
      'books': '4901',
      'sports_equipment': '9506',
      'beauty_products': '3304',
      'home_appliances': '8516',
      'automotive': '8708',
      'donation': '9999'
    };
  }

  calculateGST(amount, category, transactionType = 'sale', isDonation = false) {
    try {
      // No GST for donations
      if (isDonation || transactionType === 'donation') {
        return {
          baseAmount: amount,
          gstRate: 0,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          gstAmount: 0,
          totalAmount: amount,
          hsnCode: this.hsnCodes[category] || '9999',
          isGstApplicable: false
        };
      }

      const gstRate = this.gstRates[category] || this.gstRates.default;
      const hsnCode = this.hsnCodes[category] || '9999';
      
      // Calculate GST components
      const gstAmount = parseFloat(((amount * gstRate) / 100).toFixed(2));
      
      // For interstate transactions, IGST is applicable
      // For intrastate transactions, CGST + SGST is applicable
      // For simplicity, we'll use IGST for all transactions
      const igstAmount = gstAmount;
      const cgstAmount = 0;
      const sgstAmount = 0;
      
      const totalAmount = amount + gstAmount;

      return {
        baseAmount: amount,
        gstRate: gstRate,
        cgstRate: 0,
        sgstRate: 0,
        igstRate: gstRate,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
        hsnCode: hsnCode,
        isGstApplicable: true
      };
    } catch (error) {
      throw new Error(`GST calculation failed: ${error.message}`);
    }
  }

  calculateGSTForMultipleItems(items) {
    try {
      let totalBaseAmount = 0;
      let totalGstAmount = 0;
      let totalAmount = 0;
      const itemBreakdown = [];

      for (const item of items) {
        const gstCalculation = this.calculateGST(
          item.amount,
          item.category,
          item.transactionType,
          item.isDonation
        );

        itemBreakdown.push({
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          baseAmount: item.amount,
          gstRate: gstCalculation.gstRate,
          gstAmount: gstCalculation.gstAmount,
          totalAmount: gstCalculation.totalAmount,
          hsnCode: gstCalculation.hsnCode
        });

        totalBaseAmount += item.amount;
        totalGstAmount += gstCalculation.gstAmount;
        totalAmount += gstCalculation.totalAmount;
      }

      return {
        itemBreakdown,
        summary: {
          totalBaseAmount: parseFloat(totalBaseAmount.toFixed(2)),
          totalGstAmount: parseFloat(totalGstAmount.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          itemCount: items.length
        }
      };
    } catch (error) {
      throw new Error(`GST calculation for multiple items failed: ${error.message}`);
    }
  }

  getGSTRates() {
    return {
      rates: this.gstRates,
      hsnCodes: this.hsnCodes,
      categories: Object.keys(this.gstRates)
    };
  }

  getGSTBreakdown(amount, category) {
    const gstCalculation = this.calculateGST(amount, category);
    
    return {
      itemValue: gstCalculation.baseAmount,
      gstRate: `${gstCalculation.gstRate}%`,
      gstAmount: gstCalculation.gstAmount,
      totalAmount: gstCalculation.totalAmount,
      breakdown: {
        'Item Value': `₹${gstCalculation.baseAmount}`,
        'GST (${gstCalculation.gstRate}%)': `₹${gstCalculation.gstAmount}`,
        'Total Amount': `₹${gstCalculation.totalAmount}`
      }
    };
  }

  validateGSTNumber(gstNumber) {
    try {
      // Basic GST number validation (15 characters, alphanumeric)
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
      return gstRegex.test(gstNumber);
    } catch (error) {
      return false;
    }
  }

  generateGSTInvoice(transaction, sellerGST = null) {
    try {
      const gstCalculation = this.calculateGST(
        transaction.amount,
        transaction.item?.category || 'default',
        transaction.transactionType
      );

      const invoice = {
        invoiceNumber: `INV-${transaction.id}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        transactionId: transaction.id,
        seller: {
          name: transaction.seller?.name || 'Seller',
          gstNumber: sellerGST || 'N/A'
        },
        buyer: {
          name: transaction.buyer?.name || 'Buyer',
          gstNumber: 'N/A'
        },
        item: {
          name: transaction.item?.title || 'Item',
          description: transaction.item?.description || '',
          category: transaction.item?.category || 'default',
          hsnCode: gstCalculation.hsnCode
        },
        billing: {
          baseAmount: gstCalculation.baseAmount,
          gstRate: gstCalculation.gstRate,
          gstAmount: gstCalculation.gstAmount,
          totalAmount: gstCalculation.totalAmount,
          currency: 'INR'
        },
        payment: {
          method: transaction.paymentMethod || 'UPI',
          status: transaction.status,
          transactionId: transaction.paymentId
        }
      };

      return invoice;
    } catch (error) {
      throw new Error(`GST invoice generation failed: ${error.message}`);
    }
  }

  getGSTComplianceInfo() {
    return {
      gstRegistrationRequired: 'For businesses with turnover > ₹20 lakhs',
      gstReturnFiling: 'Monthly/Quarterly based on turnover',
      gstPayment: 'Due on 20th of following month',
      penaltyForLateFiling: '₹200 per day',
      gstRateChanges: 'As per government notifications',
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = new GSTService();
