import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_AWS_REGION;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error("AWS credentials or configuration missing.");
}

const pollyClient = new PollyClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export async function synthesizeSpeech(text) {
  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: "Joanna",
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    if (!response.AudioStream) {
      throw new Error("Polly did not return an audio stream.");
    }

    const audioStream = await response.AudioStream.transformToByteArray();
    const audioBlob = new Blob([audioStream], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);

    return audioUrl;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
}
