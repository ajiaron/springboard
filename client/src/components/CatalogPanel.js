import './CatalogPanel.scss'
import React, {useState, useEffect, useRef} from "react"
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import CharityItem from "./CharityItem";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";
import { all } from 'axios';

const ToggleSwitch = ({label, categories, allSelected, onToggleSwitch, onRemoveItem}) => {
    const [isToggled, setIsToggled] = useState(false)
    const [isAll, setIsAll] = useState(label==='all-categories' || label==='all-sizes')
    const [defaultVal, setDefaultVal] = useState(label==='all-categories' || label==='all-sizes')
    function handleClick() {
        if (label !== 'all-categories' && label !== 'all-sizes') {
            if (isToggled) {
                onRemoveItem(label)
            }
            else {
                onToggleSwitch(label)
            }
            setIsToggled(!isToggled)
        } 
        else {
            if (categories.length > 0) {
                onToggleSwitch()
            }
        }
    }   
    useEffect(()=> {
        if (allSelected && !isAll) {
            setIsToggled(false)
        }
    }, [allSelected, isAll])
       
        return (
          <div className="toggle-switch-container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" onChange={()=>handleClick()} 
                checked={(!isAll && !allSelected)?isToggled:(isAll && categories.length === 0)?true:false}
                name={label} id={label} 
             />
              <label className="label" htmlFor={label}>
                <span className="inner" />
                <span className="switch" />
              </label>
            </div>
          </div>
        );
}

export default function CatalogPanel({
    scrollY, selectCategory, removeCategory, selectAllCategories, 
    selectSizes, removeSizes, selectAllSizes, 
    selectFilters, removeFilters}) {
    const [category, setCategory] = useState([])
    const [size, setSize] = useState([])
    const [filter, setFilter] = useState([])
    const [allSelected, setAllSelected] = useState(true)
    const [allSizes, setAllSizes] = useState(true)
    const [allFilters, setAllFilters] = useState(false)
    function handleTest() {
        console.log(category)
        console.log(size)
        console.log(filter)
    }
    const handleAllCategories = () => {
        setAllSelected(true)
        setCategory([])
        selectAllCategories()
    }
    const handleCategory = (e) => {
        setAllSelected(false)
        setCategory([...category, e])
        selectCategory(e)
    }
    const deleteCategory = (e) => {
        setCategory(category.filter((item)=> item !== e))
        removeCategory(e)
    }
    const handleAllSizes = () => {
        setAllSizes(true)
        setSize([])
        selectAllSizes()
    }
    const handleSizes = (e) => {
        setAllSizes(false)
        setSize([...size, e])
        selectSizes(e)
    }
    const deleteSize = (e) => {
        setSize(size.filter((item)=> item !== e))
        removeSizes(e)
    }
    const handleFilters = (e) => {
        setFilter([...filter, e])
        selectFilters(e)
    }
    const deleteFilters = (e) => {
        setFilter(filter.filter(item=>item !== e))
        removeFilters(e)
    }
    return (
        <div className='catalog-panel-container'>
            <p className='category-filter-title'>
                Categories
            </p>
            <div className='category-filter-container'>
                <div className='catalog-category-wrapper first-category'>
                    <div onClick={()=>handleTest()}>
                    <p className='catalog-category-text'>
                        All Categories
                    </p>

                    </div>
                
                    <ToggleSwitch label={'all-categories'} categories={category} allSelected={allSelected} 
                        onToggleSwitch={()=>handleAllCategories()}
                        onRemoveItem={(e)=>setCategory([])}/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Human Rights {'&'} Services
                    </p>
                    <ToggleSwitch label={'Human'} categories={category} allSelected={allSelected} 
                        onToggleSwitch={(e)=>handleCategory(e)}
                        onRemoveItem={(e)=>deleteCategory(e)}
                        />
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Education
                    </p>
                    <ToggleSwitch label={'Education'} categories={category} allSelected={allSelected}
                        onToggleSwitch={(e)=>handleCategory(e)}
                        onRemoveItem={(e)=>deleteCategory(e)}
                        />
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Environment {'&'} Animals
                    </p>
                    <ToggleSwitch label={'Environment'} categories={category} allSelected={allSelected}
                        onToggleSwitch={(e)=>handleCategory(e)}
                        onRemoveItem={(e)=>deleteCategory(e)}
                        />
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Healthcare
                    </p>
                    <ToggleSwitch label={'Healthcare'} categories={category} allSelected={allSelected} 
                        onToggleSwitch={(e)=>handleCategory(e)}
                        onRemoveItem={(e)=>deleteCategory(e)}
                        />
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Research {'&'} Public Policy
                    </p>
                    <ToggleSwitch label={'Research'} categories={category} allSelected={allSelected}
                        onToggleSwitch={(e)=>handleCategory(e)}
                        onRemoveItem={(e)=>deleteCategory(e)}
                        />
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Community Development
                    </p>
                    <ToggleSwitch label={'Community'} categories={category} allSelected={allSelected}
                        onToggleSwitch={(e)=>handleCategory(e)}
                        onRemoveItem={(e)=>deleteCategory(e)}
                        />
                </div>
              
            </div>
            <p className='category-filter-title middle-filter'>
                Sizing
            </p>
               <div className='category-filter-container'>
                    <div className='catalog-category-wrapper first-category'>
                        <p className='catalog-category-text'>
                            All Sizes
                        </p>
                        <ToggleSwitch label={'all-sizes'} categories={size} allSelected={allSizes}
                            onToggleSwitch={()=>handleAllSizes()}
                            onRemoveItem={()=>setSize([])}/>
                    </div>
            
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Small-sized
                        </p>
                        <ToggleSwitch label={'small'} categories={size} allSelected={allSizes}
                            onToggleSwitch={(e)=>handleSizes(e)}
                            onRemoveItem={(e)=>deleteSize(e)}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Mid-sized
                        </p>
                        <ToggleSwitch label={'mid'} categories={size} allSelected={allSizes}
                           onToggleSwitch={(e)=>handleSizes(e)}
                           onRemoveItem={(e)=>deleteSize(e)}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Large-sized
                        </p>
                        <ToggleSwitch label={'large'} categories={size} allSelected={allSizes}
                           onToggleSwitch={(e)=>handleSizes(e)}
                           onRemoveItem={(e)=>deleteSize(e)}/>
                    </div>
                    
                </div>
            <p className='category-filter-title bottom-filter'>
                Filter
            </p>
               <div className='category-filter-container'>
                    <div className='catalog-category-wrapper first-category'>
                        <p className='catalog-category-text'>
                            Newly Added
                        </p>
                        <ToggleSwitch label={'new'} categories={filter} allSelected={allFilters} onToggleSwitch={(e)=>handleFilters(e)}
                            onRemoveItem={(e)=>deleteFilters(e)}/>
                    </div>

                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Accepting Donations
                        </p>
                        <ToggleSwitch label={'accepting'} categories={filter} allSelected={allFilters} onToggleSwitch={(e)=>handleFilters(e)}
                            onRemoveItem={(e)=>deleteFilters(e)}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            International
                        </p>
                        <ToggleSwitch label={'international'} categories={filter} allSelected={allFilters} onToggleSwitch={(e)=>handleFilters(e)}
                         onRemoveItem={(e)=>deleteFilters(e)}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Recommended*
                        </p>
                        <ToggleSwitch label={'recommended'} categories={filter} allSelected={allFilters} onToggleSwitch={(e)=>handleFilters(e)}
                            onRemoveItem={(e)=>deleteFilters(e)}/>
                    </div>
                  
                </div>
                
    
        </div>
    )

}