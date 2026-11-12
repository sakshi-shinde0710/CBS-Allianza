import { useEffect, useMemo, useState } from 'react'
import { calculateAge, validatePage } from './validation.js'
import './IndividualCustomerMaster.css'

const tabs = [
  'Basic Info',
  'KYC Details',
  'Facilities',
  'Address',
  'Employment Details',
  'Networth',
  'Fatca Details',
  'Documents Upload',
]

const kycNameField = {
  name: 'kycName',
  label: 'KYC Name',
  parts: ['kycTitle', 'kycFirstName', 'kycMiddleName', 'kycLastName'],
  titleOptions: true,
}

const customerOpenDateField = {
  name: 'customerOpenDate',
  label: 'Customer Open Date',
  type: 'date',
}

const contextFields = [kycNameField, customerOpenDateField]

const basicFields = [
  { name: 'customerNo', label: 'Customer No', type: 'digits' },
  { name: 'homeBranch', label: 'Home Branch' },
  { name: 'groupCustomerNo', label: 'Group Customer No', type: 'digits' },
  kycNameField,
  { name: 'aliasName', label: 'Alias Name' },
  { name: 'dateOfBirth', label: 'DOB', type: 'date' },
  { name: 'age', label: 'Age', type: 'readonly' },
  { name: 'placeOfBirth', label: 'Place of Birth' },
  { name: 'pan', label: 'PAN Card', maxLength: 10, action: 'Validate' },
  { name: 'aadhaar', label: 'Aadhar Card', type: 'digits', maxLength: 12, action: 'Validate' },
  { name: 'customerType', label: 'Customer Type', type: 'select', options: ['Individual', 'Sole Proprietor'] },
  { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
  { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Widowed', 'Divorced'] },
  { name: 'physicalStatus', label: 'Physical Status', type: 'select', options: ['Normal', 'Visually Impaired', 'Hearing Impaired', 'Other'] },
  { name: 'religion', label: 'Religion', type: 'select', options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'] },
  { name: 'caste', label: 'Caste' },
  { name: 'scCategory', label: 'SC Category', type: 'select', options: ['Yes', 'No'] },
  { name: 'minorIndicator', label: 'Minor Indicator', type: 'select', options: ['Yes', 'No'] },
  { name: 'fatherName', label: 'Father’s Name', parts: ['fatherTitle', 'fatherFirstName', 'fatherMiddleName', 'fatherLastName'], titleOptions: true },
  { name: 'motherName', label: 'Mother’s Name', parts: ['motherTitle', 'motherFirstName', 'motherMiddleName', 'motherLastName'], titleOptions: true },
  { name: 'minorTurnedMajorOn', label: 'Minor turned Major on', type: 'date' },
  { name: 'resident', label: 'Resident', type: 'select', options: ['Yes', 'No'] },
  { name: 'residentialStatus', label: 'Residential Status', type: 'select', options: ['Resident Individual', 'Non-Resident Indian', 'Foreign National'] },
  { name: 'passportNo', label: 'Passport No' },
  { name: 'passportIssueDate', label: 'Issue Date', type: 'date' },
  { name: 'passportExpiryDate', label: 'Expiry Date', type: 'date' },
  { name: 'seniorCitizen', label: 'Sr. Citizen', type: 'select', options: ['Yes', 'No'] },
  { name: 'staffIndicator', label: 'Staff Indicator', type: 'select', options: ['Yes', 'No'] },
  { name: 'employeeId', label: 'Employee ID' },
  { name: 'noOfChildren', label: 'No of Children', type: 'digits' },
  { name: 'spouseName', label: 'Spouse Name', parts: ['spouseTitle', 'spouseFirstName', 'spouseMiddleName', 'spouseLastName'], titleOptions: true },
  { name: 'dependents', label: 'No of Dependents', type: 'digits' },
  { name: 'educationQualification', label: 'Education Qualification', type: 'select', options: ['Primary', 'Secondary', 'Graduate', 'Post Graduate', 'Other'] },
  { name: 'nationality', label: 'Nationality', type: 'select', options: ['Indian', 'Other'] },
  { name: 'customerStatus', label: 'Customer Status', type: 'select', options: ['Active', 'Inactive', 'Prospect'] },
  { name: 'tdsFlag', label: 'TDS Flag', type: 'select', options: ['Yes', 'No'] },
  { name: 'form121SubmissionDate', label: 'Form 121 Submission Date', type: 'date' },
]

const basicRows = [
  ['customerNo', 'homeBranch', 'groupCustomerNo'],
  ['kycName', 'basicActions', 'pan'],
  ['aliasName', null, 'aadhaar'],
  ['dateOfBirth', 'age', 'placeOfBirth'],
  ['fatherName', 'motherName', 'gender'],
  ['customerType', 'maritalStatus', 'physicalStatus'],
  ['religion', 'scCategory', 'caste'],
  ['passportNo', 'passportIssueDate', 'passportExpiryDate'],
  ['seniorCitizen', 'staffIndicator', 'employeeId'],
  ['spouseName', 'minorIndicator', 'minorTurnedMajorOn'],
  ['noOfChildren', 'dependents', 'resident'],
  ['residentialStatus', 'customerStatus', 'nationality'],
  ['educationQualification', 'tdsFlag', 'form121SubmissionDate'],
]

const kycFields = [
  { name: 'kycRating', label: 'KYC Rating', type: 'select', options: ['Low', 'Medium', 'High'] },
  { name: 'pepIndicator', label: 'PEP Indicator', type: 'select', options: ['No', 'Yes', 'Related to PEP'] },
  { name: 'amlRating', label: 'AML Rating', type: 'select', options: ['Low', 'Medium', 'High'] },
  { name: 'ckycStatus', label: 'CKYC Status', type: 'select', options: ['Not Registered', 'Registered', 'Pending'] },
  { name: 'ckycNo', label: 'CKYC No', type: 'digits', maxLength: 14 },
  { name: 'kycDate', label: 'KYC Date', type: 'date' },
  { name: 'nextKycReviewDate', label: 'Next KYC Review Date', type: 'date' },
  { name: 'riskProfileExpiryDate', label: 'Risk Profile Expiry Date', type: 'date' },
  { name: 'kycCompliant', label: 'KYC Compliant Indicator', type: 'select', options: ['Yes', 'No'] },
]

const facilityContext = contextFields

const addressFields = [
  { name: 'addressType', label: 'Address Type', type: 'select', options: ['Residential', 'Permanent', 'Communication', 'Office'] },
  { name: 'addressValidFrom', label: 'Address Valid from', type: 'date' },
  { name: 'addressNoOfYears', label: 'No of yrs', type: 'digits' },
  { name: 'flatHouseNo', label: 'Flat / House No' },
  { name: 'roadStreetName', label: 'Road / Street Name' },
  { name: 'landmark', label: 'Landmark' },
  { name: 'town', label: 'Town' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'pinCode', label: 'PinCode', type: 'digits', maxLength: 6, inputMode: 'numeric' },
  { name: 'country', label: 'Country', type: 'select', options: ['India', 'Other'] },
]

const phoneFields = [
  { name: 'registeredMobile', label: 'Registered Mobile', type: 'digits', maxLength: 10, inputMode: 'numeric' },
  { name: 'alternateMobile', label: 'Alternate Mobile', type: 'digits', maxLength: 10, inputMode: 'numeric' },
  { name: 'personalMailId', label: 'Personal Mail ID', type: 'email' },
]

const employmentFields = [
  { name: 'occupation', label: 'Occupation' },
  { name: 'designation', label: 'Designation' },
  { name: 'workExperience', label: 'No of years of service', type: 'number', min: 0, step: '0.1' },
  { name: 'employerName', label: 'Name of the Employer' },
  { name: 'employerLocation', label: 'Location' },
  { name: 'employeeCode', label: 'Employee Code' },
  { name: 'natureOfBusiness', label: 'Nature of Business' },
  { name: 'entityRegistered', label: 'Entity Registered', type: 'select', options: ['Yes', 'No'] },
  { name: 'companyMailId', label: 'Company Mail ID', type: 'email' },
]

const networthFields = [
  { name: 'networthDesignation', label: 'Designation' },
  { name: 'grossIncome', label: 'Gross Income', type: 'number', min: 0, step: '0.01' },
  { name: 'netIncome', label: 'Net Income', type: 'number', min: 0, step: '0.01' },
  { name: 'sourceOfIncome', label: 'Source of Income' },
  { name: 'additionalIncome', label: 'Additional Income', type: 'number', min: 0, step: '0.01' },
  { name: 'totalIncome', label: 'Total Income', type: 'number', min: 0, step: '0.01' },
  { name: 'networthRs', label: 'Networth Rs.', type: 'number', min: 0, step: '0.01' },
  { name: 'totalOutgoings', label: 'Total Outgoings', type: 'number', min: 0, step: '0.01' },
]

const fatcaFields = [
  { name: 'countryOfBirth', label: 'Country of Birth', type: 'select', options: ['India', 'Other'] },
  { name: 'placeOfBirthFatca', label: 'Place of Birth' },
  { name: 'fatcaNationality', label: 'Nationality', type: 'select', options: ['Indian', 'Other'] },
  { name: 'cityOfBirth', label: 'City of Birth' },
  { name: 'citizenship', label: 'Citizenship' },
  { name: 'countryOfResidence', label: 'Country of Residence', type: 'select', options: ['India', 'Other'] },
]

const fieldGroups = [
  [{ fields: basicFields }],
  [{ fields: [...contextFields, ...kycFields] }],
  [{ fields: facilityContext }],
  [{ fields: [...contextFields, ...addressFields, ...phoneFields] }],
  [{ fields: [...contextFields, ...employmentFields] }],
  [{ fields: [...contextFields, ...networthFields] }],
  [{ fields: [...contextFields, ...fatcaFields] }],
  [{ fields: contextFields }],
]

const createRows = (count) => Array.from({ length: count }, (_, index) => ({ id: index + 1 }))
const createFacilityRows = () => []

export function BankingHeader({
  pageTitle,
  searchValue,
  searchMessage,
  onSearchChange,
  onSearch,
}) {
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
        <strong className="product-name">NexCore</strong>
        <strong className="screen-title">{pageTitle}</strong>
        <form className="header-search" onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}>
          <div className="header-search-controls">
            <input
              type="search"
              aria-label="Search pages"
              placeholder="Search pages"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button type="submit">Go</button>
          </div>
          {searchMessage && <span className="header-search-message" role="status">{searchMessage}</span>}
        </form>
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
              <option value=""> </option>
              {['Mr.', 'Mrs.', 'Miss.', 'Ms.', 'Dr.'].map((title) => <option key={title} value={title}>{title}</option>)}
            </select>
          ) : (
            <input
              key={part}
              id={`${idPrefix}${part}`}
              name={part}
              value={value?.[part] ?? ''}
              maxLength={field.partMaxLength}
              placeholder=""
              aria-label={`${field.label} ${['first', 'middle', 'last'][index - (field.titleOptions ? 1 : 0)] || index + 1}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${idPrefix}${field.name}-error` : undefined}
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
    control = <input {...common} readOnly placeholder="" />
  } else {
    control = (
      <input
        {...common}
        type={field.type === 'digits' ? 'text' : field.type || 'text'}
        inputMode={field.type === 'digits' ? 'numeric' : field.inputMode}
        min={field.min}
        step={field.step}
        placeholder=""
        onChange={field.type === 'digits' ? (event) => onChange(field.name, event.target.value.replace(/\D/g, '')) : common.onChange}
        onKeyDown={field.type === 'number' || field.type === 'digits' ? (event) => {
          if (['e', 'E', '+', '-'].includes(event.key)) event.preventDefault()
        } : undefined}
      />
    )
  }
  return (
    <div className={`field ${field.wide ? 'field-wide' : ''} ${field.parts ? 'field-multipart' : ''} ${field.name === 'kycName' ? 'field-kyc-name' : ''} ${compact ? 'compact-field' : ''}`}>
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

function DocumentUpload({ rows, files, errors, onFieldChange, onChoose, onRemove, onAdd }) {
  const previews = useMemo(() => {
    const urls = {}
    Object.entries(files).forEach(([id, file]) => {
      if (file.type.startsWith('image/')) urls[id] = URL.createObjectURL(file)
      else if (file.type === 'application/pdf') urls[id] = URL.createObjectURL(file)
    })
    return urls
  }, [files])

  useEffect(() => () => Object.values(previews).forEach((url) => URL.revokeObjectURL(url)), [previews])

  return (
    <div className="documents-panel">
      <div className="document-toolbar">
        <span />
        <button className="small-action-button add-button" type="button" onClick={onAdd}>Add Row</button>
      </div>
      <p className="form-note">Accepted formats: PDF, JPG, JPEG, PNG. Maximum file size: 5 MB per file.</p>
      <div className="table-scroll">
        <table className="document-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Document Name</th>
              <th>Document Number</th>
              <th>Date of issue</th>
              <th>Place of Issue</th>
              <th>Date of Expiry</th>
              <th>Remarks</th>
              <th>Upload</th>
              <th>View</th>
              <th>Remove Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const file = files[row.id]
              const errorId = `document-${row.id}-error`
              return (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  {[
                    ['documentName', 'Document Name', 'text'],
                    ['documentNumber', 'Document Number', 'text'],
                    ['issueDate', 'Date of issue', 'date'],
                    ['placeOfIssue', 'Place of Issue', 'text'],
                    ['expiryDate', 'Date of Expiry', 'date'],
                    ['remarks', 'Remarks', 'text'],
                  ].map(([name, label, type]) => (
                    <td key={name}>
                      <input
                        className="table-input"
                        type={type}
                        aria-label={`${label}, row ${index + 1}`}
                        value={row[name] ?? ''}
                        onChange={(event) => onFieldChange(row.id, name, event.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <label className="upload-button" htmlFor={`document-upload-${row.id}`}>Upload</label>
                    <input
                      className="visually-hidden"
                      id={`document-upload-${row.id}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={(event) => {
                        onChoose(row.id, event.target.files?.[0])
                        event.target.value = ''
                      }}
                      aria-describedby={errors[row.id] ? errorId : undefined}
                    />
                    {errors[row.id] && <span className="field-error document-error" id={errorId} role="alert">{errors[row.id]}</span>}
                    {file && <span className="selected-file" title={file.name}>{file.name}</span>}
                  </td>
                  <td>
                    <button
                      className="row-action"
                      type="button"
                      disabled={!file}
                      onClick={() => window.open(previews[row.id], '_blank', 'noopener,noreferrer')}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    {file && <button className="text-button remove-button" type="button" onClick={() => {
                      if (window.confirm('Are you sure you want to remove this document?')) onRemove(row.id)
                    }}>Remove</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function IndividualCustomerMaster({
  searchValue,
  searchMessage,
  onSearchChange,
  onSearch,
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [addressSubtab, setAddressSubtab] = useState('address')
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [facilities, setFacilities] = useState(createFacilityRows)
  const [addressRows, setAddressRows] = useState([{ id: 1 }])
  const [assetRows, setAssetRows] = useState(createRows(2))
  const [loanRows, setLoanRows] = useState(createRows(2))
  const [documentRows, setDocumentRows] = useState([])
  const [nextFacilityId, setNextFacilityId] = useState(1)
  const [nextAddressId, setNextAddressId] = useState(2)
  const [nextDocumentId, setNextDocumentId] = useState(1)
  const [editingAssetId, setEditingAssetId] = useState(null)
  const [editingLoanId, setEditingLoanId] = useState(null)
  const [editingFacility, setEditingFacility] = useState(null)
  const [viewFacility, setViewFacility] = useState(null)
  const [files, setFiles] = useState({})
  const [documentErrors, setDocumentErrors] = useState({})
  const [notice, setNotice] = useState('')

  const setField = (name, value) => {
    const formattedValue = name === 'pan' ? value.toUpperCase() : value
    const nextValues = { ...values, [name]: formattedValue }
    setValues(nextValues)
    const updatedErrors = validatePage(activeTab, nextValues, facilities, addressRows, assetRows, loanRows)
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
    const fieldErrors = validatePage(activeTab, values, facilities, addressRows, assetRows, loanRows)
    setErrors((current) => {
      const next = { ...current }
      if (fieldErrors[name]) next[name] = fieldErrors[name]
      else delete next[name]
      return next
    })
  }

  const validateIdentityFormat = (name) => {
    const fieldErrors = validatePage(0, values, facilities, addressRows, assetRows, loanRows)
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
    const nextErrors = validatePage(tabIndex, values, facilities, addressRows, assetRows, loanRows)
    if (tabIndex === 7) {
      Object.entries(documentErrors).forEach(([id, message]) => {
        nextErrors[`document-${id}`] = message
      })
    }
    const pageFields = new Set(tabIndex === 2
      ? facilities.map((facility) => `facility-${facility.id}`)
      : tabIndex === 3
        ? [
            ...addressRows.flatMap((address) => Object.keys(address).filter((key) => key !== 'id').map((key) => `address-${address.id}-${key}`)),
            ...phoneFields.map((field) => field.name),
            ...contextFields.flatMap((field) => [field.name, ...(field.parts || [])]),
          ]
        : tabIndex === 5
          ? [
              ...assetRows.flatMap((asset) => [`asset-${asset.id}-valueAsOfDate`]),
              ...loanRows.flatMap((loan) => [`loan-${loan.id}-loanAmount`, `loan-${loan.id}-emi`]),
              ...fieldGroups[tabIndex].flatMap((group) => group.fields.flatMap((field) => [field.name, ...(field.parts || [])])),
            ]
          : tabIndex === 7
            ? [
                ...contextFields.flatMap((field) => [field.name, ...(field.parts || [])]),
                ...Object.keys(documentErrors).map((id) => `document-${id}`),
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
    tabs.forEach((_, index) => Object.assign(combinedErrors, validatePage(index, values, facilities, addressRows, assetRows, loanRows)))
    Object.entries(documentErrors).forEach(([id, message]) => {
      combinedErrors[`document-${id}`] = message
    })
    setErrors(combinedErrors)
    if (Object.keys(combinedErrors).length) {
      const firstInvalidTab = tabs.findIndex((_, index) =>
        Object.keys(validatePage(index, values, facilities, addressRows, assetRows, loanRows)).length > 0 ||
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
    const defaultFacilities = createFacilityRows()
    const facilitiesChanged = facilities.length !== defaultFacilities.length ||
      facilities.some((facility, index) =>
        ['name', 'amount', 'remarks'].some((key) => facility[key] !== defaultFacilities[index]?.[key]),
      )
    const hasEnteredData = Object.values(values).some(Boolean) ||
      Object.keys(files).length > 0 ||
      facilitiesChanged ||
      addressRows.length > 1 ||
      addressRows.some((address) => Object.entries(address).some(([key, value]) => key !== 'id' && Boolean(value))) ||
      [assetRows, loanRows, documentRows].some((rows) =>
        rows.some((row) => Object.entries(row).some(([key, value]) => key !== 'id' && Boolean(value))),
      )
    if (hasEnteredData && !window.confirm('Cancel this form and clear all entered information? This cannot be undone.')) return
    setActiveTab(0)
    setValues({})
    setErrors({})
    setFacilities(createFacilityRows())
    setAddressRows([{ id: 1 }])
    setAssetRows(createRows(2))
    setLoanRows(createRows(2))
    setDocumentRows([])
    setNextFacilityId(1)
    setNextAddressId(2)
    setNextDocumentId(1)
    setEditingAssetId(null)
    setEditingLoanId(null)
    setEditingFacility(null)
    setViewFacility(null)
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
    const addressErrors = validatePage(3, values, facilities, updatedRows, assetRows, loanRows)
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
    const addressErrors = validatePage(3, values, facilities, addressRows, assetRows, loanRows)
    setErrors((current) => {
      const next = { ...current }
      Object.keys(next).filter((key) => key.startsWith(`address-${id}-`)).forEach((key) => delete next[key])
      Object.entries(addressErrors)
        .filter(([key]) => key.startsWith(`address-${id}-`))
        .forEach(([key, message]) => { next[key] = message })
      return next
    })
  }

  const updateDocumentField = (id, name, value) => {
    setDocumentRows((current) => current.map((row) => row.id === id ? { ...row, [name]: value } : row))
  }

  const addDocumentRow = () => {
    setDocumentRows((current) => [...current, { id: nextDocumentId }])
    setNextDocumentId((current) => current + 1)
  }

  const removeDocument = (id) => {
    setDocumentRows((current) => current.filter((row) => row.id !== id))
    setFiles((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
    setDocumentErrors((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const chooseFile = (id, file) => {
    if (!file) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    const allowed = ['pdf', 'jpg', 'jpeg', 'png']
    if (!allowed.includes(extension) || (file.type && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type))) {
      setDocumentErrors((current) => ({ ...current, [id]: 'Choose a PDF, JPG, JPEG, or PNG file.' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setDocumentErrors((current) => ({ ...current, [id]: 'File must be 5 MB or smaller.' }))
      return
    }
    setFiles((current) => ({ ...current, [id]: file }))
    setDocumentErrors((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const updateNetworthRow = (setter, prefix, id, name, value) => {
    setter((current) => current.map((row) => row.id === id ? { ...row, [name]: value } : row))
    setErrors((current) => {
      const next = { ...current }
      delete next[`${prefix}-${id}-${name}`]
      return next
    })
  }

  const clearCurrentPage = () => {
    if (activeTab === 3 && addressSubtab === 'address') {
      setAddressRows([{ id: 1 }])
      setNextAddressId(2)
    } else if (activeTab === 5) {
      setAssetRows(createRows(2))
      setLoanRows(createRows(2))
      setEditingAssetId(null)
      setEditingLoanId(null)
      const keys = new Set(networthFields.map((field) => field.name))
      setValues((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !keys.has(key))))
    } else {
      const fieldsToClear = activeTab === 3
        ? phoneFields
        : fieldGroups[activeTab]?.flatMap((group) => group.fields) || []
      const keys = new Set(fieldsToClear.flatMap((field) => [field.name, ...(field.parts || [])]))
      setValues((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !keys.has(key))))
    }
    setErrors({})
    setNotice('')
  }

  const submitCurrentPage = () => {
    if (checkTab(activeTab)) setNotice(`${tabs[activeTab]} details are valid.`)
    else setNotice('Please correct the highlighted fields.')
  }

  const renderGroupField = (field, compact = false, value = undefined, onChange = setField, onBlur = validateField, idPrefix = '') => (
    <FormField
      key={field.name}
      field={field}
      value={value !== undefined
        ? value
        : field.name === 'age'
          ? calculateAge(values.dateOfBirth)
          : field.parts
            ? values
            : values[field.name]}
      error={errors[field.name]}
      onChange={onChange}
      onBlur={onBlur}
      onAction={validateIdentityFormat}
      compact={compact}
      reserveError={compact}
      idPrefix={idPrefix}
    />
  )

  const renderCustomerContext = () => (
    <div className="customer-context">
      {contextFields.map((field) => renderGroupField(field))}
    </div>
  )

  const renderBasicFields = () => {
    const fieldsByName = new Map(basicFields.map((field) => [field.name, field]))
    return (
      <>
        <div className="basic-grid">
          {basicRows.map((row, rowIndex) => (
            <div className="basic-row" key={`basic-row-${rowIndex + 1}`}>
              {row.map((name, columnIndex) => {
                if (!name) return <span className="basic-slot" key={`empty-${columnIndex}`} />
                if (name === 'basicActions') {
                  return (
                    <div className="basic-check-actions" key={name}>
                      <button className="small-action-button" type="button" onClick={() => setNotice('Duplicate check requires a connected customer service. No lookup was performed.')}>Duplicate Check</button>
                      <button className="small-action-button" type="button" onClick={() => setNotice('Blacklist check requires a connected screening service. No lookup was performed.')}>Blacklist Check</button>
                    </div>
                  )
                }
                return renderGroupField(fieldsByName.get(name))
              })}
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderFields = (index) => {
    if (index === 0) return renderBasicFields()

    const renderPageFields = (fields, className = 'field-grid') => (
      <div className={className}>{fields.map((field) => renderGroupField(field))}</div>
    )

    if (index === 1) {
      return (
        <>
          {renderCustomerContext()}
          <div className="kyc-columns">
            {renderPageFields(kycFields.slice(0, 4))}
            {renderPageFields(kycFields.slice(4))}
          </div>
        </>
      )
    }

    if (index === 4) {
      return (
        <>
          {renderCustomerContext()}
          {renderPageFields(employmentFields, 'field-grid employment-grid')}
        </>
      )
    }

    if (index === 5) {
      const topFields = networthFields.slice(0, 5)
      const totalFields = networthFields.slice(5)
      const assetColumns = [
        ['description', 'Asset Description'],
        ['valueAsOfDate', 'Value as on Date'],
      ]
      const loanColumns = [
        ['bankName', 'Bank Name'],
        ['loanType', 'Loan Type'],
        ['loanAmount', 'Loan Amount'],
        ['emi', 'EMI'],
      ]
      return (
        <>
          {renderCustomerContext()}
          <div className="networth-content">
            {renderPageFields(topFields, 'field-grid networth-entry-grid')}
            <div className="table-scroll">
              <table className="networth-table asset-table">
                <thead><tr><th>Sr</th><th>Asset Description</th><th>Value as on Date</th><th>Edit</th><th>Delete</th></tr></thead>
                <tbody>
                  {assetRows.map((row, indexInTable) => (
                    <tr key={row.id}>
                      <td>{indexInTable + 1}</td>
                      {assetColumns.map(([name, label]) => (
                        <td key={name}>
                          <input
                            className="table-input"
                            aria-label={`${label}, asset ${indexInTable + 1}`}
                            type={name === 'valueAsOfDate' ? 'date' : 'text'}
                            value={row[name] ?? ''}
                            disabled={editingAssetId !== row.id}
                            aria-invalid={Boolean(errors[`asset-${row.id}-valueAsOfDate`])}
                            onChange={(event) => updateNetworthRow(setAssetRows, 'asset', row.id, name, event.target.value)}
                          />
                          {errors[`asset-${row.id}-valueAsOfDate`] && <span className="field-error table-error" role="alert">{errors[`asset-${row.id}-valueAsOfDate`]}</span>}
                        </td>
                      ))}
                      <td><button className="row-action" type="button" onClick={() => setEditingAssetId(editingAssetId === row.id ? null : row.id)}>{editingAssetId === row.id ? 'Save' : 'Edit'}</button></td>
                      <td><button className="row-action delete-action" type="button" onClick={() => setAssetRows((current) => current.filter((asset) => asset.id !== row.id))}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-scroll">
              <table className="networth-table loan-table">
                <thead><tr><th>Sr</th><th>Bank Name</th><th>Loan Type</th><th>Loan Amount</th><th>EMI</th><th>Edit</th><th>Delete</th></tr></thead>
                <tbody>
                  {loanRows.map((row, indexInTable) => (
                    <tr key={row.id}>
                      <td>{indexInTable + 1}</td>
                      {loanColumns.map(([name, label]) => (
                        <td key={name}>
                          <input
                            className="table-input"
                            aria-label={`${label}, loan ${indexInTable + 1}`}
                            type={['loanAmount', 'emi'].includes(name) ? 'number' : 'text'}
                            min={['loanAmount', 'emi'].includes(name) ? '0' : undefined}
                            value={row[name] ?? ''}
                            disabled={editingLoanId !== row.id}
                            aria-invalid={Boolean(errors[`loan-${row.id}-${name}`])}
                            onChange={(event) => updateNetworthRow(setLoanRows, 'loan', row.id, name, event.target.value)}
                          />
                          {errors[`loan-${row.id}-${name}`] && <span className="field-error table-error" role="alert">{errors[`loan-${row.id}-${name}`]}</span>}
                        </td>
                      ))}
                      <td><button className="row-action" type="button" onClick={() => setEditingLoanId(editingLoanId === row.id ? null : row.id)}>{editingLoanId === row.id ? 'Save' : 'Edit'}</button></td>
                      <td><button className="row-action delete-action" type="button" onClick={() => setLoanRows((current) => current.filter((loan) => loan.id !== row.id))}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPageFields(totalFields, 'field-grid networth-total-grid')}
          </div>
        </>
      )
    }

    if (index === 6) {
      return (
        <>
          {renderCustomerContext()}
          {renderPageFields(fatcaFields, 'field-grid fatca-grid')}
        </>
      )
    }

    return null
  }

  return (
    <main className={`cif-app ${activeTab === 7 ? 'document-upload-page' : ''}`}>
      <BankingHeader
        pageTitle="Individual Customer Master"
        searchValue={searchValue}
        searchMessage={searchMessage}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
      />
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
        {notice && <div className="form-notice" role="status">{notice}</div>}

        <div className={`form-content form-content-page-${activeTab}`}>
          {activeTab === 2 ? (
            <>
              {renderCustomerContext()}
              <section className="facility-section">
                <div className="list-toolbar">
                  <span />
                  <button className="small-action-button add-button" type="button" onClick={addFacility}>+ Add</button>
                </div>
                <div className="table-scroll">
                  <table className="facility-table">
                    <thead><tr><th>Sr</th><th>Particulars</th><th>Upto Amount (Rs.)</th><th>Remarks</th><th>View</th><th>Edit</th><th>Delete</th></tr></thead>
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
                          }}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : activeTab === 3 ? (
            <>
              {renderCustomerContext()}
              <section className="address-section">
                <div className="address-subtabs" role="tablist" aria-label="Address sections">
                  <button type="button" role="tab" aria-selected={addressSubtab === 'address'} className={`address-subtab ${addressSubtab === 'address' ? 'active' : ''}`} onClick={() => setAddressSubtab('address')}>Address</button>
                  <button type="button" role="tab" aria-selected={addressSubtab === 'phone'} className={`address-subtab ${addressSubtab === 'phone' ? 'active' : ''}`} onClick={() => setAddressSubtab('phone')}>Phone / Email</button>
                </div>
                {addressSubtab === 'address' ? (
                  <div className="address-entry-list" role="tabpanel">
                    {addressRows.map((address, index) => (
                      <section className="address-entry" key={address.id} aria-label={`Address entry ${index + 1}`}>
                        {index > 0 && (
                          <div className="address-entry-heading">
                            <strong>Address {index + 1}</strong>
                            <button className="small-action-button remove-button" type="button" onClick={() => removeAddress(address.id)}>Remove</button>
                          </div>
                        )}
                        <div className="field-grid address-grid">
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
                    <div className="page-local-actions">
                      <button className="action-button" type="button" onClick={submitCurrentPage}>Submit</button>
                      <button className="action-button secondary" type="button" onClick={clearCurrentPage}>Clear</button>
                      <button className="small-action-button add-button" type="button" onClick={addAddress}>+ Add</button>
                    </div>
                  </div>
                ) : (
                  <div className="phone-mail-panel" role="tabpanel">
                    <div className="field-grid phone-mail-grid">
                      {phoneFields.map((field) => renderGroupField(field))}
                    </div>
                    <div className="page-local-actions">
                      <button className="action-button" type="button" onClick={submitCurrentPage}>Submit</button>
                      <button className="action-button secondary" type="button" onClick={clearCurrentPage}>Clear</button>
                    </div>
                  </div>
                )}
              </section>
            </>
          ) : activeTab === 7 ? (
            <>
              {renderCustomerContext()}
              <DocumentUpload
                rows={documentRows}
                files={files}
                errors={documentErrors}
                onFieldChange={updateDocumentField}
                onChoose={chooseFile}
                onRemove={removeDocument}
                onAdd={addDocumentRow}
              />
            </>
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
