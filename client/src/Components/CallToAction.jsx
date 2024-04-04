import { Button } from "flowbite-react"
import myImage from './jio.jpg'; // Assuming the image is named myImage.png




const CallToAction = () => {
  return ( 
  <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
    <div className="flex-1 justify-center flex flex-col ">
       
            <h2 className="text-2xl">
                 Watch ipl evryday only on jio cinema
            </h2>
            <p className="text-gray-500 my-2">
                Get a chance to win exciting prize

            </p>
            <Button gradientDuoTone='pinkToPurple'>
                <a href='https://jiocinema.com/' target="_blank" rel="noopener noreferrer" className="rounded-tl-xl rounded-bl-none">
                  India Ka Naya Tyohar
            </a>
              

            </Button>

        </div>
        <div className="p-7 flex-1 ">
            <img src={myImage} style={{ width: '400px', height: 'auto' }}  />
        </div>






    </div>
  )
}

export default CallToAction