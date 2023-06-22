'use client'
import React, { useState, useEffect, useRef, Children } from "react";
import Pagination from "../components/Pagination";
import filterList from '../filters/filterList'
import '../styles/Home.module.css'
import Image from 'next/image'
import Navbar from "@/components/Navbar";

type Country = {
  name: string;
  region: string;
  area: number;
};


export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]); // displayed countries based on active filters
  const [originalList, setOriginalList] = useState<Country[]>([]); // stores copy of original list
  const [toggleSort, setToggleSort] = useState<boolean>(true); // for alphabetical sort
  const [filters, setFilters] = useState<string[]>([]); // array of active filters
  const [checked, setChecked] = useState<string[]>([]); // array of checked checkboxes
  const currentYear = new Date().getFullYear();

  // useEffect that fetches the data, formats and adds it to another array, and initially sorts it alphabetically
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      const response = await fetch(
        '/api/hello'
      );
      const data = await response.json();
      const formattedData = data.map((country: any) => (
        {
          name: country.name,
          region: country.region,
          area: country.area
        }
      ));
      setCountries(formattedData);
      setOriginalList(formattedData);
      setLoading(false); // set loading to false if api was fetched
    };

    fetchCountries();
    sortByName("asc");
    setOriginalList(countries);
  }, []);


  // useEffect that filters the data based on the filters array
  useEffect(() => {
    let filteredCountries: Country[] = originalList;

    filters.forEach((filter) => {
      switch (filter) {
        case "SmallerThanLithuania":
          filteredCountries = filteredCountries.filter((country) => country.area < 65200);
          break;
        case "InOceania":
          filteredCountries = filteredCountries.filter((country) => country.region === "Oceania");
          break;
        default:
          break;
      }
    });
    setCountries(filteredCountries);
    setToggleSort(true); //sorts the list to asc
    setCurrentPage(1); // returns to page 1 if filter is toggled
  }, [filters])

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const countriesPerPage: number = 15;
  const indexOfLastCountry: number = currentPage * countriesPerPage;
  const indexOfFirstCountry: number = indexOfLastCountry - countriesPerPage;
  let currentCountries: Country[] = []
  currentCountries = countries.slice( // gets the countries based on page number
    indexOfFirstCountry,
    indexOfLastCountry
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Sort Function
  const sortByName = (arrangement: string) => {
    let sortedCountries: Country[] = [];

    if (arrangement === "asc") {
      sortedCountries = [...countries].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (arrangement === "desc") {
      sortedCountries = [...countries].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }
    setCountries(sortedCountries);
    setCurrentPage(1); // returns to page 1 if sort is toggled
  };

  // Sort Button Handler
  const sortBtn = () => {
    setToggleSort(!toggleSort);
    if (toggleSort) {
      sortByName("desc");
    } else {
      sortByName("asc");
    }
  }

  // Filter Handlers
  const handleCheckBoxToggle = (value: string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    // if filter is not in the filter array or ===-1 , it adds the filter
    if (currentIndex === -1) {
      newChecked.push(value);
    }
    else { // else, removes the filter from array
      newChecked.splice(currentIndex, 1);
    }

    // update array of active filters and checked checkboxes
    setChecked(newChecked);
    setFilters(newChecked);
  }

  // Reset Filters, reverts to original list
  const resetFilters = () => {
    setCountries(originalList);
    setToggleSort(true);
    setCurrentPage(1);
    setChecked([]);
    setFilters([]);
  }

  return (
    <div className="container">
         <div id="App">
        <section id="mainSection">
          <div className="navbar">
            <Navbar/>
          </div>
          <div className="sticky">
            <div className="firstSection">

            <div >
          <header className="columnone">
          <button onClick={() => sortBtn()}>
              {
                toggleSort ? "Sort A-Z↥" : "Sort Z-A↧"
              }
            </button>
            <button onClick={() => resetFilters()}>Reset Filters</button>
            <>
              {
                filterList.map((filter) => {
                  return (
                    <span key={filter.id}>
                      <input
                        type="radio"
                        id={filter.name}
                        checked={checked.indexOf(filter.name) === -1 ? false : true}
                        onChange={() => {
                          handleCheckBoxToggle(filter.name)
                        }}
                      />
                      <label htmlFor={filter.name}>
                          {filter.displayName}
                          
                      </label>
                    </span>
                  )
                })
              }
            </>
          </header>
          </div>
              <div className="columntwo">
                <h1>All countries</h1>
                <p>This is a list of all countries in the world with its corresponding country profiles</p>
              </div>
            </div>
          </div>
         
              <div className="map">
              <Image src="/worldmap.png" alt="My Image" width={800} height={400} />
              </div>

         
          <br /><br />

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Area in km²</th>
              </tr>
            </thead>
            <tbody>
              {currentCountries.map((country, index) => (
                <tr key={index}>
                  <td>{country.name}</td>
                  <td>{country.region}</td>
                  <td>{country.area}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            countriesPerPage={countriesPerPage}
            totalCountries={countries.length}
            currentPage={currentPage}
            paginate={paginate}
          />
          <br />
          <span className="currentPage">
            <p className="pageNum">
            Page {currentPage} out of {Math.ceil(countries.length / countriesPerPage)}
            </p>
          </span>

          <footer>
            <p> &copy; {currentYear} Jasper Villarosa. All rights reserved.</p>
          </footer>
        </section>
    </div>
    </div>
   
  );
}
