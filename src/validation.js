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
  const date = new Date(`${birthDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
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

const isValidDate = (value) =>
  !value || !Number.isNaN(new Date(`${value}T00:00:00`).getTime())

const isAfter = (later, earlier) =>
  !later || !earlier || new Date(`${later}T00:00:00`) > new Date(`${earlier}T00:00:00`)

export function validatePage(pageIndex, values, facilities = []) {
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
    required('customerName', 'Customer name')
    required('dateOfBirth', 'Date of birth')
    required('gender', 'Gender')
    required('mobile', 'Mobile number')
    date('dateOfBirth', 'Date of birth', true)
    validate('pan', isValidPan, 'Enter a valid PAN (for example, ABCDE1234F).')
    validate('aadhaar', isValidAadhaar, 'Aadhaar must contain exactly 12 digits.')
    validate('mobile', isValidMobile, 'Enter a valid 10-digit Indian mobile number.')
    validate('alternateMobile', isValidMobile, 'Enter a valid 10-digit Indian mobile number.')
    validate('email', isValidEmail, 'Enter a valid email address.')
    validate('passportIssueDate', isValidDate, 'Enter a valid passport issue date.')
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
  }

  if (pageIndex === 1) {
    required('kycName', 'KYC name')
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
      if (facility.amount && (!/^\d+(\.\d{1,2})?$/.test(facility.amount) || Number(facility.amount) < 0)) {
        errors[`facility-${facility.id}`] = 'Amount must be a non-negative number.'
      }
    })
  }

  if (pageIndex === 3) {
    validate('addressMobile', isValidMobile, 'Enter a valid 10-digit Indian mobile number.')
    validate('addressEmail', isValidEmail, 'Enter a valid email address.')
    validate('pinCode', isValidPin, 'PIN code must contain exactly 6 digits.')
  }

  if (pageIndex === 4) {
    validate('joiningDate', isValidDate, 'Enter a valid joining date.')
    date('joiningDate', 'Joining date', true)
    validate('officePinCode', isValidPin, 'PIN code must contain exactly 6 digits.')
    validate('employerContact', isValidMobile, 'Enter a valid 10-digit contact number.')
  }

  if (pageIndex === 5) {
    ;['monthlyIncome', 'annualIncome', 'otherIncome'].forEach((key) => {
      amount(key, key === 'monthlyIncome' ? 'Monthly income' : key === 'annualIncome' ? 'Annual income' : 'Other income')
    })
    validate('incomeIfsc', isValidIfsc, 'Enter a valid IFSC code (for example, SBIN0001234).')
  }

  if (pageIndex === 6) {
    date('fatcaDeclarationDate', 'FATCA declaration date', true)
    date('crsDeclarationDate', 'CRS declaration date', true)
  }

  return errors
}
