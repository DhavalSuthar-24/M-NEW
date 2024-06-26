import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import './styles.css'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='bottom-0 border border-t-8 border-teal-500 p-1'>
    <div className='w-full max-w-7xl mx-auto'>
      <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
        <div className='mt-5'>
          <Link
            to='/'
            className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
          >
            <span className='px-2  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Dk's
            </span>
            Blog
          </Link>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 sm:gap-4'>
          <div>
            <Footer.Title title='About' />
            <Footer.LinkGroup col>
              <Footer.Link
                href='/about'
                target='_blank'
                rel='noopener noreferrer'
              >
                Dk's Blog
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title='Follow us' />
            <Footer.LinkGroup col>
              <Footer.Link
                href='https://github.com/DhavalSuthar-24'
                target='_blank'
                rel='noopener noreferrer'
              >
                Github
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title='Legal' />
            <Footer.LinkGroup col>
              <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
      </div>
      <Footer.Divider />
      <div className='w-full sm:flex sm:items-center sm:justify-between'>
        <Footer.Copyright
          href='#'
          by="me@dks"
          year={new Date().getFullYear()}
        />
        <div className="flex gap-3 sm:mt-0 mt-2 sm:justify-center">
          <Footer.Icon href='#' icon={BsFacebook}/>
          <Footer.Icon href='#' icon={BsInstagram}/>
          <Footer.Icon href='#' icon={BsTwitter}/>
          <Footer.Icon href='https://github.com/dhaval635' icon={BsGithub}/>
          <Footer.Icon href='#' icon={BsDribbble}/>
        </div>
      </div>
    </div>
  </Footer>
  
  );
}