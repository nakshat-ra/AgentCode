# compared code with new livekit base backend
# removed delete room from the frontend and server and added it to the backend
#added send_to_participants func
#IMP

import os
import csv
import asyncio
import logging
from datetime import datetime
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    metrics,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import (
    # cartesia,
    openai,
    deepgram,
    # noise_cancellation,
    silero,
    turn_detector,
)
# from livekit.plugins.openai import tts
# from openai import OpenAI
import redis
import time
import json
from livekit import api

 
load_dotenv(dotenv_path=".env.local")

 

redis_client = redis.StrictRedis(
    # host='your-redis-name.redis.cache.windows.net',
    host='RedisLivekit.redis.cache.windows.net',
    port=6380,
    # password='your-access-key',
    ssl=True,
    decode_responses=True,
    db=0
)
DEFAULT_LANGUAGE = "English"
redis_client.set("selected_lang", DEFAULT_LANGUAGE)
DEFAULT_CONTEXT = "hello, my name is Abhilash"
redis_client.set("context", DEFAULT_CONTEXT)
stt_model_selected = "deepgram"
cerebras_api_key = os.getenv("CEREBRAS_API_KEY")

 



logger = logging.getLogger("voice-assistant")

 
def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()
 
async def entrypoint(ctx: JobContext):
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are a voice assistant created by LiveKit. Your interface with users will be voice. "
            "You should use short and concise responses, and avoiding usage of unpronouncable punctuation. "
            "You were created as a demo to showcase the capabilities of LiveKit's agents framework."
        ),
    )
    

    redis_client.set("room_name",str("hello world"))
    
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
	

    # Wait for the first participant to connect
    participant = await ctx.wait_for_participant()
    participant_attributes = participant.attributes
    logger.info(f"starting voice assistant for participant {participant.identity}")
    logger.info(f"starting voice assistant for participant {participant_attributes}")
   

    openai_tts = openai.TTS(
    model="gpt-4o-mini-tts",
    voice="shimmer",
    api_key=os.getenv("OPENAI_API_KEY"),
    instructions="you talk expressively and with enthusiasm",
)


    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=openai_tts,
        turn_detector=turn_detector.EOUModel(),        
		min_endpointing_delay=0.5,				
		max_endpointing_delay=5.0,		
		chat_ctx=initial_ctx,       
       
       
    )
    
    usage_collector = metrics.UsageCollector()
    
    @agent.on("metrics_collected")
    def on_metrics_collected(agent_metrics: metrics.AgentMetrics):
        metrics.log_metrics(agent_metrics)
        usage_collector.collect(agent_metrics)
        
        
        
        
    agent.start(ctx.room, participant)
    
    async def send_to_participant(data = {"data":"True"}):
        await ctx.room.local_participant.publish_data(data, reliable=True, destination_identities=[participant.identity], isdisconnected = "data")
        
        
 
    await agent.say("Hey, how can I help you today?", allow_interruptions=True)
    
    # await send_to_participant()


    async def log_usage():
        """Logs final aggregated metrics at session end."""
        summary = usage_collector.get_summary()
        logger.info(f"{summary}")
        
        
        
        api_client = api.LiveKitAPI(
            os.getenv("LIVEKIT_URL"),
            os.getenv("LIVEKIT_API_KEY"),
            os.getenv("LIVEKIT_API_SECRET"),    
        )
            
        # await api_client.room.delete_room(api.DeleteRoomRequest(
        #     room=ctx.job.room.name,))
    # await ctx.shutdown(reason="Session ended")
        
    # ctx.add_shutdown_callback(log_usage)
    
    
        
    
    def on_attributes_changed(
        changed_attributes: dict[str, str], participant: rtc.Participant
    ):
        logging.info(
            "participant attributes changed: %s %s",
            participant.attributes,
            changed_attributes,
        )

    
    # setting attributes & metadata are async functions
    # async def myfunc():
    await ctx.local_participant.set_attributes({"foo": "bar"})
    await ctx.local_participant.set_metadata("some metadata")

    # asyncio.run(myfunc())
		

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
