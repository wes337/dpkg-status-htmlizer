import React, { useState, useEffect } from 'react'
import parseDpkg from './parse'
import init386 from '386-animation'
import * as statusData from './data/status.real'
import '386-animation/386.css'
import './App.scss'

function App() {
  const fileReader = new FileReader()
  const [file, setFile] = useState()
  const [packages, setPackages] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState({
    pkg: '',
    description: '',
    depends: [],
  })

  useEffect(() => {
    init386() // https://github.com/wes337/386-animation
  }, [])

  useEffect(() => {
    const selectedPackageElement = document.querySelector('.selected--package')
    selectedPackageElement && selectedPackageElement.scrollIntoView({
      behavior: 'smooth'
    })
  }, [selectedPackage])

  const parseDpkgStatus = () => {
    const file = fileReader.result
    const parsed = parseDpkg(file)

    setPackages(parsed)
  }

  const handleFile = (file) => {
    if (file) {
      fileReader.onloadend = parseDpkgStatus
      fileReader.readAsText(file)
    }
  }

  const handleClick = (packageObject) => {
    const { package: pkg, description, depends } = packageObject
    setSelectedPackage({
      pkg,
      description,
      depends,
    })
  }

  const renderDependencies = () => {
    const { depends } = selectedPackage
    if (!depends || depends.length <= 0) {
      return
    }

    const dependsArray = depends
      .replace(/\s*\(.*?\)\s*/g, '')
      .split(/, |\|/g)

    // remove duplicates since we removed dependency versions
    const dependencies = [ ...new Set(dependsArray) ]
    
    return (
      <div>
        <div className="label">Dependencies</div>
        <ul className="list">
          {dependencies.map((dep, i) => { 
            const pkg = packages.find(pkg => pkg.package === dep)
            if (pkg) {
              return (
                <li
                  className="list-item"
                  key={`${dep}-${i}`}
                  onClick={() => handleClick(pkg)}
                  role="link"
                  tabIndex={0}
                >
                  {dep}
                </li>
              )
            }
            return null
          }
          )}
        </ul>
      </div>
    )
  }

  const renderDependants = () => {
    const dependants = packages.filter(pkg => {
      if (!pkg || !pkg.depends) {
        return false
      }
      return pkg.depends === selectedPackage.pkg
    })
    
    if (dependants && dependants.length <= 0) {
      return
    }

    return (
      <div>
        <div className="label">Dependants</div>
        <ul className="list">
          {dependants.map((dep, i) => (
            <li
              className="list-item"
              key={`${dep.package}-${i}`}
              onClick={() => handleClick(dep)}
              role="link"
              tabIndex={0}
            >
              {dep.package}
            </li>)
          )}
        </ul>
      </div>
    )
  }

  return (
    <div className="dpkg__status__htmlizer">
      <section className="header">
        <h1>DPKG HTMLizer 2000&trade;</h1>
        <a className="source__link" href="https://github.com/wes337/dpkg-status-htmlizer" rel="noopener noreferrer" target="_blank">&lt;&#47;&gt; Source Code</a>
        <p>
          Select your DPKG status file, then press the <span>HTMLize</span> button.<br />
          <em>Don't have a DPKG status file? Use this <a href={statusData} rel="noopener noreferrer" target="_blank">example</a> file.</em>
        </p>
      </section>
      <section className="input">
        <input className="file__input" name="file" id="file" type="file" onChange={e => setFile(e.target.files[0])} />
        <label className="file__input--button" htmlFor="file">
          {file ? file.name : 'Select a file'}
        </label>
        <button className="file__input--button htmlize" disabled={!file} onClick={() => handleFile(file)}>HTMLize!</button>
      </section>
      {packages && packages.length === 0 && <div className="error">Couldn't find any packages in that file!</div>}
      {packages && packages.length > 0 &&
        <>
          <section className="package__list">
            <div className="package__list--container">
              {packages.map((pkg, i) => (
                <button
                  className={selectedPackage.pkg === pkg.package ? 'selected--package' : ''}
                  key={`${pkg.package}--${i}`}
                  onClick={() => handleClick(pkg)}
                  type="button"
                >
                  {pkg.package}
                </button>
              ))}
            </div>
          </section>
          <section className="package__info">
            {packages && packages.length > 0 && !selectedPackage.pkg 
              ? <div className="package__info--select">Please select a package from the list.</div>
              : (<>
                  <div className="package__info--name">{selectedPackage.pkg}</div>
                  <div className="package__info--description">{selectedPackage.description}</div>
                  <hr />
                  <div className="package__info--deps">
                    {renderDependencies()}
                    {renderDependants()}
                  </div>
                </>)}
          </section>
        </>
      }
      <section className="footer">
        <a className="footer__link" href="https://www.github.com/wes337" rel="noopener noreferrer" target="_blank">
          <span className="name">Wes Moses</span>
          <span className="slash">&#47;&#47;</span>
          <span className="username">wes337</span>
        </a>
      </section>
    </div>
  )
}

export default App
