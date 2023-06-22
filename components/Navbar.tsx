import React, {useState} from 'react';
import styles from './Navbar.module.css';


export default function Navbar(){
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      // Handle search functionality with the searchQuery value
      console.log('Search query:', searchQuery);
    };

    return (
        <nav className={styles.navbar}>
        <ul className={styles.navbarList}>
          <li className={styles.navbarItem}>
            <a className={styles.navbara} href="/">
              Home
            </a>
          </li>
          <li className= {`${styles.navbarItem} ${styles.active}`}>
            <a className={styles.navbara} href="/country">
              Country
            </a>
          </li>
          <li className={styles.navbarItem}>
            <a className={styles.navbara} href="/regions">
              Regions
            </a>
          </li>
          <li className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <span role="img" aria-label="Search">
              🔍
            </span>
          </button>
        </li>
        </ul>
      </nav>
    )
}