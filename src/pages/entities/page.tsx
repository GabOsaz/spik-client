import React, { useState } from 'react'
import { Button, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import SearchIcon from '../../assets/SearchIcon';
import { useNavigate } from 'react-router-dom';

const companies = [
    {
        name: 'MTN',
        logo: 'Mtn logo'
    },
    {
        name: 'AIRTEL',
        logo: 'Airtel logo'
    },
    {
        name: 'GLO',
        logo: 'Glo logo'
    },
    {
        name: 'UBA',
        logo: 'Uba logo'
    },
    {
        name: 'Etisalat',
        logo: 'Etisalat logo'
    },
]

function EntitiesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompanies, setFilterCompanies] = useState(companies);
  const navigate = useNavigate();

  const handleOnchange = (e: { target: { value: string }; }) => {
    const typedValue = e.target.value;
    setSearchTerm(typedValue);
    if (!typedValue) {
        setFilterCompanies(companies);
    } else {
        const filtered = companies.filter((company: { name: string; logo: string; }) => company.name.toLowerCase().includes(typedValue.toLowerCase()))
        setFilterCompanies(filtered);
    }
  }

  const handleCallNavigation = (companyId: string) => {
    navigate(`/call/${companyId}`);
  }

  const handleClearInput = () => (setSearchTerm(''));

  return (
    <div className="w-full">
        <div className="flex justify-center mt-24 w-full">
            <div className="w-full px-4 lg:px-0 md:w-3/4 lg:w-1/2">
                <div className="w-full">
                    <InputGroup className="">
                        <InputLeftElement className="pt-4 pl-4" pointerEvents='none'>
                            <SearchIcon />
                        </InputLeftElement>
                        <Input
                            value={searchTerm}
                            onChange={handleOnchange}
                            placeholder='Search for a company'
                            className="bg-[#19263E] outline-none w-full placeholder:text-lg rounded-full py-3 pl-12 border border-[#29384F] focus:border-[#2A8CC1]"
                        />
                        {searchTerm && <InputRightElement className="pr-6 pt-3 mb-4 cursor-pointer">
                            <button onClick={handleClearInput} className="">
                                X
                            </button>
                        </InputRightElement>}
                    </InputGroup>
                </div>

                <div className="mt-12 w-full grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 text-white relative">
                    {filterCompanies?.length ? filterCompanies.map((each: { name: string; logo: string; }, _, array) => {
                        return (
                            <div key={each.name} className="py-4 px-3 border border-[rgb(41,56,79)] rounded-xl">
                                <div className="flex items-center justify-center py-4">
                                    <span>{each.logo}</span>
                                </div>
                                <div className="pt-8 py-4 border-t-[#29384F] text-center border-t flex justify-between items-center h-1/2">
                                    <div className="">
                                        <Button onClick={() => handleCallNavigation(each.name.toLocaleLowerCase())} className="">Call</Button>
                                    </div>
                                    <div className="">
                                        <Button className="">Message</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                    <div>
                        Oops, no such company
                    </div>
                    }
                </div>
            </div>

            {/* <IntervalExample /> */}

        </div>
    </div>
  )
}

// const IntervalExample = () => {
//     const [hours, setHours] = useState<number>(0);
//     const [minutes, setMinutes] = useState(0);
//     const [seconds, setSeconds] = useState(0);
//     const [formattedTime, setFormattedTime] = useState<string>('');
//     // const totalSeconds = (hrsCD * 60 * 60) + (minutesCD * 60) + secondsCountDown;
//     const [timeLeft, setTimeLeft] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
//             const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
//             const secs = String(Math.floor(timeLeft % 60)).padStart(2, '0');
//             const fTime = `${hrs}:${mins}:${secs}`;
//             if (timeLeft > -1) {
//                 setTimeLeft((init: number) => init - 1);
//                 setFormattedTime(fTime);
//             }
//         }, 1000)
//         return () => clearInterval(interval);
//     }, [timeLeft]);

//     const handleBtnClick = () => {
//         console.log((hours * 60 * 60) + (minutes * 60) + seconds)
//         setTimeLeft((hours * 60 * 60) + (minutes * 60) + seconds)
//     }
//     console.log(formattedTime);

//     return (
//       <div className="flex flex-col">
//         <div className="text-black">
//             <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
//             <input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
//             <input type="number" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} />
//             <button type="button" className='text-white' onClick={handleBtnClick}> Click </button>
//         </div>
//         <header className=" text-white">
//           {/* {seconds} seconds have elapsed since mounting. */}
//           {formattedTime}
//         </header>
//       </div>
//     )
// };

export default EntitiesList;
