import React, {useState, useEffect, useRef, useCallback} from "react"
import './Catalog.scss'
import Navbar from "./Navbar";
import {BsSearch} from 'react-icons/bs'
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import CharityItem from "./CharityItem";
import CatalogPanel from "./CatalogPanel";
import Footer from "./Footer";
import Axios from "axios";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import _, { debounce } from 'lodash'; 
import { FiMail } from "react-icons/fi";

export default function Catalog() {
    const [query, setQuery] = useState('')
    const initialPos = useRef(null)
    const [scrollY, setScrollY] = useState(0)
    const [initPos, setInitPos] = useState(0)
    const [loading, setLoading] = useState(true)
    const loadingRef = useRef(null)
    const [page, setPage] = useState(1)
    const pageSize = 10;
    const [entryList, setEntryList] = useState([])
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    useEffect(() => {
        const updateDimensions = () => {
          setScreenWidth(window.innerWidth);
          setScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', updateDimensions);
        return () => {
          window.removeEventListener('resize', updateDimensions);
        };
      }, []);
    const { ref:panelRef, inView: panelInView} = useInView({
        threshold:1,
        triggerOnce:false
      });
    const { ref:topRef, inView: topInView} = useInView({
        threshold:0,
        triggerOnce:false
    });
    const updateScrollPos = debounce(() => {
        if (topInView) {
            setScrollY(0)
        }
        else if (!panelInView && window.scrollY > (screenHeight*0.5)) {
            setScrollY(window.scrollY - window.innerHeight / 2);
        }
        else {
            setScrollY(initPos.current)
        }
    }, 100);

    useEffect(() => {
        window.addEventListener('scroll', updateScrollPos);
        return () => {
          window.removeEventListener('scroll', updateScrollPos);
        };
      }, [panelInView, topInView]); // If panelInView changes, re-register the effect

    useEffect(()=> {
        if (query.length > 0) {
            setPage(1)
            setEntryList([])
        }
    }, [query])

   
    useEffect(()=> {
        const loadEntries = async() => {
            try {
                const url = query
                ? `http://localhost:3000/catalog/searchbatch/${pageSize}/${(page-1)*pageSize}/${query}`
                : `http://localhost:3000/catalog/getbatch/${pageSize}/${(page-1)*pageSize}`;
                const res = await Axios.get(url)
                setEntryList((prev)=> [...prev, ...res.data])
                console.log(query)
            }
            catch(error) {
                console.log(error)
            } 
        }
        loadEntries()
    }, [page, query])



  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPageNumber) => prevPageNumber + 1);
          }
        },
        { threshold: 1 } // Trigger the callback when the observed element is 100% visible.
      );
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, []);
    return (
        <div className="catalog-main-container">
            <div className="catalog-main-content">
            <Navbar/>
                <div className="catalog-header-container" ref={topRef}>
                    <div className="catalog-header-wrapper">
                        <p className="catalog-header-text">
                            PROGRAM CATALOG
                        </p>
                    </div>
                    <div className="catalog-main-text-container">
                        <p className="catalog-main-text">     
                            A little goes a long way.
                        </p>
                    </div>
                    {/*
                      Listings were chosen based on having an overall score of 90 or more, taking into account factors such as their financial and<br/> accountability scores.
                      Of those organizations, the top 50 contributors from each category of cause are included in this catalog.<p className="header-space"><br/></p>
                     */}
                    <div className="catalog-header-subtext-wrapper">
                        <p className="catalog-header-subtext">
                            Search from over 400 charities across different categories of cause, from social services to wildlife conservation<br/> and more.
                            Entries are curated from the best performing organizations, as listed from <Link className='catalog-feedback-link' to={'https://www.charitynavigator.org/'}>www.charitynavigator.org</Link>.<br className="header-space"/>
                            If you would like to suggest a charity or non-profit organization to be included in a future update, 
                            <Link className='catalog-feedback-link' to={'#'}
                                onClick={(e)=>{
                                window.location.href = 'mailto:aaronjiang3942@gmail.com';
                                e.preventDefault();
                                }}> let us know.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
                        
            <div className="charity-catalog-container">
                    <div className="panel-container" >
                        <div className="panel-wrapper" ref={panelRef}
                                style={{ transform:`translateY(${scrollY}px)`}}
                            >
                            <CatalogPanel scrollY={scrollY}/>
                        </div>
                    </div>
                <div className="charity-tag-container">
                    <div className="search-catalog-container">
                        <input type="text" name="ownerName" id="ownerName"
                            onChange={(e)=> setQuery(e.target.value)}
                            value={query}
                            placeholder={`Search an organization...`}
                            className="search-catalog" >
                        </input>
                        <BsSearch className="search-icon"/>
                    </div>
                    {
                        entryList.map((item,index)=> (
                            <CharityItem
                                index={index}
                                charityid={item.charityid}
                                title={item.charity_name}
                                location={`${item.city}, ${item.state}, USA`}
                                category={item.type1}
                                size={(item.total_contributions < 2646303)?'Small'
                                :(item.total_contributions > 53903258)?'Large':'Mid'}
                                isInternational={item === 'International '}
                                total={item.total_contributions}
                                excess={item.excess >= 0?true:false}
                                score={item.overall_score}
                                url={item.charity_url}
                            />
                        ))
                        }
                    <div ref={loadingRef} className='loading-text-container'>
                        <p className="loading-text"> {`Showing ${entryList.length} of 245 entries`} </p>
                    </div>
                </div>
            </div> 
            <div className="catalog-end-container">
                <Footer/>
            </div>
     
        </div>
    )
}