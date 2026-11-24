import React, {useState} from "react"
import '../styles/CharityItem.scss'
import { Link } from "react-router-dom";
import {AiOutlineLink, AiFillHeart} from 'react-icons/ai'
import {FaArrowRight, FaShoppingBasket} from 'react-icons/fa'

const Circle = ({score, color}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = (score / 100) * circumference;

  return (
    <svg
      className="progress-ring"
      width="120"
      height="120"
      viewBox="0 0 160 160">
        <circle
            stroke={color}
            fill="transparent"
            strokeLinecap="round"
            strokeWidth="2.5"
            strokeDasharray={`${circumference} ${circumference}`}
            r={radius}
            cx="80"
            cy="80"
        />
        <circle
            className="animated-circle"
            stroke="#3a3a3a" 
            fill="transparent"
            strokeWidth="3"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
                strokeDashoffset: circumference,
                animation: `draw-circle 1s ease-in-out forwards`,
                "--offset": offset, 
            }}
            r={radius}
            cx="80"
            cy="80"
        />
        <circle
            className="back-circle"
            stroke="#252525" 
            fill="transparent"
            strokeWidth="44"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
                strokeDashoffset: circumference,
                animation: `draw-circle 1s ease-in-out forwards`,
                "--offset": offset, 
            }}
            r={radius}
            cx="80"
            cy="80"
        />
    </svg>
  );
}

function formatMoney(value) {
    return `$${Number(value || 0).toLocaleString()}`
}

export default function CharityItem({
    index, charityid, title, location, category, size, isInternational, total, excess,
    assets, revenue, progExpense, adminExpense, fundExpense, adminRatio, focus, score, url,
    onHandlePayment}) {
    const [selected, setSelected] = useState(false)
    const categoryKey = (category || '').toLowerCase()
    const sizeKey = (size || '').toLowerCase()
    const charityPath = `/charity/${charityid}/${title}/${categoryKey}`

    function ringColor(category) {
        switch (category) {
            case 'Human':
                return 'rgb(83, 138, 190)'
            case 'Environment':
                return 'rgb(48, 162, 97)'
            case 'Animals':
                return 'rgb(122, 188, 69)'
            case 'Healthcare':
                return 'rgb(198, 83, 93)'
            case 'Education':
                return 'rgb(200, 153, 35)'
            case 'Research':
                return 'rgb(63, 159, 152)'
            case 'Community':
                return 'rgb(139, 117, 98)'
            default:
                return '#6a6a6a'
        }
    }

    function handleToggleDetails(e) {
        e.preventDefault()
        e.stopPropagation()
        setSelected((prev) => !prev)
    }

    function handleActionClick(e) {
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <Link to={charityPath} className='charity-item-button'>
            <div className={`charity-item-container ${selected ? 'selected-container' : ''}`}>
                <div className="charity-item-content">
                    <div className="charity-item-info">
                        <div className="charity-item-title-wrapper">
                            <p className="charity-tag-title">
                                {title}
                            </p>
                        </div>
                        <div className="charity-location-wrapper">
                            <p className="charity-location-text">
                                {location}
                            </p>
                        </div>
                        <div className="charity-categories-wrapper">
                            <div className={`charity-categories-container ${categoryKey}-container`}>
                                <p className="charity-category-text">
                                    {`${category==='Human'?'Human Rights & Services':
                                    (category==='Research')?'Research & Public Policy':
                                    (category === "Community")?'Community Development':category}`}
                                </p>
                            </div>
                            {size &&
                            <div className={`charity-categories-container size-wrapper ${sizeKey}-wrapper`}>
                                <p className="charity-category-text">
                                    {`${size}-Sized`}
                                </p>
                            </div>
                            }
                            {(isInternational)&&
                                <div className={`charity-categories-container international-wrapper`}>
                                    <p className="charity-category-text">
                                        International
                                    </p>
                                </div>
                            }
                        </div>

                        {selected &&
                        <div className="charity-info-expanded-container">
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Organization Focus:</p>
                                    <p className="expanded-info-data">{focus || 'n/a'}</p>
                                </div>
                            </div>
                            <div className="charity-info-expanded lower-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Total Contributions:</p>
                                    <p className="expanded-info-data">{formatMoney(total)}</p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Excess/Deficit:</p>
                                    <p className={`${Number(excess) < 0 ? 'deficit' : 'excess'}-info`}>
                                        {`${Number(excess) < 0 ? '-' : '+'}$${Math.abs(Number(excess || 0)).toLocaleString()}`}
                                    </p>
                                </div>
                            </div>
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Net Assets:</p>
                                    <p className="expanded-info-data">{formatMoney(assets)}</p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Other Revenue:</p>
                                    <p className="expanded-info-data">{formatMoney(revenue)}</p>
                                </div>
                            </div>
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Program Expenses:</p>
                                    <p className="expanded-info-data">{formatMoney(progExpense)}</p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Administrative Expenses:</p>
                                    <p className="expanded-info-data">{formatMoney(adminExpense)}</p>
                                </div>
                            </div>
                            <div className="charity-info-expanded">
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Fundraising Expenses:</p>
                                    <p className="expanded-info-data">{formatMoney(fundExpense)}</p>
                                </div>
                                <div className="expanded-info-content">
                                    <p className="expanded-info-text">Admin Expense Ratio:</p>
                                    <p className="expanded-info-data">{parseFloat(adminRatio || 0).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="donation-button-container">
                                <div className="like-icon-wrapper" onClick={handleActionClick}>
                                    <AiFillHeart className="charity-like-icon"/>
                                </div>
                                <div className="like-icon-wrapper" onClick={(e)=>{
                                    handleActionClick(e)
                                    if (onHandlePayment) onHandlePayment(charityid)
                                }}>
                                    <FaShoppingBasket className="charity-basket-icon"/>
                                </div>
                                <div className="like-icon-wrapper" onClick={handleActionClick}>
                                    <AiOutlineLink className="charity-linkto-icon"/>
                                </div>
                                <span className="like-icon-wrapper charity-open-hint">
                                    <FaArrowRight className="charity-arrow-icon"/>
                                </span>
                            </div>
                        </div>
                        }

                        <button
                            type="button"
                            className="charity-details-toggle"
                            onClick={handleToggleDetails}
                        >
                            {selected ? 'Hide details' : 'Quick details'}
                        </button>
                    </div>
                </div>

                <div className="charity-figure-container">
                    <div className={`charity-score-container ${categoryKey}-circle`}>
                        <Circle 
                            score={parseFloat(score || 0)}
                            color={ringColor(category)}
                        />   
                        <div className="blur-wrapper">
                            <div className={`circle-blur ${categoryKey}-blur`}/>                
                        </div>
                        <p className="overall-score">
                            {`${parseFloat(score || 0).toFixed(1)}`}
                        </p>    
                    </div>
                </div>
            </div>
        </Link>
    )
}
