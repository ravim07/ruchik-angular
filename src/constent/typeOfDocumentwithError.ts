// const DOCUMENTTYPE = {
//   PAN: [
//     'black and white copy of pan card',
//     'Date of Birth mismatch with other documents',
//     'Blur image',
//     'Applicant name mismatch with other documents',
//   ],

//   Aadhaar: [
//     'black and white copy of original aadhaar card',
//     'Date of Birth mismatch with other documents',
//     'Blur image',
//     'Applicant name mismatch with other documents',
//   ],

//   Driving: [
//     'License black and white copy of driving license',
//     'Date of Birth mismatch with other documents',
//     'Blur image',
//     'Applicant name mismatch with other documents',
//   ],

//   Voter: [
//     'ID	black and white copy of voter id',
//     'Date of Birth mismatch with other documents',
//     'Blur image',
//     'Applicant name mismatch with other documents',
//   ],

//   Passport: [
//     'Expired passport',
//     'black and white copy of passport',
//     'Applicant name mismatch with other documents',
//     'Blur image',
//     'Applicant name mismatch with other documents',
//   ],

//   'Rent agreement': [
//     'Expired rent agreement',
//     'Agreement that is not notarized',
//     'Applicant name not included in rent agreement',
//   ],

//   'Utility Bill': [
//     'Blur image',
//     'Electricity bill that is more than three months old',
//     'Electricity bill without name and address',
//   ],

//   'Sale Deed': [
//     'Sale deed with Index 2',
//     'Blur image',
//     'Sale deed without applicant name',
//   ],

//   'GST Certificate': [
//     'GST which has mismatch in business name',
//     'Blur image',
//     'GST which is cancelled suspended',
//   ],

//   'Food License': [
//     'Expired food license',
//     'Food license which has mismatch in business name',
//     'Blur image',
//   ],

//   'Shop Establishment Act': [
//     'Blur image',
//     'handwritten shop establishment license without stamp and sign',
//     'Expired shop establishment license',
//   ],

//   'Bank statement': [
//     'Bank statement in excel, word or html format',
//     'Bank statement that is converted from any other format to pdf',
//     'Bank statement sent without password',
//     'Bank statement without debit and credit and balance column',
//   ],

//   'Partnership Deed': [
//     '	Expired partnership deed',
//     'Partnership deed that is not notarized',
//   ],

//   'GST 3B Returns': [
//     'GST returns that are not for latest 6 months',
//     'Blur image',
//   ],

//   'Audited Financials': [
//     'Financials that are in excel format',
//     'Financials without stamp and sign',
//     'Blur image',
//     'Incomplete financials with missing balance sheet/Profit and loss account',
//   ],
// };

