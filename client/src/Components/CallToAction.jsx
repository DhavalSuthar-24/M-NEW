import { Button } from "flowbite-react"

const CallToAction = () => {
  return ( 
  <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
    <div className="flex-1 justify-center flex flex-col ">
       
            <h2 className="text-2xl">
                 want to learn and earn about ..................1?
            </h2>
            <p className="text-gray-500 my-2">
                checkout link in bio with 2000 + tips

            </p>
            <Button gradientDuoTone='pinkToPurple'>
                <a href='https://youtube.com/' target="_blank" rel="noopener noreferrer" className="rounded-tl-xl rounded-bl-none">
                  Learn & Earn More
            </a>
              

            </Button>

        </div>
        <div className="p-7 flex-1 ">
            <img src="https://cdn.search.brave.com/serp/v2/_app/immutable/assets/brave-logo-home-dark.Rr1iuzy-.svg" alt="" />
        </div>






    </div>
  )
}

export default CallToAction