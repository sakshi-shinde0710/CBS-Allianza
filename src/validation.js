export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

export const isValidPan = (value) =>
  /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.trim().toUpperCase())

export const isValidAadhaar = (value) => /^\d{12}$/.test(value)

export const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value)

export const isValidPin = (value) => /^\d{6}$/.test(value)

export const isValidIfsc = (value) =>
  /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase())

export const isValidCkyc = (value) => /^\d{14}$/.test(value)

export const calculateAge = (birthDate, today = new Date()) => {
  if (!birthDate) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return ''
  const date = new Date(`${birthDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  const [year, month, day] = birthDate.split('-').map(Number)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return ''
  let age = today.getFullYear() - date.getFullYear()
  const monthDifference = today.getMonth() - date.getMonth()
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < date.getDate())
  ) {
    age -= 1
  }
  return age >= 0 ? age : ''
}

const isValidDate = (value) => {
  if (!value) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

const isAfter = (later, earlier) =>
  !later || !earlier || new Date(`${later}T00:00:00`) > new Date(`${earlier}T00:00:00`)

const isValidName = (value) => /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(value.trim())

const nameFields = [
  'kycFirstName', 'kycMiddleName', 'kycLastName',
  'aliasName',
  'fatherFirstName', 'fatherMiddleName', 'fatherLastName',
  'motherFirstName', 'motherMiddleName', 'motherLastName',
  'spouseFirstName', 'spouseMiddleName', 'spouseLastName',
  'placeOfBirth',
]

export function validatePage(pageIndex, values, facilities = [], addresses = [], assets = [], loans = []) {
  const errors = {}
  const required = (key, label) => {
    if (!String(values[key] ?? '').trim()) errors[key] = `${label} is required.`
  }
  const validate = (key, predicate, message) => {
    if (values[key] && !predicate(values[key])) errors[key] = message
  }
  const date = (key, label, cannotBeFuture = false) => {
    if (values[key] && !isValidDate(values[key])) {
      errors[key] = `Enter a valid ${label.toLowerCase()}.`
    } else if (
      cannotBeFuture &&
      values[key] &&
      new Date(`${values[key]}T00:00:00`) > new Date(new Date().toDateString())
    ) {
      errors[key] = `${label} cannot be in the future.`
    }
  }
  const amount = (key, label) => {
    if (values[key] && (!/^\d+(\.\d{1,2})?$/.test(values[key]) || Number(values[key]) < 0)) {
      errors[key] = `${label} must be a non-negative number.`
    }
  }

  if (pageIndex === 0) {
    required('customerNo', 'Customer No')
    required('homeBranch', 'Home Branch')
    if (![values.kycFirstName, values.kycMiddleName, values.kycLastName].some((value) => value?.trim())) {
      errors.kycName = 'KYC Name is required.'
    }
    required('dateOfBirth', 'DOB')
    required('gender', 'Gender')
    date('dateOfBirth', 'DOB', true)
    date('minorTurnedMajorOn', 'Minor turned Major date', true)
    date('form121SubmissionDate', 'Form 121 submission date', true)
    if (
      values.minorTurnedMajorOn &&
      values.dateOfBirth &&
      new Date(`${values.minorTurnedMajorOn}T00:00:00`) <= new Date(`${values.dateOfBirth}T00:00:00`)
    ) {
      errors.minorTurnedMajorOn = 'This date must be later than date of birth.'
    }
    validate('pan', isValidPan, 'Enter a valid PAN (for example, ABCDE1234F).')
    validate('aadhaar', isValidAadhaar, 'Aadhaar must contain exactly 12 digits.')
    date('passportIssueDate', 'Issue date')
    date('passportExpiryDate', 'Passport expiry date')
    if (
      values.passportIssueDate &&
      values.passportExpiryDate &&
      !isAfter(values.passportExpiryDate, values.passportIssueDate)
    ) {
      errors.passportExpiryDate = 'Expiry date must be later than issue date.'
    }
    if (values.passportIssueDate && values.dateOfBirth && !isAfter(values.passportIssueDate, values.dateOfBirth)) {
      errors.passportIssueDate = 'Issue date must be later than date of birth.'
    }
    if (values.noOfChildren && !/^\d+$/.test(values.noOfChildren)) {
      errors.noOfChildren = 'No of Children must contain digits only.'
    }
    if (values.dependents && !/^\d+$/.test(values.dependents)) {
      errors.dependents = 'No of Dependents must contain digits only.'
    }
    nameFields.forEach((key) => {
      if (values[key] && !isValidName(values[key])) {
        const group = key.startsWith('kyc') ? 'kycName'
          : key.startsWith('alias') ? 'aliasName'
            : key.startsWith('father') ? 'fatherName'
              : key.startsWith('mother') ? 'motherName'
                : key.startsWith('placeOfBirth') ? key
                  : 'spouseName'
        errors[group] = 'Use letters, spaces, apostrophes, hyphens, or periods only.'
      }
    })
  }

  if (pageIndex === 1) {
    if (![values.kycFirstName, values.kycMiddleName, values.kycLastName].some((value) => value?.trim())) {
      errors.kycName = 'KYC Name is required.'
    } else if ([values.kycFirstName, values.kycMiddleName, values.kycLastName]
      .some((value) => value && !isValidName(value))) {
      errors.kycName = 'Use letters, spaces, apostrophes, hyphens, or periods only.'
    }
    required('customerOpenDate', 'Customer open date')
    required('kycDate', 'KYC date')
    required('nextKycReviewDate', 'Next KYC review date')
    date('customerOpenDate', 'Customer open date', true)
    date('kycDate', 'KYC date', true)
    date('nextKycReviewDate', 'Next KYC review date')
    date('riskProfileExpiryDate', 'Risk profile expiry date')
    validate('ckycNo', isValidCkyc, 'CKYC number must contain exactly 14 digits.')
    if (
      values.nextKycReviewDate &&
      values.kycDate &&
      !isAfter(values.nextKycReviewDate, values.kycDate)
    ) {
      errors.nextKycReviewDate = 'Next KYC review date must be later than KYC date.'
    }
    if (
      values.riskProfileExpiryDate &&
      values.kycDate &&
      !isAfter(values.riskProfileExpiryDate, values.kycDate)
    ) {
      errors.riskProfileExpiryDate = 'Expiry date must be later than KYC date.'
    }
    if (
      values.kycDate &&
      values.customerOpenDate &&
      new Date(`${values.kycDate}T00:00:00`) < new Date(`${values.customerOpenDate}T00:00:00`)
    ) {
      errors.kycDate = 'KYC date cannot be before customer open date.'
    }
  }

  if (pageIndex === 2) {
    facilities.forEach((facility) => {
      if (!facility.name?.trim()) {
        errors[`facility-${facility.id}`] = 'Particulars are required.'
      } else if (facility.amount && (!/^\d+(\.\d{1,2})?$/.test(facility.amount) || Number(facility.amount) < 0)) {
        errors[`facility-${facility.id}`] = 'Amount must be a non-negative number.'
      }
    })
  }

  if (pageIndex === 3) {
    validate('registeredMobile', isValidMobile, 'Enter a valid 10-digit Indian mobile number.')
    validate('alternateMobile', isValidMobile, 'Enter a valid 10-digit Indian mobile number.')
    validate('personalMailId', isValidEmail, 'Enter a valid email address.')
    addresses.forEach((address) => {
      if (address.pinCode && !isValidPin(address.pinCode)) {
        errors[`address-${address.id}-pinCode`] = 'PIN code must contain exactly 6 digits.'
      }
      if (address.addressValidFrom && !isValidDate(address.addressValidFrom)) {
        errors[`address-${address.id}-addressValidFrom`] = 'Enter a valid address valid from date.'
      }
      if (address.addressNoOfYears && !/^\d+$/.test(address.addressNoOfYears)) {
        errors[`address-${address.id}-addressNoOfYears`] = 'No of yrs must contain digits only.'
      }
    })
  }

  if (pageIndex === 4) {
    validate('companyMailId', isValidEmail, 'Enter a valid email address.')
    if (values.workExperience && (!/^\d+(\.\d+)?$/.test(values.workExperience) || Number(values.workExperience) < 0)) {
      errors.workExperience = 'No of years of service must be a non-negative number.'
    }
  }

  if (pageIndex === 5) {
    ;['grossIncome', 'netIncome', 'additionalIncome', 'totalIncome', 'networthRs', 'totalOutgoings'].forEach((key) => {
      amount(key, key === 'networthRs' ? 'Networth' : key.replace(/([A-Z])/g, ' $1'))
    })
    assets.forEach((asset) => {
      if (asset.valueAsOfDate && !isValidDate(asset.valueAsOfDate)) {
        errors[`asset-${asset.id}-valueAsOfDate`] = 'Enter a valid Value as on Date.'
      }
    })
    loans.forEach((loan) => {
      if (loan.loanAmount && (!/^\d+(\.\d{1,2})?$/.test(loan.loanAmount) || Number(loan.loanAmount) < 0)) {
        errors[`loan-${loan.id}-loanAmount`] = 'Loan Amount must be a non-negative number.'
      }
      if (loan.emi && (!/^\d+(\.\d{1,2})?$/.test(loan.emi) || Number(loan.emi) < 0)) {
        errors[`loan-${loan.id}-emi`] = 'EMI must be a non-negative number.'
      }
    })
  }

  return errors
}