const DOCUMENTTYPE = [
  {
    documentCategory: 'Aadhar',
    documentType: 'individual_kyc',
    errorMessage: [
      'Aadhar Card Missing',
      'Front Side Aadhar Card Missing',
      'First Name Mismatch In Aadhar Card',
      'Last Name Mismatch In Aadhar Card',
      'DOB Mismatch in Aadhar Card',
    ],
    fields: [
      {
        name: 'First Name',
        type: 'text',
        key: 'FirstName',
      },

      {
        name: 'Last Name',
        type: 'text',
        key: 'LastName',
      },

      {
        name: 'Address',
        type: 'text',
        key: 'Address',
      },
    ],
  },
  {
    documentCategory: 'PAN',
    documentType: 'individual_kyc',
    errorMessage: [
      'Pan Card Missing',
      'Front Side Pan Card Missing',
      'First Name Mismatch In Pan Card',
      'Last Name Mismatch In Pan Card',
      'DOB Mismatch in Pan Card',
    ],
    fields: [
      {
        name: 'First Name',
        type: 'text',
        key: 'FirstName',
      },
      {
        name: 'Last Name',
        type: 'text',
        key: 'LastName',
      },
      {
        name: 'Date Of Birth',
        type: 'Date',
        key: 'DateOfBirth',
      },
    ],
  },
  {
    documentCategory: 'Driving Licence',
    documentType: 'individual_kyc',
    errorMessage: [],
    fields: [],
  },
  {
    documentCategory: 'Voter Id',
    documentType: 'individual_kyc',
    errorMessage: [],
    fields: [],
  },
  {
    documentCategory: 'Passport',
    documentType: 'individual_kyc',
    errorMessage: [],
    fields: [],
  },
  {
    documentCategory: 'Company PAN',
    documentType: 'company_kyc',
    errorMessage: ['Business Name', 'Color Pan Card Required'],
    fields: [
      {
        name: 'Business Name',
        type: 'text',
        key: 'BusinessName',
      },
    ],
  },
  {
    documentCategory: 'MOA',
    documentType: 'company_kyc',
    errorMessage: ['All Pages Required In MOA', 'Business Name Check'],
    fields: [
      {
        name: 'Business Name',
        type: 'text',
        key: 'BusinessName',
      },
    ],
  },
  {
    documentCategory: 'AOA',
    documentType: 'company_kyc',
    errorMessage: ['All Pages Required In AOA', 'Business Name Check'],
    fields: [
      {
        name: 'Business Name',
        type: 'text',
        key: 'BusinessName',
      },
    ],
  },
  {
    documentCategory: 'Shareholding Pattern',
    documentType: 'company_kyc',
    errorMessage: [
      'Shareholding Patten Required Only',
      'Kyc Of All Holder Need',
    ],
    fields: [
      {
        name: 'Business Name',
        type: 'text',
        key: 'BusinessName',
      },
    ],
  },
  {
    documentCategory: 'Partnership Deed',
    documentType: 'company_kyc',
    errorMessage: [
      'Partnership Deed Should Be Notarised On Stamp Paper Of More Than 100 Rupees',
    ],
    fields: [
      {
        name: 'Business Name',
        type: 'text',
        key: 'BusinessName',
      },
    ],
  },
  {
    documentCategory: 'Incorporation Certificate',
    documentType: 'company_kyc',
    errorMessage: ['Certificate Of Incorporation Document Should Be Given'],
    fields: [],
  },
  {
    documentCategory: 'Bank Statements',
    documentType: 'bank_statements',
    errorMessage: [
      'Statement Missing',
      'Statement not in PDF format',
      'Bank Name Missing on Statement',
      'Bank AC number missing on Statement',
      'Banking given from non accepted source',
      'Banking Required in Business Name',
    ],
    fields: [],
  },
  {
    documentCategory: 'GST Certificate',
    documentType: 'business_registration_proof',
    errorMessage: [
      '1 st page of gst required',
      '2 st page of gst required',
      '3 st page of gst required',
      'GST not active',
      'business vintage not meet',
    ],
    fields: [
      {
        name: 'GST Number',
        type: 'text',
        key: 'GSTIN',
      },
      {
        name: 'Date Of Registration',
        type: 'Date',
        key: 'BusinessEstablishment',
      },
      {
        name: 'Business Name',
        type: 'text',
        key: 'BusinessName',
      },
    ],
  },
  {
    documentCategory: 'ITR',
    documentType: 'itr',
    errorMessage: [
      'Your ITR Acknowledgement And Computation For The Last 2 Years',
    ],
    fields: [
      {
        name: 'ItrFiled',
        type: 'dropdown',
        key: 'ItrFiled',
      },
      {
        name: 'Audited Financial Of Last 12 Months',
        type: 'dropdown',
        key: 'AuditedFinancialOfLast12Months',
      },
    ],
  },
  {
    documentCategory: 'GSTR-3B',
    documentType: 'gst_returns',
    errorMessage: ['Your GST 3B Returns For Last 6 Months'],
    fields: [
      {
        name: 'Your GST 3B Returns For Last 6 Months',
        type: 'text',
        key: 'GSTReturn',
      },
    ],
  },
  {
    documentCategory: 'Property Proof',
    documentType: 'property_ownership_proof',
    errorMessage: [
      'E Bill Should Not Be Old More Than 3 Months',
      'Rent Agreement Proof should be Older Than 12 Months',
    ],
    fields: [
      {
        name: 'Vintage of proof and name of owner',
        type: 'text',
        key: 'BusinessVintage',
      },
    ],
  },
  {
    documentCategory: 'Business Property Proof',
    documentType: 'property_ownership_proof',
    errorMessage: [],
    fields: [],
  },
  {
    documentCategory: 'House Property Proof',
    documentType: 'property_ownership_proof',
    errorMessage: [],
    fields: [],
  },
  {
    documentCategory: 'Financials - Recent',
    documentType: 'audited_financials',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Financials - Old',
    documentType: 'audited_financials',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Provisional Financials',
    documentType: 'audited_financials',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Loan Account Statement',
    documentType: 'loan_takeover',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Sanction Letters',
    documentType: 'loan_takeover',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Collateral Documents',
    documentType: 'collateral_documents',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Credit Assessment',
    documentType: 'internal_assessment_documents',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Other',
    documentType: 'internal_assessment_documents',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Udyam Registration Certificate',
    documentType: 'business_registration_proof',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Shop & Establishment Registration',
    documentType: 'business_registration_proof',
    errorMessage: [],
    fields: [{}],
  },
  {
    documentCategory: 'Trade License',
    documentType: 'business_registration_proof',
    errorMessage: [],
    fields: [{}],
  },
];

export default DOCUMENTTYPE;
