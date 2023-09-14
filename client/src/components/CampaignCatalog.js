import React, {useState, useEffect, useRef, useContext} from "react"
import './Catalog.scss'
import Navbar from "./Navbar";
import Payment from "./Payment";
import {BsSearch} from 'react-icons/bs'
import SideNavigation from "./SideNavigation";
import UserContext from "../contexts/UserContext";
import CampaignTab from "./CampaignTab";
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

const CampaignRow = ({rowIndex, remainder, campaignData}) => {  
    const userid = localStorage.getItem("userid")?JSON.parse(localStorage.getItem("userid")):0 
    const [isLast, setIsLast] = useState(remainder===0?false:Math.ceil(campaignData.length/3) === rowIndex+1)
    return (
        <div className="personal-archive-container" style={{width:"97.25%", paddingLeft:".5%"}}>             
            <div className="archive-history-container">
                {(!isLast)?
                    (campaignData&&campaignData.length>0)?
                        campaignData.slice(rowIndex*3,(rowIndex+1)*3).map((item, index)=> (
                            <CampaignTab 
                            id={campaignData&&item.campaignid} 
                            category={campaignData&&item.category} 
                            goal={campaignData&&item.goal}
                            raised={20}
                            name={campaignData&&item.campaignname} 
                            theme={campaignData&&item.theme}
                            type={0}
                            index={campaignData&&campaignData.indexOf(item)}
                            isEmpty={false}
                            route={'campaign'}
                        />
                        ))
                        :
                        <div className='loading-text-container'>
                            <p className="loading-text"> {`No charity data`} </p>
                        </div>
                :
                (campaignData&&campaignData.length>0)?
                <>
                    {
                    campaignData.slice(rowIndex*3,(rowIndex+1)*3).map((item, index)=> (
                        <CampaignTab 
                            id={campaignData&&item.campaignid} 
                            category={campaignData&&item.category} 
                            goal={campaignData&&item.goal}
                            raised={20}
                            name={campaignData&&item.campaignname} 
                            theme={campaignData&&item.theme}
                            index={campaignData&&campaignData.indexOf(item)}
                            isEmpty={false}
                            route={'campaign'}
                        />
                    ))
                    }
                </>
                    :
                    <div className='loading-text-container'>
                        <p className="loading-text"> {`No charity data`} </p>
                    </div>
                }
            </div>
        </div>
    )
}
export default function CampaignCatalog() {
    const connection = process.env.REACT_APP_API_URL
    const [query, setQuery] = useState('')
    const initialPos = useRef(null)
    const user = useContext(UserContext)
    const [scrollY, setScrollY] = useState(0)
    const [initPos, setInitPos] = useState(0)
    const [category, setCategory] = useState([])
    const [size, setSize] = useState([])
    const [filter, setFilter] = useState([])
    const [loading, setLoading] = useState(true)
    const [allCategories, setAllCategories] = useState(['Athletics', 'Technology', 'Entertainment', 'Healthcare', 'Environment', 'Community','Just For Fun'])
    const [allSizes, setAllSizes] = useState(['Small', 'Mid', 'Large'])
    const loadingRef = useRef(null)
    const [campaignList, setCampaignList] = useState([])
    const [page, setPage] = useState(1)
    const pageSize = 10;
    const [paymentActive, setPaymentActive] = useState(null)
    const [entryList, setEntryList] = useState([])
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const selectCatagory = (e) => {
        setCategory([...category, e])
    }
    const removeCatagory = (e) => {
        setCategory(category.filter(item=>item !== e))
    }
    const selectSizes = (e) => {
        setSize([...size, e])
    }
    const removeSizes = (e) => {
        setSize(size.filter(item=>item !== e))
    }
    const selectFilters = (e) => {
        setFilter([...filter, e])
    }
    const removeFilters = (e) => {
        setFilter(filter.filter(item=>item !== e))
    }
    const handlePayment = (charityid) => {
        setPaymentActive(charityid)
    }
    const onClosePayment = () => {
        setPaymentActive(null)
    }
    function handleTest() {
        console.log(category)
        console.log(size)
        console.log(filter)
    }
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
        setPage(1)
        setEntryList([])
    }, [category, size])
    useEffect(()=> {
        if (query.length > 0) {
            setPage(1)
            setEntryList([])
        }
    }, [query])
   
    useEffect(()=> {
        const loadEntries = async() => {
            setLoading(true)
            try {
                const url = query
                ? `${connection}/api/filtercampaigns/${pageSize}/${(page-1)*pageSize}/${query}`
                : `${connection}/api/fetchcampaigns/${pageSize}/${(page-1)*pageSize}`;
                const res = await Axios.get(url, {
                    params: {
                        categories:(category.length > 0)?(category.indexOf("Environment")>-1)?[...category, 'Animals']:category:allCategories,
                    }
                })
                setEntryList((prev)=> [...prev, ...res.data])
            }
            catch(error) {
                console.log(error)
            } 
        }
        loadEntries()
        setLoading(false)
    }, [page, query, category, size])

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPageNumber) => prevPageNumber + 1);
          }
        },
        { threshold: 1 } 
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
  useEffect(()=>{
    if (paymentActive !== null) {
        document.body.style.overflow='hidden'
    }
    else {
        document.body.style.overflow='auto'
    }
  }, [paymentActive])
    return (
        <div className={`catalog-main-container`}>
                {
                    (paymentActive!==null)&&<Payment charityid={paymentActive} onClose={onClosePayment}/>
                }
            <div className={`catalog-main-content ${paymentActive!== null?'dim-container':''}`}>
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
                        
            <div className={`charity-catalog-container  ${paymentActive!== null?'dim-container':''}`}>
          
                <div className="panel-container" >
                    {(topInView)&&
                        <div ref={loadingRef} className='showing-text-container' onClick={()=>handleTest()}>
                            <p className="loading-text-alt" style={{color:'#00000000'}}> {`Showing ${entryList.length} of 245 entries`} </p>
                        </div>
                    }
                    <div className="panel-wrapper" ref={panelRef}
                            style={{ transform:`translateY(${scrollY}px)`}}
                        >
                        <CatalogPanel scrollY={scrollY}
                        selectCategory={(e)=>selectCatagory(e)}
                        removeCategory={(e)=>removeCatagory(e)}
                        selectAllCategories={()=>setCategory([])}
                        selectSizes={(e)=>selectSizes(e)}
                        removeSizes={(e)=>removeSizes(e)}
                        selectAllSizes={()=>setSize([])}
                        selectFilters={(e)=>selectFilters(e)}
                        removeFilters={(e)=>removeFilters(e)}/>
                    </div>
                </div>
                <div className="charity-tag-container" style={{minWidth:"55vw"}}>
                    <div ref={loadingRef} className='showing-text-container' onClick={()=>handleTest()}>
                            <p className="loading-text"> {`Showing ${entryList.length} of 245 entries`} </p>
                    </div>
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
                        <div className="personal-archive-grid" style={{marginLeft:"auto", marginRight:"auto", alignSelf:"flex-end"}}>
                            {
                                Array.apply(null, Array(entryList&&entryList.length>0?Math.ceil(entryList.length/3):0))
                                .map((item, index)=> (
                                    <CampaignRow rowIndex={index} remainder={entryList.length%3} campaignData={entryList} />
                                ))
                            }
                        </div>
                        }
                    <div ref={loadingRef} className='loading-text-container' onClick={()=>handleTest()}>
                        <p className="loading-text"> {`${(loading)?'Loading...':`Showing all matching results`}`} </p>
                    </div>
                </div>
            </div> 
            <div className="catalog-end-container">
                <Footer/>
            </div>
     
        </div>
    )
}