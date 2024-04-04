
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
// import Home from './pages/Home';
import About from './pages/About';

import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Signup from './pages/Signup';
// import Header from './components/Header';
import Footer from './Components/Footer';
// import PrivateRoute from './components/PrivateRoute';
// import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
// import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import ScrollToTop from './Components/ScrollToTop';
import AddProduct from './pages/AddProduct';
import Cart from './Components/Cart';
import ProductView from './Components/ProductView';
import UpdateProduct from './pages/updateProduct';
import PaymentSuccess from './pages/paymentSucess';
import PaymentFailure from './pages/PaymentFailure';
import Order from './pages/Order';

const App = () => {
  return (
    <BrowserRouter >
    <ScrollToTop/>
   <Header/>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute/>}>
        <Route path='/dashboard' element={<Dashboard />} />
   </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/update-product/:productId' element={<UpdateProduct />} />
        </Route>
      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/payment-failure' element={<PaymentFailure/>}/>
        <Route path='/e-store' element={<Projects />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path='/product/:id' element={<ProductView />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Order/>} />

   
   </Routes>
   <Footer />
    </BrowserRouter>
  )
}

export default App