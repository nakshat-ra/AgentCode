import { useVoiceAssistant, BarVisualizer, VoiceAssistantControlBar, useTrackTranscription, useLocalParticipant } from "@livekit/components-react";
import {Track} from "livekit-client"
import { useEffect, useState, useRef } from "react";
import React from 'react'
// import Latency from "./Latency";

const Message = ({type, text}: {type: string, text: string}) => {
  return (
    <div>
      <div className={`flex  ${type === 'agent' ? ' text-blue-400' : ' text-gray-600'}`}>
      <strong className="text-black"> 
        {type === 'agent' ? 'Agent: ' : 'User: '}
       </strong>
       <span 
      //  className=""
       >
        {text}
       </span>
       </div>
    </div>
  )
}

const SimpleVoiceAssistance = () => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const {state, audioTrack, agentTranscriptions} = useVoiceAssistant()
  const localParticipant = useLocalParticipant();
  const {segments: userTranscript} = useTrackTranscription(
    {
      publication: localParticipant.microphoneTrack,
      source: Track.Source.Microphone,
      participant: localParticipant.localParticipant,
    }
  )

  const [messages, setMessages] = useState<{type: string, text: string}[]>([]);

  useEffect(() => {
    type TranscriptMessage = {
      type: string;
      text: string;
      firstReceivedTime: number;
    }

    const allMessages = [
      ...(agentTranscriptions?.map(t => ({...t, type: 'agent'} as TranscriptMessage)) ?? []),
      ...(userTranscript?.map(t => ({...t, type: 'user'} as TranscriptMessage)) ?? [])
    ].sort((a, b) => (a.firstReceivedTime || 0) - (b.firstReceivedTime || 0))
      .map(msg => ({type: msg.type, text: msg.text}));

    setMessages(allMessages);
  }, [agentTranscriptions, userTranscript])

  useEffect(() => {
    if (!messagesContainerRef.current) return;
  
    const container = messagesContainerRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10; 
  
    if (isAtBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  
  return (
    <div className="flex flex-col justify-between w-full ">
      <div className="overflow-hidden overflow-y-auto ref={messagesContainerRef}"> hi
        {
          messages.map((message, index) => (
            <Message 
             key={index} 
             type={message.type} 
             text={message.text} 
            />

          ))
        }
      </div>

        <div className="">
          <VoiceAssistantControlBar />
        </div>
        
        {/* <BarVisualizer /> */}

    </div>
  )
}

export default SimpleVoiceAssistance
