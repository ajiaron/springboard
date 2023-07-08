import './CatalogPanel.scss'
import React, {useState, useEffect, useRef} from "react"
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { BsStars } from 'react-icons/bs'
import CharityItem from "./CharityItem";
import { Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import { FiMail } from "react-icons/fi";

const ToggleSwitch = ({label, onToggleSwitch, onRemoveItem}) => {
    const [isToggled, setIsToggled] = useState(false)
    function handleClick() {
        if (isToggled) {
            onRemoveItem(label)
        }
        else {
            onToggleSwitch(label)
        }
        setIsToggled(!isToggled)
    }
        return (
          <div className="toggle-switch-container">
            <div className="toggle-switch">
              <input type="checkbox" className="checkbox" onChange={handleClick}
                     name={label} id={label} />
              <label className="label" htmlFor={label}>
                <span className="inner" />
                <span className="switch" />
              </label>
            </div>
          </div>
        );
}

export default function CatalogPanel() {
    const [category, setCategory] = useState([])
    const [size, setSize] = useState([])
    const [filter, setFilter] = useState([])
    function handleTest() {
        console.log(category)
        console.log(size)
        console.log(filter)
    }
    return (
        <div className='catalog-panel-container'>
 
                <p className='category-filter-title'>
                    Categories
                </p>


            <div className='category-filter-container'>
         
                <div className='catalog-category-wrapper first-category'>
                    <p className='catalog-category-text'>
                        Human Rights {'&'} Services
                    </p>
                    <ToggleSwitch label={'Human'} onToggleSwitch={(e)=>setCategory([...category, e])}
                        onRemoveItem={(e)=>setCategory(category.filter(item=>item !== e))}/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Education
                    </p>
                    <ToggleSwitch label={'Education'} onToggleSwitch={(e)=>setCategory([...category, e])}
                        onRemoveItem={(e)=>setCategory(category.filter(item=>item !== e))}/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Environment {'&'} Animals
                    </p>
                    <ToggleSwitch label={'Environment'} onToggleSwitch={(e)=>setCategory([...category, e])}
                        onRemoveItem={(e)=>setCategory(category.filter(item=>item !== e))}/>
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Healthcare
                    </p>
                    <ToggleSwitch label={'Health'} onToggleSwitch={(e)=>setCategory([...category, e])}
                        onRemoveItem={(e)=>setCategory(category.filter(item=>item !== e))}/>
                 {  /* <input className='checkbox' type='checkbox'/> */}
                </div>
                <div className='catalog-category-wrapper'>
                    <p className='catalog-category-text'>
                        Research {'&'} Public Policy
                    </p>
                    <ToggleSwitch label={'Research'} onToggleSwitch={(e)=>setCategory([...category, e])}
                        onRemoveItem={(e)=>setCategory(category.filter(item=>item !== e))}/>
                </div>
            </div>
            <p className='category-filter-title middle-filter'>
                Sizing
            </p>
               <div className='category-filter-container'>
            
                    <div className='catalog-category-wrapper first-category'>
                        <p className='catalog-category-text'>
                            Small-sized
                        </p>
                        <ToggleSwitch label={'small'} onToggleSwitch={(e)=>setSize([...size, e])}
                            onRemoveItem={(e)=>setSize(size.filter(item=>item !== e))}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Mid-sized
                        </p>
                        <ToggleSwitch label={'mid'}  onToggleSwitch={(e)=>setSize([...size, e])}
                           onRemoveItem={(e)=>setSize(size.filter(item=>item !== e))}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Large-sized
                        </p>
                        <ToggleSwitch label={'large'} onToggleSwitch={(e)=>setSize([...size, e])}
                           onRemoveItem={(e)=>setSize(size.filter(item=>item !== e))}/>
                    </div>
                </div>
            <p className='category-filter-title bottom-filter'>
                Filter
            </p>
               <div className='category-filter-container'>
                    <div className='catalog-category-wrapper first-category'>
                        <p className='catalog-category-text'>
                            International
                        </p>
                        <ToggleSwitch label={'international'} onToggleSwitch={(e)=>setFilter([...filter, e])}
                           onRemoveItem={(e)=>setFilter(filter.filter(item=>item !== e))}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Accepting Donations
                        </p>
                        <ToggleSwitch label={'accepting'}onToggleSwitch={(e)=>setFilter([...filter, e])}
                            onRemoveItem={(e)=>setFilter(filter.filter(item=>item !== e))}/>
                    </div>
                    <div className='catalog-category-wrapper'>
                        <p className='catalog-category-text'>
                            Recommended *
                        </p>
                        <ToggleSwitch label={'recommended'} onToggleSwitch={(e)=>setFilter([...filter, e])}
                            onRemoveItem={(e)=>setFilter(filter.filter(item=>item !== e))}/>
                    </div>
                </div>
                <div className='test-button-container'>
                    <button className='test-panel-button' onClick={()=>handleTest()}>
                        <p className='test-button-text'>
                            Debug Panel
                        </p>
                    </button>
                </div>
        </div>
    )

}