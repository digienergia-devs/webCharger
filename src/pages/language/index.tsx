import React, { useEffect, useState } from 'react'
import './style.css'

export default function Language(props: any) {

    const languageList = [
        {
            'name': 'english',
            'code': 'EN'
        }, {
            'name': 'finnish',
            'code': 'FI'
        }
    ]

    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(languageList[0].code)

    const changeLanguage = (event: any) => {
        props.setLan(event.target.value)
    }

    useEffect(() => {
        switch (props.language) {
            case 'EN':
                setSelectedLanguage(languageList[0].code)
                break;
            case 'FI':
                setSelectedLanguage(languageList[1].code)
                break;
            default:
                setSelectedLanguage(languageList[0].code)
                break;
        }
    }, [props.language])

    return (
        <div className='language'>
            <select className='selec' value={selectedLanguage} onChange={changeLanguage}>
                {languageList.map((option) => (
                    <option
                        key={option.name}
                        value={option.code}
                    >
                        {option.code}
                    </option>
                ))}


            </select>
        </div>
    )
}
