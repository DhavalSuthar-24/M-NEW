import { Button, TextInput, Alert,Modal, ModalHeader } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Fixed import
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from "../firebase";
import { updateStart,updateFailure, signOutSuccess,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess} from '../redux/user/user.slice';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";


const Dashprofile = () => {
    const { currentUser,error,loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formdata, setFormData] = useState({}); // Fixed variable name and added missing import
    const [imagefileUploading,setimagefileUploading]= useState(null)
    const [showmodel,setshowmodel] = useState(false)
    const dispatch = useDispatch(); // Fixed typo in useDispatch
    const [updateUserSuccess,setupdateUserSuccess]= useState(null)
    const [updateUsererror,setupdateUsererror] = useState(null)
    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        uploadImage();
    }, [imageFile]);

    const uploadImage = async () => {
        setImageFileUploadError(null);
        if (!imageFile) return;
setimagefileUploading(true)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setImageUploadProgress(progress);
        }, (error) => {
            setImageFileUploadError("Couldn't upload the image (file must be under 2MB)");
            console.log(error);
            setImageUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            setimagefileUploading(false)
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                setImageFileUrl(downloadUrl);
                setFormData({ ...formdata, profilepic: downloadUrl }); // Fixed variable name
                 setimagefileUploading(false)
            });
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formdata, [e.target.id]: e.target.value }); // Fixed variable name
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setupdateUsererror(null)
        setupdateUserSuccess(null)
   if(imagefileUploading){

    setupdateUsererror("please wait to image to be saved")
    return;  
}
        if (Object.keys(formdata).length === 0) {
       setupdateUsererror('no changes made')
          return;
        }
        console.log(currentUser._id)
        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata),
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
          setupdateUsererror(data.message)
          } else {
            dispatch(updateSuccess(data));
          setupdateUserSuccess("user profile updated succesfully")
          }
        } catch (error) {
          dispatch(updateFailure(error.message));
       
        }
        console.log(currentUser.profilepic)
      };
       const handleDeleteUser =async()=>{
setshowmodel(false);
try{
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(deleteUserFailure(data.message));
   
    } else {
      dispatch(deleteUserSuccess(data));
     
    }
  }catch(error){
dispatch(updateFailure(error.messsage))
}
}
const handleSignout = async()=>{
    try{
          const res = await fetch('/api/user/signOut',{
            method:'POST'}

          )
          const data = await res.json();

         if(!res.ok){
            console.log(data.message)
         }else{
            dispatch(signOutSuccess())
         }

         }

    catch(e){
        console.log(e.message)
    }


      }
    

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden relative" onClick={() => filePickerRef.current.click()}>
  {imageUploadProgress && imageUploadProgress < 100 && (
    <CircularProgressbar
      value={imageUploadProgress}
      text={`${imageUploadProgress}%`}
      strokeWidth={5}
      styles={{
        root: {
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        },
        path: {
          stroke: '#AAA',
          transition: `stroke-dashoffset 0.5s ease 0s`,
        },
        text: {
          fill: '#303030',
          fontSize: '16px',
        },
      }}
    />
  )}
  <img
    src={imageFileUrl || currentUser.profilepic}
    alt="user"
    className={`self-center w-full h-full border-4 object-cover border-gray-300 absolute top-0 left-0 transform-translate-x-1/2 transform-translate-y-1/2 ${!imageUploadProgress || imageUploadProgress === 100 ? '' : 'opacity-60'}`}
    style={{ zIndex: 0 }}
  />
</div>


                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}

                <TextInput type="text" id="username" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type="email" id="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput type="password" id="password" placeholder="Password" onChange={handleChange} />
                <Button gradientDuoTone="purpleToBlue" type="submit" outline disabled={loading ||imagefileUploading }>{
                    loading? 'Loading' :"Update"
                }</Button>
            {
                currentUser.isAdmin && (
                    <Link to={'/create-post'}> 
                    <Button gradientDuoTone="purpleToPink" className="w-full"  >Create  a Post </Button></Link>
                   
                )
            }
             {
                currentUser.isAdmin && (
                    <Link to={'/add-product'}> 
                    <Button gradientDuoTone="purpleToBlue" className="w-full"  >Add Product </Button></Link>
                   
                )
            }
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer" onClick={()=>setshowmodel(true)}>Delete Account</span>
                <span onClick={handleSignout} className="cursor-pointer" >Sign out</span>
            </div>
            {
                updateUserSuccess && (
                    <Alert color='success' className="mt-5">{updateUserSuccess}</Alert>
                )
            }
            {
                updateUsererror && (
                    <Alert color='failure' className="mt-5">{updateUsererror}</Alert>
                )
            }
            {
                error && (
                    <Alert color='failure' className="mt-5">{error}</Alert>
                )
            }
            <Modal  show={showmodel} onClose={()=>setshowmodel(false)}  popup size="md">
                <Modal.Header/>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 color-gray-400 dark:color-gray-200 mb-4 mx-auto"/>
                        <h3 className=" text-lg text-grey-500 dark:text-gray-400 font-semibold">Are you sure you want to delete your account?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>Yes I'm Sure

                            </Button>
                            <Button color="grey" onClick={()=>setshowmodel(false)}>No, Cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Dashprofile;
