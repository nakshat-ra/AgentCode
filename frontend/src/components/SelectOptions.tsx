import React from 'react'

interface SelectOptionsProps {
    options: string[]; // List of options
    selectedOption: string; // Current selected option
    setOption: React.Dispatch<React.SetStateAction<string>>; // Function to update the selected option
    loading: boolean
  }

const SelectOptions: React.FC<SelectOptionsProps> = ({options, selectedOption, setOption, loading}) => {
  return (
    <div>
        <select 
            className='p-1 m-1 rounded-full  text-sm bg-gray-100 border border-gray-300 '
            value={selectedOption}
            onChange={(e) => setOption(e.target.value)}
          >
            {options?.map((option: any) => (
              <option key={option} value={option} className='p-1'> {option} </option>
            ))}
        </select>
    </div>
  )
}

export default SelectOptions