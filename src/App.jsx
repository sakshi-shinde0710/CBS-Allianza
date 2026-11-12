import { useState } from 'react'
import IndividualCustomerMaster, { BankingHeader } from './IndividualCustomerMaster.jsx'
import './App.css'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [searchValue, setSearchValue] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  const searchPages = () => {
    const query = searchValue.trim().toLowerCase()
    if (!query) {
      setSearchMessage('No matching page found.')
      return
    }

    const pages = [
      { name: 'Dashboard', aliases: ['dashboard'] },
      {
        name: 'Individual Customer',
        aliases: ['individual customer', 'individual customer master', 'customer master'],
      },
    ]
    const page = pages.find(({ aliases }) => aliases.some((alias) => alias.includes(query)))

    if (!page) {
      setSearchMessage('No matching page found.')
      return
    }

    setActivePage(page.name === 'Dashboard' ? 'dashboard' : 'individual-customer')
    setSearchMessage('')
  }

  const headerProps = {
    searchValue,
    searchMessage,
    onSearchChange: setSearchValue,
    onSearch: searchPages,
  }

  if (activePage === 'individual-customer') {
    return <IndividualCustomerMaster {...headerProps} />
  }

  return (
    <main className="cif-app">
      <BankingHeader {...headerProps} pageTitle="Dashboard" />
      <section className="dashboard-content" aria-labelledby="dashboard-welcome">
        <h1 id="dashboard-welcome">Welcome</h1>
        <p>Search for a page or module above to get started.</p>
      </section>
    </main>
  )
}
