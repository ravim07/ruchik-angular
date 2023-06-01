const DROPDOWNS_VALUES = {
  requestedLoanAmount: {
    None: 0,
    'Rs 1-5 Lakhs': 1,
    'Rs 5-10 Lakhs': 2,
    'Rs 10-20 Lakhs': 3,
    'Rs 20-50 Lakhs': 4,
    'Rs 50 Lakhs 1 Crore': 5,
    'Rs 1-3 Crores': 6,
    'Rs 3 Crores & Above': 7,
  },
  loanProduct: {
    None: 0,
    'Unsecured Business Loans': 1,
    'Unsecured Line of Credit': 2,
    'Secured Term Loans': 3,
    'Loan Against Property': 4,
    'Working Capital Loans': 5,
    'Trade Finance': 6,
    'Equipment / Machinery Finance': 7,
    'Bill Discounting': 8,
    'Not Sure / Others': 9,
    'Personal Loan': 10,
    'Equipment Loan': 11,
    'Tata BL on the fly': 12,
    'Loan for Professionals': 13,
    'Overdraft Facility': 14,
  },
  callMode: {
    None: 0,
    'Direct Call': 1,
    'Recorded Call': 2,
  },
  kindOfLoan: {
    None: 0,
    'Unsecured Business Loan': 1,
    'Secured Business Loan': 2,
  },

  isBusinessGSTRegistered: {
    None: 0,
    Yes: 1,
    No: 2,
    'Non Applicable': 3,
  },

  businessType: {
    None: 0,
    Unregistered: 1,
    'Sole Proprietorship': 2,
    Partnership: 3,
    LLP: 4,
    'Private Limited': 5,
    'Public Limited': 6,
    Other: 7,
  },
};

export default DROPDOWNS_VALUES;
