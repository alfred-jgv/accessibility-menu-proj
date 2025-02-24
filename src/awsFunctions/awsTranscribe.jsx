import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_AWS_REGION;
const bucketName = import.meta.env.VITE_AWS_S3_BUCKET;

if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
  throw new Error("AWS credentials or configuration missing.");
}

const s3Client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
const transcribeClient = new TranscribeClient({ region, credentials: { accessKeyId, secretAccessKey } });

export async function uploadAudioToS3(audioBlob) {
  const fileKey = `recordings/${Date.now()}.webm`;

  try {
    const arrayBuffer = await audioBlob.arrayBuffer();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: arrayBuffer,
        ContentType: "audio/webm",
      })
    );

    return `s3://${bucketName}/${fileKey}`;
  } catch (error) {
    console.error("Error uploading audio to S3:", error);
    throw error;
  }
}

export async function transcribeSpeech(setToastMessage, setShowToast) {
  try {
    if (!navigator.mediaDevices || !MediaRecorder) {
      throw new Error("Your browser does not support audio recording.");
    }

    setToastMessage("🎤 Listening...");
    setShowToast(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = async () => {
        try {
          setToastMessage("📤 Uploading audio...");
          
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const s3Uri = await uploadAudioToS3(audioBlob);

          setToastMessage("⏳ Transcription in progress...");

          const transcribeParams = {
            TranscriptionJobName: `transcription-${Date.now()}`,
            LanguageCode: "en-US",
            MediaFormat: "webm",
            Media: { MediaFileUri: s3Uri },
            OutputBucketName: bucketName,
          };

          await transcribeClient.send(new StartTranscriptionJobCommand(transcribeParams));

          let jobData;
          let transcriptionStatus;

          do {
            await new Promise((res) => setTimeout(res, 3000));
            jobData = await transcribeClient.send(
              new GetTranscriptionJobCommand({ TranscriptionJobName: transcribeParams.TranscriptionJobName })
            );
            transcriptionStatus = jobData.TranscriptionJob.TranscriptionJobStatus;
          } while (transcriptionStatus === "IN_PROGRESS");

          if (transcriptionStatus === "FAILED") {
            setToastMessage("❌ Transcription failed.");
            reject("Transcription failed: " + (jobData.TranscriptionJob.FailureReason || "Unknown error"));
            return;
          }

          if (transcriptionStatus !== "COMPLETED") {
            setToastMessage("⚠️ Transcription did not complete.");
            reject("Transcription did not complete");
            return;
          }

          setToastMessage("✅ Transcription complete!");
          
          const resultUrl = new URL(jobData.TranscriptionJob.Transcript.TranscriptFileUri);
          const response = await fetch(resultUrl.href);
          const json = await response.json();
          resolve(json.results.transcripts[0].transcript);
        } catch (error) {
          setToastMessage("❌ Error during transcription.");
          reject("Error during transcription: " + error.message);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
          setTimeout(() => setShowToast(false), 3000);
        }
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 3000);
    });
  } catch (error) {
    setToastMessage("❌ Failed to record audio.");
    throw new Error("Failed to record audio: " + error.message);
  }
}

