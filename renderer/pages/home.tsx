
import {  useRef, useState } from "react";
import useWebcam from "../hooks/useWebcam";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { Image } from 'image-js';

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string>();
  const [inputValue, setInputValue] = useState<string>("");
  useWebcam(videoRef);

  const router = useRouter();

  const handleReload = () => {
    router.reload();
  };

  function tirarFotoNovamente(){
    setCapturedPhoto(null);
    handleReload();
  }


  function capturePhoto() {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement) return;

    const context = canvasElement.getContext('2d');
    if (!context) return;

    // Defina a resolução desejada
      const desiredWidth = 250; // Por exemplo, 640 pixels de largura
      const scaleFactor = desiredWidth / videoElement.videoWidth;
      const canvasWidth = desiredWidth;
      const canvasHeight = videoElement.videoHeight * scaleFactor;

    // Defina o tamanho do canvas com a resolução desejada
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;

    // canvasElement.width = videoElement.videoWidth;
    // canvasElement.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);

    // Convertendo o canvas para base64
    const photoData = canvasElement.toDataURL('image/png');
    setCapturedPhoto(photoData);
  }

  async function downloadPhoto() {
    if (!capturedPhoto) return;

    const link = document.createElement('a');
    link.href = capturedPhoto;
    var nomeFoto = inputValue ? inputValue : Math.random()
    link.download = `${nomeFoto}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleReload();
  }


  return (
    <main className="min-h-screen flex flex-col lg:flex-row md:justify-between gap-14 xl:gap-40 p-10 items-center container mx-auto">
    <Header />
    <section className="flex flex-col gap-6 flex-1 w-full">
      <div className="bg-white rounded-xl p-2">
        <div className="relative flex items-center justify-center aspect-video w-full">
          <div className="aspect-video rounded-lg bg-gray-300 w-full">
            <div className="relative">
              <video 
              ref={videoRef} 
              autoPlay
              className="rounded"
              ></video>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-white rounded-xl px-8 py-6 flex gap-6 lg:gap-20 items-center h-[100px] justify-center`}
      >
        <div className="flex justify-center items-center">
        
          {capturedPhoto ? (
            <>
              <div>
                  <img src={capturedPhoto} alt="Captured" width={50} height={50}/>
                
              </div>
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 mr-2"
                  style={{ color: 'black'}}
                  placeholder="Nome da foto"
                />
                <button
                  onClick={downloadPhoto}
                  className="hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                  style={{ background: 'green'}}
                >
                  Baixar Foto
                </button>
                <button
                      onClick={tirarFotoNovamente}
                      className="bg-red-50 text-white font-bold py-2 px-4 rounded"
                      style={{ background: 'red'}}>
                      Tirar outra foto
                  </button>
              </div>
            </>
          ): (
            <button
              onClick={capturePhoto}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Capturar Foto
          </button>
          )}
          </div>
      </div>
    </section>
  </main>
  )
}
