import styles from '../styles/Home.module.scss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import manifest from "../public/manifest.json"
import { useState, useEffect, useId } from 'react'
import Head from 'next/head'
import Image from "next/image"
import HeartImage from "../public/heart.svg"

const Dropdown = ({ items, placeholder, className, onChange }) => {
  let id = useId()

  return <div className={classNames(styles.dropdown, className)} htmlFor={id}>
    <label htmlFor={id} style={{display: "none"}}>{placeholder}</label>
    <select 
      placeholder={placeholder} 
      required={true}
      onChange={onChange}
      id={id} 
      defaultValue="">
      <option value="" disabled={true}>{placeholder}</option>
      {
        items.map(item => <option value={item.value} key={item.value}>{item.text}</option>)
      }  
    </select>
    <svg className={styles.chevronDown}>
      <polyline points="1 1 5 5 9 1"></polyline>
    </svg>
  </div>
}

Dropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })),
  placeholder: PropTypes.node.isRequired,
}

const getValidPapers = (papers, curriculum, subject, year, language) => {
  return papers.filter(item => (curriculum) ? item.curriculum == curriculum : true )
    .filter(item => (subject) ? item.subject == subject : true)
    .filter(item => (year) ? item.year == year : true)
    .filter(item => (language) ? item.language == language : true)
}

const filterGroups = (groups, curriculum, subject, year, language) => {
  return groups
    .filter(item => (curriculum) ? item[0].curriculum == curriculum : true )
    .filter(item => (subject) ? item[0].subject == subject : true)
    .filter(item => (year) ? item[0].year == year : true)
    .filter(item => (language) ? item[0].language == language : true)
}


const toPaperGroupKey = (paper) => {
  return paper.subject + paper.year + paper.curriculum + paper.language
}

const groupPapers = (items) => {
  let map = new Map();
  for (const paper of items) {
    let key = toPaperGroupKey(paper);
    if (map.get(key) === undefined) {
      map.set(key, [])
    }
    map.get(key).push(paper)
  }
  return map;
}

const groupedPapers = groupPapers(manifest);

const ArrowRight = ({color}) => {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

const PaperGroup = ({ curriculum, subject, year, papers, language }) => {
  return <div className={styles.paperGroup}>
    <h2>{curriculum} {subject} {year} ({getLanguageText(language)})</h2>
    <ul>
      {
        papers.map(paper => <li key={paper.path}><a href={`https://raw.githubusercontent.com/Dextication/past_papers/master/${paper.path}`} target="_blank" rel="noreferrer">{paper.paper_name}<ArrowRight color="var(--fg)"/></a></li>)
      }
    </ul>
  </div>
}

const getLanguageText = (code) => {
  switch (code) {
    case "en":
      return "English";
    case "af":
      return "Afrikaans";
    default:
      return code;
  }
}

const search = (term) => {
  if (term == "") {
    return groupedPapers
  }
  let words = term.trim().toLowerCase().split(" ");
  let results = new Map();
  // Count how many words in the search term are in the key, and add store (key, # of words that match) in results
  for (let word of words) {
    let keys = Array.from(groupedPapers.keys()).filter(key => key.toLowerCase().includes(word))
    for (let key of keys) {
      if (results.has(key)) {
        results.set(key, results.get(key)+1)
      } else {
        results.set(key, 1)
      }
    }
  }

  let res = Array.from(results.entries()).sort((a, b) => a[1] > b[1]).map(e => e[0])

  return res.map(entry => groupedPapers.get(entry))
}

const Page = () => {
  let [curriculum, setCurriculum] = useState(null);
  let [subject, setSubject] = useState(null);
  let [language, setLanguage] = useState(null);
  let [searchTerm, setSearchTerm] = useState("");
  let curricula = getValidPapers(manifest, null, null, null, language).map(paper => paper.curriculum);
  curricula = curricula
    .filter((item, index) => curricula.indexOf(item) === index)
    .map(item => {
      return {
        text: item.toUpperCase(),
        value: item,
      }
    })
  let subjects = getValidPapers(manifest, curriculum, null, null, language)
    .map(paper => paper.subject);
  subjects = subjects
    .filter((item, index) => subjects.indexOf(item) === index)
    .sort()
    .map(subject => {
      return { text: subject, value: subject }
    }) // dedup

  let languages = manifest.map(item => item.language);
  languages = languages.filter((item, index) => languages.indexOf(item) === index)
    .map(item => {      
      return {
        text: getLanguageText(item),
        value: item,
      }
    });

  let searchResult = search(searchTerm);

  let groupsToDisplay = Array.from(searchResult.values())
    
  groupsToDisplay = groupsToDisplay.sort((groupA, groupB) => groupB[0].year - groupA[0].year)
  groupsToDisplay = filterGroups(groupsToDisplay, curriculum, subject, null, language)
  if (curriculum == null && subject == null && language == null && searchTerm == "") {
    groupsToDisplay = groupsToDisplay.slice(0, 10);
  } else {
    groupsToDisplay = groupsToDisplay.slice(0, 100);
  }

  let unsearched = curriculum == null && subject == null && language == null && searchTerm == "";
  
  return (
    <div className={styles.main}>
      <Head>
        <title>Past Papers (South Africa)</title>
        <meta name="description" content="IEB past papers for Physics, Chemistry, Maths, Accounting, English, Afrikaans, Xhosa, IT, and more!"/>
      </Head>
      <header>
        <span>Made with <Image src={HeartImage} alt="love" height={25} width={25}/> by <a href="https://jacquesamsel.com/">jacquesamsel.com</a></span>
      </header>
      <div>
        <h1>
          <span className={styles.titleGreen}>South African</span><br/>
          IEB Past Papers
        </h1>
        <span className={styles.goodLuck}>Good luck for your exams! -Jacques</span>
        <span style={{color: 'transparent', height: 0, width: 0}}>Papers from {Array.from(new Set(manifest.map(item => item.subject))).join(", ")}</span>
      </div>
      <input type="text" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)}></input>
      <nav>
        <Dropdown items={curricula} placeholder="Curriculum" onChange={e => setCurriculum(e.target.value)}></Dropdown>
        <Dropdown items={subjects} placeholder="Subject" onChange={e => setSubject(e.target.value)}></Dropdown>
        <Dropdown items={languages} placeholder="Language" onChange={e => setLanguage(e.target.value)}></Dropdown>
      </nav>
      <div className={styles.paperGroups}>
        {
          unsearched &&<div className={styles.unsearched}><span>Search for your paper using the tools above :)</span></div>
        }
        {
          !unsearched && groupsToDisplay.map(val => {
            let { language, curriculum, subject, year } = val[0];
            return <PaperGroup language={language} curriculum={curriculum.toUpperCase()} subject={subject} year={year} papers={val} key={toPaperGroupKey(val[0])} />
          })
        }
      </div>
    </div>
  )
}
export default Page;