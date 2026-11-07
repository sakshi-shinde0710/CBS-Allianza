import { useEffect, useMemo, useState } from 'react'
import { calculateAge, validatePage } from './validation.js'
import './IndividualCustomerMaster.css'

const tabs = [
  'Basic Info',
  'KYC Details',
  'Facilities',
  'Address',
  'Employment Details',
  'Income Details',
  'Fatca Details',
  'Documents Upload',
]

const fieldGroups = [
  [
    {
      title: 'Customer and Branch Details',
      fields: [
        { name: 'customerNo', label: 'Customer No', type: 'digits', required: true },
        { name: 'homeBranch', label: 'Home Branch', required: true },
        { name: 'groupCustomerNo', label: 'Group Customer No', type: 'digits' },
      ],
    },
    {
      title: 'Personal Details',
      layout: 'personal',
      rows: [
        { left: 'kycName', actions: true },
        { left: 'dateOfBirth', middle: 'age', right: 'placeOfBirth' },
        { left: 'fatherName', middle: 'motherName' },
        { left: 'gender', middle: 'maritalStatus' },
        { left: 'aliasName', middle: 'spouseName' },
      ],
      fields: [
        { name: 'kycName', label: 'KYC Name', parts: ['kycTitle', 'kycFirstName', 'kycMiddleName', 'kycLastName'], titleOptions: true, required: true },
        { name: 'aliasName', label: 'Alias Name', parts: ['aliasFirstName', 'aliasMiddleName', 'aliasLastName'] },
        { name: 'dateOfBirth', label: 'DOB', type: 'date', required: true },
        { name: 'age', label: 'Age', type: 'readonly' },
        { name: 'placeOfBirth', label: 'Place of Birth', nameField: true },
        { name: 'fatherName', label: "Father's Name", parts: ['fatherTitle', 'fatherFirstName', 'fatherMiddleName', 'fatherLastName'], titleOptions: true },
        { name: 'motherName', label: "Mother's Name", parts: ['motherTitle', 'motherFirstName', 'motherMiddleName', 'motherLastName'], titleOptions: true },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
        { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Widowed', 'Divorced'] },
        { name: 'spouseName', label: 'Spouse Name', parts: ['spouseTitle', 'spouseFirstName', 'spouseMiddleName', 'spouseLastName'], titleOptions: true },
      ],
    },
    {
      title: 'Customer Information',
      fields: [
        { name: 'customerType', label: 'Customer Type', type: 'select', options: ['Individual', 'Sole Proprietor'] },
        { name: 'physicalStatus', label: 'Physical Status', type: 'select', options: ['Normal', 'Visually Impaired', 'Hearing Impaired', 'Other'] },
        { name: 'religion', label: 'Religion', type: 'select', options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'] },
        { name: 'caste', label: 'Caste' },
        { name: 'scCategory', label: 'SC Category', type: 'select', options: ['Yes', 'No'] },
        { name: 'seniorCitizen', label: 'Sr. Citizen', type: 'select', options: ['Yes', 'No'] },
        { name: 'minorIndicator', label: 'Minor Indicator', type: 'select', options: ['Yes', 'No'] },
        { name: 'minorTurnedMajorOn', label: 'Minor turned Major on', type: 'date' },
        { name: 'noOfChildren', label: 'No of Children', type: 'digits' },
        { name: 'dependents', label: 'No of Dependents', type: 'digits' },
      ],
    },
    {
      title: 'Identity Details',
      fields: [
        { name: 'pan', label: 'PAN Card', maxLength: 10, action: 'Validate' },
        { name: 'aadhaar', label: 'Aadhaar Card', type: 'digits', maxLength: 12, inputMode: 'numeric', action: 'Validate' },
        { name: 'passportNo', label: 'Passport No' },
        { name: 'passportIssueDate', label: 'Issue Date', type: 'date' },
        { name: 'passportExpiryDate', label: 'Expiry Date', type: 'date' },
      ],
    },
    {
      title: 'Employment and Other Details',
      fields: [
        { name: 'staffIndicator', label: 'Staff Indicator', type: 'select', options: ['Yes', 'No'] },
        { name: 'employeeId', label: 'Employee ID' },
        { name: 'resident', label: 'Resident', type: 'select', options: ['Yes', 'No'] },
        { name: 'residentialStatus', label: 'Residential Status', type: 'select', options: ['Resident Individual', 'Non-Resident Indian', 'Foreign National'] },
        { name: 'customerStatus', label: 'Customer Status', type: 'select', options: ['Active', 'Inactive', 'Prospect'] },
        { name: 'nationality', label: 'Nationality', type: 'select', options: ['Indian', 'Other'] },
        { name: 'educationQualification', label: 'Education Qualification', type: 'select', options: ['Primary', 'Secondary', 'Graduate', 'Post Graduate', 'Other'] },
        { name: 'tdsFlag', label: 'TDS Flag', type: 'select', options: ['Yes', 'No'] },
        { name: 'form121SubmissionDate', label: 'Form 121 Submission Date', type: 'date' },
      ],
    },
  ],
  [
    {
      title: 'KYC Risk Details',
      fields: [
        { name: 'kycName', label: 'KYC Name', parts: ['kycTitle', 'kycFirstName', 'kycMiddleName', 'kycLastName'], titleOptions: true, required: true },
        { name: 'kycRating', label: 'KYC Rating', type: 'select', options: ['Low', 'Medium', 'High'] },
        { name: 'pepIndicator', label: 'PEP Indicator', type: 'select', options: ['No', 'Yes', 'Related to PEP'] },
        { name: 'amlRating', label: 'AML Rating', type: 'select', options: ['Low', 'Medium', 'High'] },
        { name: 'ckycStatus', label: 'CKYC Status', type: 'select', options: ['Not Registered', 'Registered', 'Pending'] },
      ],
    },
    {
      title: 'KYC Dates and Compliance',
      fields: [
        { name: 'customerOpenDate', label: 'Customer Open Date', type: 'date', required: true },
        { name: 'ckycNo', label: 'CKYC No', type: 'digits', maxLength: 14 },
        { name: 'kycDate', label: 'KYC Date', type: 'date', required: true },
        { name: 'nextKycReviewDate', label: 'Next KYC Review Date', type: 'date', required: true },
        { name: 'riskProfileExpiryDate', label: 'Risk Profile Expiry Date', type: 'date' },
        { name: 'kycCompliant', label: 'KYC Compliant Indicator', type: 'select', options: ['Yes', 'No'] },
      ],
    },
  ],
  [],
  [
    {
      title: 'Address Information',
      fields: [
        { name: 'addressType', label: 'Address Type', type: 'select', options: ['Residential', 'Permanent', 'Communication', 'Office'] },
        { name: 'addressLine1', label: 'Address Line 1' },
        { name: 'addressLine2', label: 'Address Line 2' },
        { name: 'addressLine3', label: 'Address Line 3' },
        { name: 'country', label: 'Country', type: 'select', options: ['India', 'Other'] },
        { name: 'state', label: 'State' },
        { name: 'district', label: 'District' },
        { name: 'city', label: 'City' },
        { name: 'pinCode', label: 'PIN Code', type: 'digits', maxLength: 6, inputMode: 'numeric' },
        { name: 'addressMobile', label: 'Mobile Number', type: 'digits', maxLength: 10, inputMode: 'numeric' },
        { name: 'addressEmail', label: 'Email Address', type: 'email' },
        { name: 'addressProofType', label: 'Address Proof Type', type: 'select', options: ['Aadhaar', 'Passport', 'Utility Bill', 'Driving Licence', 'Other'] },
        { name: 'addressProofNumber', label: 'Address Proof Number' },
      ],
    },
  ],
  [
    {
      title: 'Employment Information',
      fields: [
        { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Salaried', 'Self-employed', 'Business', 'Retired', 'Student', 'Other'] },
        { name: 'occupation', label: 'Occupation' },
        { name: 'employerName', label: 'Employer Name' },
        { name: 'designation', label: 'Designation' },
        { name: 'department', label: 'Department' },
        { name: 'workExperience', label: 'Total Work Experience' },
        { name: 'joiningDate', label: 'Joining Date', type: 'date' },
        { name: 'officeAddress', label: 'Office Address', wide: true },
        { name: 'officeCity', label: 'Office City' },
        { name: 'officeState', label: 'Office State' },
        { name: 'officePinCode', label: 'Office PIN Code', type: 'digits', maxLength: 6, inputMode: 'numeric' },
        { name: 'employerContact', label: 'Employer Contact Details', type: 'digits', maxLength: 10, inputMode: 'numeric' },
      ],
    },
  ],
  [
    {
      title: 'Income & Banking Information',
      fields: [
        { name: 'incomeType', label: 'Income Type', type: 'select', options: ['Salary', 'Business', 'Professional', 'Pension', 'Other'] },
        { name: 'monthlyIncome', label: 'Monthly Income', type: 'number', min: 0, step: '0.01' },
        { name: 'annualIncome', label: 'Annual Income', type: 'number', min: 0, step: '0.01' },
        { name: 'otherIncome', label: 'Other Income', type: 'number', min: 0, step: '0.01' },
        { name: 'salaryMode', label: 'Salary Mode', type: 'select', options: ['Bank Transfer', 'Cheque', 'Cash', 'Other'] },
        { name: 'incomeSource', label: 'Income Source' },
        { name: 'bankName', label: 'Bank Name' },
        { name: 'accountNumber', label: 'Account Number', type: 'digits', inputMode: 'numeric' },
        { name: 'incomeIfsc', label: 'IFSC Code', maxLength: 11 },
        { name: 'incomeProofType', label: 'Income Proof Type', type: 'select', options: ['Salary Slip', 'Form 16', 'IT Return', 'Bank Statement', 'Other'] },
      ],
    },
  ],
  [
    {
      title: 'Tax Residency & Declarations',
      fields: [
        { name: 'taxResidency', label: 'Tax Residency', type: 'select', options: ['India only', 'India and other country', 'Other country'] },
        { name: 'countryOfBirth', label: 'Country of Birth', type: 'select', options: ['India', 'Other'] },
        { name: 'fatcaNationality', label: 'Nationality', type: 'select', options: ['Indian', 'Other'] },
        { name: 'tin', label: 'Tax Identification Number (TIN)' },
        { name: 'usPerson', label: 'US Person Indicator', type: 'select', options: ['No', 'Yes'] },
        { name: 'fatcaDeclarationDate', label: 'FATCA Declaration Date', type: 'date' },
        { name: 'crsDeclarationDate', label: 'CRS Declaration Date', type: 'date' },
        { name: 'fatcaApplicable', label: 'FATCA Applicable', type: 'select', options: ['No', 'Yes'] },
        { name: 'crsApplicable', label: 'CRS Applicable', type: 'select', options: ['No', 'Yes'] },
      ],
    },
  ],
  [],
]

const documentTypes = [
  'PAN',
  'Aadhaar',
  'Passport',
  'Photograph',
  'Signature',
  'Address Proof',
  'Identity Proof',
  'Income Proof',
  'Other Supporting Documents',
]

function BankingHeader() {
  const date = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date()).replaceAll(' ', '-')

  return (
    <header className="bank-header">
      <div className="bank-topline">
        <div className="bank-brand">
          <div className="allianza-logo" aria-label="Allianza logo">
            <svg viewBox="0 0 42 42" role="img" aria-hidden="true">
              <path d="M21 3 39 36H3L21 3Z" fill="none" stroke="currentColor" strokeWidth="2.3" />
              <path d="m21 14 11.5 21h-23L21 14Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M15.5 25h11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>ALLIANZA</span>
          </div>
          <strong>Name of the Bank</strong>
        </div>
        <div className="bank-meta"><span>Operation Date</span><strong>{date}</strong></div>
        <div className="bank-meta"><span>Branch</span><strong>—</strong></div>
        <div className="bank-meta system-date"><span>System Date</span><strong>{date}</strong></div>
        <div className="bank-meta user-meta"><span>User</span><strong><span className="user-icon" aria-hidden="true">●</span> Current User</strong></div>
      </div>
      <div className="bank-titleline">
        <strong className="product-name">Nexora</strong>
        <strong className="screen-title">Individual Customer Master</strong>
        <span className="title-spacer" aria-hidden="true" />
      </div>
    </header>
  )
}

function FormField({ field, value, error, onChange, onBlur, onAction, idPrefix = '', compact = false, reserveError = false }) {
  const fieldKey = field.name
  const controlId = `${idPrefix}${field.name}`
  const errorId = `${idPrefix}${field.name}-error`
  const common = {
    id: controlId,
    name: field.name,
    value: value ?? '',
    onChange: (event) => onChange(field.name, event.target.value),
    onBlur: () => onBlur(fieldKey),
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    maxLength: field.maxLength,
    inputMode: field.inputMode,
  }
  let control
  if (field.parts) {
    control = (
      <div className="name-parts">
        {field.parts.map((part, index) => (
          field.titleOptions && index === 0 ? (
            <select
              key={part}
              id={`${idPrefix}${part}`}
              name={part}
              value={value?.[part] ?? ''}
              aria-label={`${field.label} title`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => onChange(part, event.target.value)}
              onBlur={() => onBlur(field.name)}
            >
              <option value="">Title</option>
              {['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Dr.'].map((title) => <option key={title} value={title}>{title}</option>)}
            </select>
          ) : (
            <input
              key={part}
              id={part}
              name={part}
              value={value?.[part] ?? ''}
              maxLength={field.partMaxLength}
              placeholder={['First', 'Middle', 'Last'][index - (field.titleOptions ? 1 : 0)] || 'Name'}
              aria-label={`${field.label} ${['first', 'middle', 'last'][index - (field.titleOptions ? 1 : 0)] || index + 1}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${field.name}-error` : undefined}
              onChange={(event) => onChange(part, event.target.value)}
              onBlur={() => onBlur(field.name)}
            />
          )
        ))}
      </div>
    )
  } else if (field.type === 'select') {
    control = (
      <select {...common} value={value ?? ''}>
        <option value="">-- Select --</option>
        {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    )
  } else if (field.type === 'readonly') {
    control = <input {...common} readOnly placeholder="—" />
  } else {
    control = (
      <input
        {...common}
        type={field.type === 'digits' ? 'text' : field.type || 'text'}
        inputMode={field.type === 'digits' ? 'numeric' : field.inputMode}
        min={field.min}
        step={field.step}
        placeholder={field.type === 'date' ? '' : 'Enter'}
        onChange={field.type === 'digits' ? (event) => onChange(field.name, event.target.value.replace(/\D/g, '')) : common.onChange}
        onKeyDown={field.type === 'number' || field.type === 'digits' ? (event) => {
          if (['e', 'E', '+', '-'].includes(event.key)) event.preventDefault()
        } : undefined}
      />
    )
  }
  return (
    <div className={`field ${field.wide ? 'field-wide' : ''} ${field.parts ? 'field-multipart' : ''} ${compact ? 'compact-field' : ''}`}>
      <label htmlFor={`${idPrefix}${field.parts?.[0] || field.name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
      {field.action ? (
        <div className="input-action-group">
          {control}
          <button type="button" className="small-action-button" onClick={() => onAction(field.name)}>{field.action}</button>
        </div>
      ) : control}
      {error
        ? <span className="field-error" id={errorId} role="alert">{error}</span>
        : reserveError && <span className="field-error field-error-placeholder" aria-hidden="true">&nbsp;</span>}
    </div>
  )
}

function DocumentUpload({ files, errors, onChoose, onRemove }) {
  const previews = useMemo(() => {
    const urls = {}
    Object.entries(files).forEach(([name, file]) => {
      if (file.type.startsWith('image/')) urls[name] = URL.createObjectURL(file)
      else if (file.type === 'application/pdf') urls[name] = URL.createObjectURL(file)
    })
    return urls
  }, [files])

  useEffect(() => () => Object.values(previews).forEach((url) => URL.revokeObjectURL(url)), [previews])

  return (
    <div className="documents-panel">
      <div className="section-heading">Customer Documents</div>
      <p className="form-note">Accepted formats: PDF, JPG, JPEG, PNG. Maximum file size: 5 MB per file.</p>
      <div className="document-list">
        {documentTypes.map((name) => {
          const file = files[name]
          const id = `document-${name.replace(/\W+/g, '-').toLowerCase()}`
          return (
            <div className="document-row" key={name}>
              <label className="document-label" htmlFor={id}>{name}</label>
              <div className="document-picker">
                <input
                  id={id}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(event) => {
                    onChoose(name, event.target.files?.[0])
                    event.target.value = ''
                  }}
                  aria-describedby={errors[name] ? `${id}-error` : undefined}
                />
                {file && <span className="selected-file" title={file.name}>{file.name}</span>}
              </div>
              <div className="document-actions">
                {file && <button className="text-button" type="button" onClick={() => window.open(previews[name], '_blank', 'noopener,noreferrer')}>Preview</button>}
                {file && <button className="text-button remove-button" type="button" onClick={() => onRemove(name)}>Remove</button>}
              </div>
              {errors[name] && <span className="field-error document-error" id={`${id}-error`} role="alert">{errors[name]}</span>}
              {file?.type === 'image/png' || file?.type === 'image/jpeg' ? (
                <img className="document-thumbnail" src={previews[name]} alt={`${name} preview`} />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function IndividualCustomerMaster() {
  const [activeTab, setActiveTab] = useState(0)
  const [addressSubtab, setAddressSubtab] = useState('address')
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [facilities, setFacilities] = useState([])
  const [addressRows, setAddressRows] = useState([{ id: 1 }])
  const [nextFacilityId, setNextFacilityId] = useState(1)
  const [nextAddressId, setNextAddressId] = useState(2)
  const [editingFacility, setEditingFacility] = useState(null)
  const [viewFacility, setViewFacility] = useState(null)
  const [files, setFiles] = useState({})
  const [documentErrors, setDocumentErrors] = useState({})
  const [notice, setNotice] = useState('')

  const setField = (name, value) => {
    const formattedValue = name === 'pan' ? value.toUpperCase() : value
    const nextValues = { ...values, [name]: formattedValue }
    setValues(nextValues)
    const updatedErrors = validatePage(activeTab, nextValues, facilities, addressRows)
    const pageFields = new Set(fieldGroups[activeTab]?.flatMap((group) =>
      group.fields.flatMap((field) => [field.name, ...(field.parts || [])]),
    ) || [])
    setErrors((current) => {
      const next = { ...current }
      Object.keys(current).forEach((key) => {
        if (!pageFields.has(key)) return
        if (key in updatedErrors) next[key] = updatedErrors[key]
        else delete next[key]
      })
      return next
    })
    if (notice) setNotice('')
  }

  const validateField = (name) => {
    const fieldErrors = validatePage(activeTab, values, facilities, addressRows)
    setErrors((current) => {
      const next = { ...current }
      if (fieldErrors[name]) next[name] = fieldErrors[name]
      else delete next[name]
      return next
    })
  }

  const validateIdentityFormat = (name) => {
    const fieldErrors = validatePage(0, values, facilities)
    if (fieldErrors[name]) {
      setErrors((current) => ({ ...current, [name]: fieldErrors[name] }))
      setNotice(fieldErrors[name])
      return
    }
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    const label = name === 'pan' ? 'PAN' : 'Aadhaar'
    setNotice(`${label} format is valid. No external verification was performed.`)
  }

  const checkTab = (tabIndex) => {
    const nextErrors = validatePage(tabIndex, values, facilities, addressRows)
    if (tabIndex === 7) {
      Object.entries(documentErrors).forEach(([name, message]) => {
        nextErrors[`document-${name}`] = message
      })
    }
    const pageFields = new Set(tabIndex === 2
      ? facilities.map((facility) => `facility-${facility.id}`)
      : tabIndex === 3
        ? [
            ...addressRows.flatMap((address) => Object.keys(address).filter((key) => key !== 'id').map((key) => `address-${address.id}-${key}`)),
            'addressMobile', 'addressEmail',
          ]
        : fieldGroups[tabIndex]?.flatMap((group) => group.fields.flatMap((field) => [field.name, ...(field.parts || [])])) || [])
    setErrors((current) => {
      const updated = { ...current }
      Object.keys(updated).forEach((key) => {
        if (pageFields.has(key)) delete updated[key]
      })
      return { ...updated, ...nextErrors }
    })
    return Object.keys(nextErrors).length === 0
  }

  const validateCurrentSection = () => {
    if (checkTab(activeTab)) setNotice(`${tabs[activeTab]} details are valid.`)
    else setNotice('Please correct the highlighted fields.')
  }

  const validateAll = () => {
    const combinedErrors = {}
    tabs.forEach((_, index) => Object.assign(combinedErrors, validatePage(index, values, facilities, addressRows)))
    Object.entries(documentErrors).forEach(([name, message]) => {
      combinedErrors[`document-${name}`] = message
    })
    setErrors(combinedErrors)
    if (Object.keys(combinedErrors).length) {
      const firstInvalidTab = tabs.findIndex((_, index) =>
        Object.keys(validatePage(index, values, facilities, addressRows)).length > 0 ||
        (index === 7 && Object.keys(documentErrors).length > 0),
      )
      if (firstInvalidTab === 3) {
        const hasAddressEntryError = Object.keys(combinedErrors).some((key) => key.startsWith('address-'))
        setAddressSubtab(hasAddressEntryError ? 'address' : 'phone')
      }
      setActiveTab(firstInvalidTab)
      setNotice('Please correct the highlighted fields before submitting.')
      return
    }
    setNotice('All entered data passed client-side validation. No backend submission was performed.')
  }

  const clearForm = () => {
    const hasEnteredData = Object.values(values).some(Boolean) ||
      Object.keys(files).length > 0 ||
      facilities.length > 0 ||
      addressRows.length > 1 ||
      addressRows.some((address) => Object.entries(address).some(([key, value]) => key !== 'id' && Boolean(value)))
    if (hasEnteredData && !window.confirm('Cancel this form and clear all entered information? This cannot be undone.')) return
    setActiveTab(0)
    setValues({})
    setErrors({})
    setFacilities([])
    setAddressRows([{ id: 1 }])
    setNextFacilityId(1)
    setNextAddressId(2)
    setAddressSubtab('address')
    setFiles({})
    setDocumentErrors({})
    setNotice('')
  }

  const saveFacility = () => {
    if (!editingFacility.name.trim()) {
      setErrors((current) => ({ ...current, [`facility-${editingFacility.id}`]: 'Particulars are required.' }))
      return
    }
    if (editingFacility.amount && (!/^\d+(\.\d{1,2})?$/.test(editingFacility.amount) || Number(editingFacility.amount) < 0)) {
      setErrors((current) => ({ ...current, [`facility-${editingFacility.id}`]: 'Amount must be a non-negative number.' }))
      return
    }
    setFacilities((current) => current.map((facility) =>
      facility.id === editingFacility.id ? { ...editingFacility } : facility,
    ))
    setErrors((current) => {
      const next = { ...current }
      delete next[`facility-${editingFacility.id}`]
      return next
    })
    setEditingFacility(null)
  }

  const addFacility = () => {
    const newFacility = { id: nextFacilityId, name: '', amount: '', remarks: '' }
    setFacilities((current) => [...current, newFacility])
    setEditingFacility(newFacility)
    setNextFacilityId((current) => current + 1)
  }

  const removeFacility = (id) => {
    setFacilities((current) => current.filter((facility) => facility.id !== id))
    if (editingFacility?.id === id) setEditingFacility(null)
    setErrors((current) => {
      const next = { ...current }
      delete next[`facility-${id}`]
      return next
    })
  }

  const addAddress = () => {
    setAddressRows((current) => [...current, { id: nextAddressId }])
    setNextAddressId((current) => current + 1)
  }

  const removeAddress = (id) => {
    setAddressRows((current) => current.filter((address) => address.id !== id))
    setErrors((current) => {
      const next = { ...current }
      Object.keys(next).filter((key) => key.startsWith(`address-${id}-`)).forEach((key) => delete next[key])
      return next
    })
  }

  const updateAddress = (id, name, value) => {
    const updatedRows = addressRows.map((address) =>
      address.id === id ? { ...address, [name]: value } : address,
    )
    setAddressRows(updatedRows)
    const addressErrors = validatePage(3, values, facilities, updatedRows)
    setErrors((current) => {
      const next = { ...current }
      Object.keys(next).filter((key) => key.startsWith(`address-${id}-`)).forEach((key) => delete next[key])
      Object.entries(addressErrors)
        .filter(([key]) => key.startsWith(`address-${id}-`))
        .forEach(([key, message]) => { next[key] = message })
      return next
    })
  }

  const validateAddressField = (id) => {
    const addressErrors = validatePage(3, values, facilities, addressRows)
    setErrors((current) => {
      const next = { ...current }
      Object.keys(next).filter((key) => key.startsWith(`address-${id}-`)).forEach((key) => delete next[key])
      Object.entries(addressErrors)
        .filter(([key]) => key.startsWith(`address-${id}-`))
        .forEach(([key, message]) => { next[key] = message })
      return next
    })
  }

  const removeDocument = (name) => {
    setFiles((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    setDocumentErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const chooseFile = (name, file) => {
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    const allowed = ['pdf', 'jpg', 'jpeg', 'png']
    if (!allowed.includes(extension) || (file.type && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type))) {
      setDocumentErrors((current) => ({ ...current, [name]: 'Choose a PDF, JPG, JPEG, or PNG file.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setDocumentErrors((current) => ({ ...current, [name]: 'File must be 5 MB or smaller.' }))
      return
    }
    setFiles((current) => ({ ...current, [name]: file }))
    setDocumentErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const renderGroupField = (field, compact = false) => (
    <FormField
      key={field.name}
      field={field}
      value={field.name === 'age' ? calculateAge(values.dateOfBirth) : field.parts ? values : values[field.name]}
      error={errors[field.name]}
      onChange={setField}
      onBlur={validateField}
      onAction={validateIdentityFormat}
      compact={compact}
      reserveError={compact}
    />
  )

  const renderGroup = (group) => (
    <section className={`form-section ${group.layout === 'personal' ? 'personal-section' : ''}`} key={group.title}>
      <div className="section-heading">{group.title}</div>
      {group.layout === 'personal' ? (
        <div className="personal-grid">
          {group.rows.map((row, index) => {
            const fieldsByName = new Map(group.fields.map((field) => [field.name, field]))
            const renderSlot = (name) => {
              const field = fieldsByName.get(name)
              return field ? renderGroupField(field, true) : null
            }
            return (
              <div className="personal-row" key={`personal-row-${index + 1}`}>
                <div className="personal-slot">{renderSlot(row.left)}</div>
                <div className="personal-slot">{renderSlot(row.middle)}</div>
                <div className="personal-slot">{renderSlot(row.right)}</div>
                <div className="personal-actions">
                  {row.actions && (
                    <>
                      <button className="action-button" type="button" onClick={() => setNotice('Duplicate check requires a connected customer service. No lookup was performed.')}>Duplicate Check</button>
                      <button className="action-button" type="button" onClick={() => setNotice('Blacklist check requires a connected screening service. No lookup was performed.')}>Blacklist Check</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="field-grid">
          {group.fields.map((field) => renderGroupField(field))}
        </div>
      )}
    </section>
  )

  const renderFields = (index) => index === 1
    ? <div className="kyc-columns">{fieldGroups[index].map(renderGroup)}</div>
    : fieldGroups[index].map(renderGroup)

  const addressFields = fieldGroups[3][0].fields.filter(
    (field) => !['addressMobile', 'addressEmail'].includes(field.name),
  )

  return (
    <main className="cif-app">
      <BankingHeader />
      <nav className="tab-bar" aria-label="Individual customer sections">
        {tabs.map((tab, index) => (
          <button
            type="button"
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            aria-current={activeTab === index ? 'step' : undefined}
            key={tab}
            onClick={() => { setActiveTab(index); setNotice('') }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="work-area">
        <div className="page-caption">
          <span>{tabs[activeTab]}</span>
          <span className="page-count">Page {activeTab + 1} of {tabs.length}</span>
        </div>
        {notice && <div className="form-notice" role="status">{notice}</div>}

        <div className="form-content">
          {activeTab === 2 ? (
            <section className="facility-section">
              <div className="section-heading">Facilities</div>
              <div className="list-toolbar">
                <span />
                <button className="small-action-button add-button" type="button" onClick={addFacility}>+ Add</button>
              </div>
              <div className="table-scroll">
                <table className="facility-table">
                  <thead><tr><th>Sr. No.</th><th>Particulars</th><th>Upto Amount (Rs.)</th><th>Remarks</th><th>View</th><th>Edit</th><th>Remove</th></tr></thead>
                  <tbody>
                    {facilities.map((facility, index) => (
                      <tr key={facility.id}>
                        <td>{index + 1}</td>
                        <td>
                          {editingFacility?.id === facility.id ? (
                            <input
                              className="table-input"
                              aria-label={`${facility.name || 'New facility'} particulars`}
                              value={editingFacility.name}
                              aria-invalid={errors[`facility-${facility.id}`] === 'Particulars are required.'}
                              onChange={(event) => {
                                const updated = { ...editingFacility, name: event.target.value }
                                setEditingFacility(updated)
                                setErrors((current) => {
                                  const next = { ...current }
                                  delete next[`facility-${facility.id}`]
                                  return next
                                })
                              }}
                            />
                          ) : facility.name}
                          {errors[`facility-${facility.id}`] === 'Particulars are required.' && <span className="field-error table-error">{errors[`facility-${facility.id}`]}</span>}
                        </td>
                        <td>
                          {editingFacility?.id === facility.id ? (
                            <input className="table-input amount-input" aria-label={`${facility.name || 'New facility'} upto amount`} type="number" min="0" step="0.01" value={editingFacility.amount} onChange={(event) => {
                                const updated = { ...editingFacility, amount: event.target.value }
                                setEditingFacility(updated)
                                setErrors((current) => {
                                  const next = { ...current }
                                  delete next[`facility-${facility.id}`]
                                  return next
                                })
                              }} aria-invalid={errors[`facility-${facility.id}`] === 'Amount must be a non-negative number.'} />
                          ) : facility.amount || '—'}
                          {errors[`facility-${facility.id}`] === 'Amount must be a non-negative number.' && <span className="field-error table-error">{errors[`facility-${facility.id}`]}</span>}
                        </td>
                        <td>{editingFacility?.id === facility.id ? <input className="table-input" aria-label={`${facility.name || 'New facility'} remarks`} value={editingFacility.remarks} onChange={(event) => setEditingFacility({ ...editingFacility, remarks: event.target.value })} /> : facility.remarks || '—'}</td>
                        <td><button className="row-action" type="button" onClick={() => setViewFacility(facility)}>View</button></td>
                        <td>{editingFacility?.id === facility.id ? <button className="row-action" type="button" onClick={saveFacility}>Save</button> : <button className="row-action" type="button" onClick={() => setEditingFacility({ ...facility })}>Edit</button>}</td>
                        <td><button className="row-action delete-action" type="button" onClick={() => {
                          if (window.confirm(`Remove the ${facility.name || 'new'} facility row?`)) removeFacility(facility.id)
                        }}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : activeTab === 3 ? (
            <section className="address-section">
              <div className="address-subtabs" role="tablist" aria-label="Address sections">
                <button type="button" role="tab" aria-selected={addressSubtab === 'address'} className={`address-subtab ${addressSubtab === 'address' ? 'active' : ''}`} onClick={() => setAddressSubtab('address')}>Address Details</button>
                <button type="button" role="tab" aria-selected={addressSubtab === 'phone'} className={`address-subtab ${addressSubtab === 'phone' ? 'active' : ''}`} onClick={() => setAddressSubtab('phone')}>Phone/Mail Details</button>
              </div>
              {addressSubtab === 'address' ? (
                <div className="address-details-panel" role="tabpanel">
                  <div className="list-toolbar">
                    <span>Address entries</span>
                    <button className="small-action-button add-button" type="button" onClick={addAddress}>+ Add</button>
                  </div>
                  <div className="address-entry-list">
                    {addressRows.map((address, index) => (
                      <section className="address-entry" key={address.id} aria-label={`Address entry ${index + 1}`}>
                        <div className="address-entry-heading">
                          <strong>Address {index + 1}</strong>
                          <button className="small-action-button remove-button" type="button" onClick={() => removeAddress(address.id)}>Remove</button>
                        </div>
                        <div className="field-grid">
                          {addressFields.map((field) => {
                            const errorKey = `address-${address.id}-${field.name}`
                            return (
                              <FormField
                                key={field.name}
                                field={field}
                                value={address[field.name]}
                                error={errors[errorKey]}
                                idPrefix={`address-${address.id}-`}
                                onChange={(name, value) => updateAddress(address.id, name, value)}
                                onBlur={() => validateAddressField(address.id)}
                                onAction={validateIdentityFormat}
                              />
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              ) : (
                <section className="phone-mail-panel" role="tabpanel">
                  <div className="section-heading">Phone/Mail Details</div>
                  <div className="field-grid phone-mail-grid">
                    {fieldGroups[3][0].fields
                      .filter((field) => ['addressMobile', 'addressEmail'].includes(field.name))
                      .map((field) => (
                        <FormField
                          key={field.name}
                          field={field}
                          value={values[field.name]}
                          error={errors[field.name]}
                          onChange={setField}
                          onBlur={validateField}
                          onAction={validateIdentityFormat}
                        />
                      ))}
                  </div>
                </section>
              )}
            </section>
          ) : activeTab === 7 ? (
            <DocumentUpload files={files} errors={documentErrors} onChoose={chooseFile} onRemove={removeDocument} />
          ) : renderFields(activeTab)}
          <div className="section-actions-row">
            <button className="action-button" type="button" onClick={validateCurrentSection}>OK</button>
          </div>
        </div>

        <div className="form-footer">
          <div className="footer-left">
            <button className="action-button primary" type="button" onClick={validateAll}>Submit</button>
            <button className="action-button secondary" type="button" onClick={clearForm}>Cancel</button>
          </div>
        </div>
      </section>

      {viewFacility && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setViewFacility(null)
        }}>
          <section className="facility-modal" role="dialog" aria-modal="true" aria-labelledby="facility-modal-title">
            <h2 id="facility-modal-title">Facility Details</h2>
            <dl><dt>Particulars</dt><dd>{viewFacility.name}</dd><dt>Upto Amount (Rs.)</dt><dd>{viewFacility.amount || '—'}</dd><dt>Remarks</dt><dd>{viewFacility.remarks || '—'}</dd></dl>
            <button className="action-button primary" type="button" onClick={() => setViewFacility(null)}>Close</button>
          </section>
        </div>
      )}
    </main>
  )
}
