'use client';
import { Room } from 'livekit-client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { DisconnectButton } from "@livekit/components-react";
import '@livekit/components-styles';

import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';
// import SimpleVoiceAssistance from './SimpleVoiceAssistance';
import SimpleVoiceAssistance from './SimpleVoiceAssistance2';

interface VoiceAssistantProps {
  setShowVoiceAssistant: (show: boolean) => void;
}

const VoiceAssistant = ({ setShowVoiceAssistant }: VoiceAssistantProps) =>  {
  // TODO: get user input for room and name

  const name = 'quickstart-user';
  // const room = new Room();

  
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("");

  // const url = "https://livekitwebapp-abddetfvdfg2gaar.eastus2-01.azurewebsites.net"
  // const url = "http://127.0.0.1:8000"
  const url = "https://serverforwindowvm2-dghvd3dkebd4excq.eastus2-01.azurewebsites.net"
  // const url = process.env.AGENT_SERVER_URL;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log("run");
        const response = await fetch(`${url}/getToken`);
        // console.log("Url ->", url);
        const data = await response.json();
        setRoomName(data.room_name);  
        setToken(data.token);
        // console.log()
      } catch (error) {
        alert("Something went wrong..")
        console.error("Error fetching token:", error);
      }
    };
  
    fetchToken(); // Call the async function inside useEffect
  }, []); 

  const onDisconnect = async ()=> {
    setShowVoiceAssistant(false)
    console.log(" here ")
  }

  return (
    <div className='h-[90%] border-1 border-solid border-gray-500 rounded-sm m-1 p-2 bg-white w-full'>
    <LiveKitRoom
      // serverUrl='wss://proj1-pv288rqz.livekit.cloud'
      serverUrl='wss://newvoiceapp1-s3d1i5qu.livekit.cloud'
      token = {token}
      video={false}
      connect={true}
      audio={true}
      onDisconnected={onDisconnect}
      data-lk-theme="default"
      className='flex h-12 justify-center'
      style={{ 
        backgroundColor: 'white',
        '--lk-background-color': 'white'
      } as React.CSSProperties}
    >
      {/* <DisconnectButton className='h-20'>Leave room</DisconnectButton> */}

      <RoomAudioRenderer />
      <SimpleVoiceAssistance/>
    </LiveKitRoom>
    </div>
  );
}



export default VoiceAssistant