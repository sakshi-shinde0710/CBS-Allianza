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
  'FATCA Details',
  'Documents Upload',
]

const fieldGroups = [
  [
    {
      title: 'Customer Information',
      fields: [
        { name: 'customerName', label: 'Customer Name', required: true },
        { name: 'salutation', label: 'Salutation', type: 'select', options: ['Mr.', 'Ms.', 'Mrs.', 'Dr.'] },
        { name: 'firstName', label: 'First Name' },
        { name: 'middleName', label: 'Middle Name' },
        { name: 'lastName', label: 'Last Name' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { name: 'age', label: 'Age', type: 'readonly' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
        { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Widowed', 'Divorced'] },
        { name: 'nationality', label: 'Nationality', type: 'select', options: ['Indian', 'Other'] },
        { name: 'residentialStatus', label: 'Residential Status', type: 'select', options: ['Resident Individual', 'Non-Resident Indian', 'Foreign National'] },
        { name: 'customerStatus', label: 'Customer Status', type: 'select', options: ['Active', 'Inactive', 'Prospect'] },
      ],
    },
    {
      title: 'Family Details',
      fields: [
        { name: 'fatherName', label: "Father's Name" },
        { name: 'motherName', label: "Mother's Name" },
        { name: 'spouseName', label: "Spouse's Name" },
        { name: 'guardianName', label: 'Guardian Name' },
        { name: 'dependents', label: 'Number of Dependents', type: 'number', min: 0 },
      ],
    },
    {
      title: 'Identity & Contact Details',
      fields: [
        { name: 'pan', label: 'PAN', maxLength: 10 },
        { name: 'aadhaar', label: 'Aadhaar Number', maxLength: 12, inputMode: 'numeric' },
        { name: 'passportNo', label: 'Passport Number' },
        { name: 'passportIssueDate', label: 'Passport Issue Date', type: 'date' },
        { name: 'passportExpiryDate', label: 'Passport Expiry Date', type: 'date' },
        { name: 'voterId', label: 'Voter ID' },
        { name: 'drivingLicense', label: "Driving Licence No." },
        { name: 'mobile', label: 'Mobile Number', required: true, maxLength: 10, inputMode: 'numeric' },
        { name: 'alternateMobile', label: 'Alternate Mobile', maxLength: 10, inputMode: 'numeric' },
        { name: 'email', label: 'Email Address', type: 'email' },
      ],
    },
  ],
  [
    {
      title: 'KYC Information',
      fields: [
        { name: 'kycName', label: 'KYC Name', required: true },
        { name: 'customerOpenDate', label: 'Customer Open Date', type: 'date', required: true },
        { name: 'kycRating', label: 'KYC Rating', type: 'select', options: ['Low', 'Medium', 'High'] },
        { name: 'pepIndicator', label: 'PEP Indicator', type: 'select', options: ['No', 'Yes', 'Related to PEP'] },
        { name: 'amlRating', label: 'AML Rating', type: 'select', options: ['Low', 'Medium', 'High'] },
        { name: 'ckycStatus', label: 'CKYC Status', type: 'select', options: ['Not Registered', 'Registered', 'Pending'] },
        { name: 'ckycNo', label: 'CKYC No.', inputMode: 'numeric', maxLength: 14 },
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
        { name: 'pinCode', label: 'PIN Code', maxLength: 6, inputMode: 'numeric' },
        { name: 'addressMobile', label: 'Mobile Number', maxLength: 10, inputMode: 'numeric' },
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
        { name: 'officePinCode', label: 'Office PIN Code', maxLength: 6, inputMode: 'numeric' },
        { name: 'employerContact', label: 'Employer Contact Details', maxLength: 10, inputMode: 'numeric' },
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
        { name: 'accountNumber', label: 'Account Number', inputMode: 'numeric' },
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

const initialFacilities = [
  { id: 1, name: 'SMS', amount: '', remarks: '' },
  { id: 2, name: 'Mobile Application', amount: '', remarks: '' },
  { id: 3, name: 'Cheque Book', amount: '', remarks: '' },
  { id: 4, name: 'Internet Banking', amount: '', remarks: '' },
  { id: 5, name: 'ATM', amount: '', remarks: '' },
  { id: 6, name: 'IMPS', amount: '', remarks: '' },
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
          <div className="bank-mark" aria-hidden="true">N</div>
          <strong>Name of the Bank</strong>
        </div>
        <div className="bank-meta"><span>Operation Date</span><strong>{date}</strong></div>
        <div className="bank-meta"><span>Branch</span><strong>—</strong></div>
        <div className="bank-meta"><span>User</span><strong>—</strong></div>
        <div className="bank-meta system-date"><span>System Date</span><strong>{date}</strong></div>
      </div>
      <div className="bank-titleline">
        <strong className="product-name">Nexora</strong>
        <strong className="screen-title">Individual Customer Master</strong>
        <span className="title-spacer" aria-hidden="true" />
      </div>
    </header>
  )
}

function FormField({ field, value, error, onChange }) {
  const common = {
    id: field.name,
    name: field.name,
    value: value ?? '',
    onChange: (event) => onChange(field.name, event.target.value),
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${field.name}-error` : undefined,
    maxLength: field.maxLength,
    inputMode: field.inputMode,
  }
  let control
  if (field.type === 'select') {
    control = (
      <select {...common}>
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
        type={field.type || 'text'}
        min={field.min}
        step={field.step}
        placeholder={field.type === 'date' ? '' : 'Enter'}
        onKeyDown={field.type === 'number' ? (event) => {
          if (['e', 'E', '+', '-'].includes(event.key)) event.preventDefault()
        } : undefined}
      />
    )
  }
  return (
    <div className={`field ${field.wide ? 'field-wide' : ''}`}>
      <label htmlFor={field.name}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
      {control}
      {error && <span className="field-error" id={`${field.name}-error`} role="alert">{error}</span>}
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
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [facilities, setFacilities] = useState(initialFacilities)
  const [editingFacility, setEditingFacility] = useState(null)
  const [viewFacility, setViewFacility] = useState(null)
  const [files, setFiles] = useState({})
  const [documentErrors, setDocumentErrors] = useState({})
  const [notice, setNotice] = useState('')

  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
    if (notice) setNotice('')
  }

  const checkTab = (tabIndex) => {
    const nextErrors = validatePage(tabIndex, values, facilities)
    setErrors((current) => {
      const updated = { ...current }
      Object.keys(updated).forEach((key) => {
        if (tabIndex !== 2 && !key.startsWith('facility-')) delete updated[key]
        else if (tabIndex === 2 && key.startsWith('facility-')) delete updated[key]
      })
      return { ...updated, ...nextErrors }
    })
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (checkTab(activeTab) && activeTab < tabs.length - 1) setActiveTab(activeTab + 1)
  }

  const goPrevious = () => {
    setNotice('')
    setActiveTab((current) => Math.max(0, current - 1))
  }

  const validateAll = () => {
    const combinedErrors = {}
    tabs.forEach((_, index) => Object.assign(combinedErrors, validatePage(index, values, facilities)))
    Object.entries(documentErrors).forEach(([name, message]) => {
      combinedErrors[`document-${name}`] = message
    })
    setErrors(combinedErrors)
    if (Object.keys(combinedErrors).length) {
      const firstInvalidTab = tabs.findIndex((_, index) =>
        Object.keys(validatePage(index, values, facilities)).length > 0 ||
        (index === 7 && Object.keys(documentErrors).length > 0),
      )
      setActiveTab(firstInvalidTab)
      setNotice('Please correct the highlighted fields before submitting.')
      return
    }
    setNotice('Validation complete. No backend is connected, so the form has not been submitted.')
  }

  const clearForm = () => {
    if (!window.confirm('Cancel this form and clear all entered information? This cannot be undone.')) return
    setActiveTab(0)
    setValues({})
    setErrors({})
    setFacilities(initialFacilities.map((facility) => ({ ...facility })))
    setFiles({})
    setDocumentErrors({})
    setNotice('')
  }

  const saveFacility = () => {
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

  const renderFields = (index) => fieldGroups[index].map((group) => (
    <section className="form-section" key={group.title}>
      <div className="section-heading">{group.title}</div>
      <div className="field-grid">
        {group.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={field.name === 'age' ? calculateAge(values.dateOfBirth) : values[field.name]}
            error={errors[field.name]}
            onChange={setField}
          />
        ))}
      </div>
    </section>
  ))

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
            <span className="tab-number">{String(index + 1).padStart(2, '0')}</span>
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
              <div className="facility-summary">
                <div><span>KYC Name</span><strong>{values.kycName || '—'}</strong></div>
                <div><span>Customer Open Date</span><strong>{values.customerOpenDate || '—'}</strong></div>
              </div>
              <div className="section-heading">Customer Facilities</div>
              <div className="table-scroll">
                <table className="facility-table">
                  <thead><tr><th>Sr. No.</th><th>Particulars</th><th>Upto Amount (Rs.)</th><th>Remarks</th><th>View</th><th>Edit</th><th>Delete</th></tr></thead>
                  <tbody>
                    {facilities.map((facility, index) => (
                      <tr key={facility.id}>
                        <td>{index + 1}</td>
                        <td>{facility.name}</td>
                        <td>
                          {editingFacility?.id === facility.id ? (
                            <>
                              <input className="table-input amount-input" aria-label={`${facility.name} upto amount`} type="number" min="0" step="0.01" value={editingFacility.amount} onChange={(event) => {
                                setEditingFacility({ ...editingFacility, amount: event.target.value })
                                setErrors((current) => {
                                  const next = { ...current }
                                  delete next[`facility-${facility.id}`]
                                  return next
                                })
                              }} />
                            </>
                          ) : facility.amount || '—'}
                          {errors[`facility-${facility.id}`] && <span className="field-error table-error">{errors[`facility-${facility.id}`]}</span>}
                        </td>
                        <td>{editingFacility?.id === facility.id ? <input className="table-input" aria-label={`${facility.name} remarks`} value={editingFacility.remarks} onChange={(event) => setEditingFacility({ ...editingFacility, remarks: event.target.value })} /> : facility.remarks || '—'}</td>
                        <td><button className="row-action" type="button" onClick={() => setViewFacility(facility)}>View</button></td>
                        <td>{editingFacility?.id === facility.id ? <button className="row-action" type="button" onClick={saveFacility}>Save</button> : <button className="row-action" type="button" onClick={() => setEditingFacility({ ...facility })}>Edit</button>}</td>
                        <td><button className="row-action delete-action" type="button" onClick={() => {
                          if (window.confirm(`Delete the ${facility.name} facility?`)) {
                            setFacilities((current) => current.filter((item) => item.id !== facility.id))
                            if (editingFacility?.id === facility.id) setEditingFacility(null)
                          }
                        }}>Delete</button></td>
                      </tr>
                    ))}
                    {!facilities.length && <tr><td className="empty-table" colSpan="7">No facilities are available.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          ) : activeTab === 7 ? (
            <DocumentUpload files={files} errors={documentErrors} onChoose={chooseFile} onRemove={removeDocument} />
          ) : renderFields(activeTab)}
        </div>

        <div className="form-footer">
          <button className="action-button secondary" type="button" onClick={goPrevious} disabled={activeTab === 0}>Previous</button>
          <div className="footer-center">
            <button className="action-button" type="button" onClick={() => {
              if (checkTab(activeTab)) setNotice(`${tabs[activeTab]} details are valid.`)
              else setNotice('Please correct the highlighted fields.')
            }}>OK</button>
            {activeTab < tabs.length - 1 && <button className="action-button primary" type="button" onClick={goNext}>Next</button>}
          </div>
          <div className="footer-right">
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
