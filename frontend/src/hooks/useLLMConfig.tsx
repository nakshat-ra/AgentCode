// import { useState, useEffect } from "react";

// export default function useLLMConfig() {
//   const [llmOptions, setLLMOptions] = useState([]);
//   const [ttsOptions, setTTSOptions] = useState([]);
//   const [sttOptions, setSTTOptions] = useState([]);

//   useEffect(() => {
//     async function fetchConfig() {
//       try {
//         const response = await fetch("/config/LLM.json");
//         const data = await response.json();
//         setLLMOptions(data.llm_models);
//         setTTSOptions(data.tts_providers);
//         setSTTOptions(data.stt_languages);
//       } catch (error) {
//         console.error("Error loading LLM config:", error);
//       }
//     }

//     fetchConfig();
//   }, []);

//   return { llmOptions, ttsOptions, sttOptions };
// }



import { useState, useEffect } from "react";

// Define the structure of the expected config data
interface TtsOptions {
  [key: string]: string[]; // Each provider has an array of voice options
}

interface LLMConfig {
  llmOptions: string[];
  ttsOptions: TtsOptions;
  sttOptions: string[];
  loading: boolean;
}

export default function useLLMConfig(): LLMConfig {
  const [llmOptions, setLLMOptions] = useState<string[]>([]);
  const [ttsOptions, setTTSOptions] = useState<TtsOptions>({});
  const [sttOptions, setSTTOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/config/LLM.json");
        const data = await response.json();

        // Ensure data structure matches expected types
        setLLMOptions(data.llm_models || []);
        setTTSOptions(data.tts_providers || {});
        setSTTOptions(data.stt_languages || []);
      } catch (error) {
        console.error("Error loading config:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { llmOptions, ttsOptions, sttOptions, loading };
}
