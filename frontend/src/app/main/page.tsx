"use client"
import React, { useState } from 'react'
import { Models, Languages } from '@/app/main/constants'
import VoiceAssistant  from '@/components/VoiceAssistant'
import axios from 'axios';
import { useEffect } from 'react';
import { useCallback } from 'react';
import useLLMConfig from "@/hooks/useLLMConfig";
import SelectOptions from '@/components/SelectOptions';

interface TtsOptions {
  [key: string]: string[]; // Assuming each provider maps to an array of voices
}
interface LLMConfig {
  llmOptions: string[];
  ttsOptions: TtsOptions;
  sttOptions: string[];
  loading: boolean
}

const Main = () => {
  const { llmOptions, ttsOptions, sttOptions, loading } = useLLMConfig() as LLMConfig

  const providers = Object.keys(ttsOptions);
  const languages: string[] = Array.isArray(sttOptions) ? Array.from(sttOptions) : Object.values(sttOptions);
  const llm: string[] = Array.isArray(llmOptions) ? Array.from(llmOptions) : Object.values(llmOptions);
  const ttsProvider = Object.keys(ttsOptions);

  const [selectedLang, setSelectedLang] = useState<string>(sttOptions[0])
  const [selectedLLM, setSelectedLLM] = useState<string>(llmOptions[0]);
  const [selectedTtsProvider, setSelectedTtsProvider] = useState<string>(ttsProvider[0]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  
  const [selectedProvider, setSelectedProvider] = useState<string>(providers[0]); // Default to first provider
  const [voices, setVoices] = useState<string[]>(ttsOptions[selectedProvider]); // Default voices
  useEffect (
    ()=>{
      setSelectedLang(sttOptions[0]);
      setSelectedLLM(llmOptions[0]);
      setSelectedProvider(providers[0]);
      setVoices(ttsOptions[providers[0]]);
      // console.log(selectedLLM, selectedLang,selectedProvider);
    }
  ,[llmOptions, ttsOptions, sttOptions, loading])
  useEffect(
    ()=> {
      if(voices)setSelectedVoice(voices[0]);
    } 
    ,[voices])
  // Handle provider change
  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = event.target.value;
    setSelectedProvider(newProvider);
    setVoices(ttsOptions[newProvider]); // Update voices dropdown
    setSelectedVoice(voices[0]);
    console.log(voices, selectedVoice);
  };



  const [isClicked, setIsClicked] = useState(false);
  const [text, setText] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState(true);
  const [isKnowledgeBaseList, setKnowledgeBaseList] = useState(true);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const room = "test-room"
  

  // const url = "https://livekitwebapp-abddetfvdfg2gaar.eastus2-01.azurewebsites.net"
  // const url = "http://127.0.0.1:8000"
  const url = "https://serverforwindowvm2-dghvd3dkebd4excq.eastus2-01.azurewebsites.net"

  // const url = "livekitwebapp-abddetfvdfg2gaar.eastus2-01.azurewebsites.net"
  const sendData = async () => {
    try {
      const data = {
        text,     
        selectedLLM,
        selectedLang,
        selectedProvider,
        selectedVoice,
      };
      console.log(data);
      const response = await axios.post(`${url}/sendData`,data); 
      // Assuming the server sends a response
      console.log(text);
      alert("Update Successful");
    } catch (error) {
      alert("Something went wrong")
      console.error("Error sending data:", error);
      
    }
  };

  const onClickHandker = ()=> {
    sendData();
    
  }
  const handleTestClick = async () => {
    // await getToken;
    setShowVoiceAssistant(true);
    sendData();
  };
  
  return (
    <div className='flex bg-gray-100 h-[100vh] w-full'>
      <div className='w-[45vw] bg-white m-2 rounded-sm '> 
        <div className='flex'>

        <div className='mx-1 p-1'>
          <p className='text-xs mx-3  '> Language </p>
          <SelectOptions options={languages} selectedOption={selectedLang} setOption={setSelectedLang} loading={loading} />
        </div>
        <div className='mx-1 p-1'>
          <p className='text-xs mx-3  '> LLM </p>
          <SelectOptions options={llm} selectedOption={selectedLLM} setOption={setSelectedLLM} loading={loading} />
        </div>
        <div className='mx-1 p-1'>
          <p className='text-xs mx-3  '> TTS Provider </p>
          <select className='p-1 m-1 rounded-full  text-sm bg-gray-100 border border-gray-300 ' value={selectedProvider} onChange={handleProviderChange}>
              {providers.map((provider) => (
                <option key={provider} value={provider} className='p-1'>
                  {provider}
                </option>
              ))}
           </select>
        </div>

        <div className='mx-1 p-1'>
          <p className='text-xs mx-3 '> Select Voices </p>
          <SelectOptions options={voices} selectedOption={selectedVoice} setOption={setSelectedVoice} loading={loading} />
        </div>
        </div>
        <textarea 
          className='p-2 m-3 rounded-md w-[95%] text-sm border border-gray-300 h-[50vh]'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className={`
        m-2 mx-4 p-2 border-1 bg-gray-100 rounded-sm ${ showVoiceAssistant ? " cursor-not-allowed opacity-50" : " cursor-pointer " }`}onClick={onClickHandker} disabled={showVoiceAssistant}
        >Submit</button> 
        
      </div>
      <div className='w-[27vw] bg-white m-2 rounded-sm '> 
        <div className='cursor-pointer' onClick={() => setKnowledgeBase(!knowledgeBase)}> 
          <h1 className='m-3 text-sm text-black hover:underline'>Knowledge Base</h1> 
        </div>
        {
          knowledgeBase && (
            <div className='text-gray-500 m-2 mx-3 '>
              <p className=' p-1  text-xs'> Add knowledge base to provide context to the agent.</p>
              <div className='cursor-pointer inline-block text-black  border border-gray-300 p-2 rounded-sm px-3 text-sm'> 
                <div className='relative'>
                  <div>Add </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      <div className='w-[27vw] text-sm bg-white m-2 rounded-sm '> 
        <div className='flex justify-center'>
          <div className='flex bg-gray-100 p-1 rounded-sm w-[40%] h-fit m-2 justify-between'>
            <div className={` p-1 cursor-pointer rounded-sm  mx-1 w-[100%] bg-white`}>  
              Test Audio
            </div>
          </div>
        </div>
        <hr className='w-[80%] border-gray-700 mx-auto '/>

        {showVoiceAssistant  ?  ( 
            <VoiceAssistant  setShowVoiceAssistant={setShowVoiceAssistant}  />) : 
            (<div className='flex flex-col justify-center items-center h-[90%]'>
            <h1 className='text-xl text-black '> Test your agent</h1>
            <br/>
            <button 
              className='cursor-pointer text-black border border-gray-300 p-2 rounded-md px-4'
              onClick={handleTestClick}
            > 
              Test
            </button>
          </div>

      )}
      </div>


    </div>
  )
}

export default Main;