import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
  
    const navigate = useNavigate();
  
    const handleUploadImage = async (index) => {
  try {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          if (index === 0) {
            setFormData({ ...formData, image: downloadURL });
          } else {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [`image${index}`]: downloadURL,
            }));
          }
        });
      }
    );
  } catch (error) {
    setImageUploadError('Image upload failed');
    setImageUploadProgress(null);
    console.log(error);
  }
};
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch('/api/product/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            setPublishError(data.message);
            return;
          }
    
          if (res.ok) {
            setPublishError(null);
            navigate(`/post/${data.slug}`);
          }
        } catch (error) {
          setPublishError('Something went wrong');
        }
      };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Add Product</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='mobile'>Mobile And Laptop</option>
            <option value='clothes'>Clothes</option>
            <option value='sports'>Sports</option>
            <option value='shoes'>Shoes</option>
          </Select>
          <TextInput
            type='number'
            placeholder='Add quantity'
            required
            id='quantity'
            className='flex-1'
            min='0'
            onChange={(e) => {
              const inputValue = parseInt(e.target.value);
              setFormData({ ...formData, quantity: inputValue });
            }}
          />
        </div>
        <TextInput
            type='number'
            placeholder='Add Price'
            required
            id='price'
            className='flex-1'
            min='0'
            onChange={(e) => {
              const inputValue = parseInt(e.target.value);
              setFormData({ ...formData, price: inputValue });
            }}
          />
        <div className='flex flex-col gap-4'>
  {/* Upload for the main image */}
  <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
    <FileInput
      type='file'
      accept='image/*'
      onChange={(e) => setFile(e.target.files[0])}
    />
    <Button
      type='button'
      gradientDuoTone='purpleToBlue'
      size='sm'
      outline
      onClick={() => handleUploadImage(0)} // Pass index 0 to identify the main image
      disabled={imageUploadProgress}
    >
      {imageUploadProgress ? (
        <div className='w-16 h-16'>
          <CircularProgressbar
            value={imageUploadProgress}
            text={`${imageUploadProgress || 0}%`}
          />
        </div>
      ) : (
        'Upload Main Image'
      )}
    </Button>
  </div>
  {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
  {formData.image && (
    <img
      src={formData.image}
      alt='upload'
      className='w-full h-72 object-cover'
    />
  )}

  {/* Upload for image1 */}
  <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
    <FileInput
      type='file'
      accept='image/*'
      onChange={(e) => handleFileChange(e, 1)} // Pass index 1 to identify this input
    />
    <Button
      type='button'
      gradientDuoTone='purpleToBlue'
      size='sm'
      outline
      onClick={() => handleUploadImage(1)} // Pass index 1 to identify this input
      disabled={imageUploadProgress}
    >
      {imageUploadProgress ? (
        <div className='w-16 h-16'>
          <CircularProgressbar
            value={imageUploadProgress}
            text={`${imageUploadProgress || 0}%`}
          />
        </div>
      ) : (
        'Upload Image1'
      )}
    </Button>
  </div>

  {/* Upload for image2 */}
  <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
    <FileInput
      type='file'
      accept='image/*'
      onChange={(e) => handleFileChange(e, 2)} // Pass index 2 to identify this input
    />
    <Button
      type='button'
      gradientDuoTone='purpleToBlue'
      size='sm'
      outline
      onClick={() => handleUploadImage(2)} // Pass index 2 to identify this input
      disabled={imageUploadProgress}
    >
      {imageUploadProgress ? (
        <div className='w-16 h-16'>
          <CircularProgressbar
            value={imageUploadProgress}
            text={`${imageUploadProgress || 0}%`}
          />
        </div>
      ) : (
        'Upload Image2'
      )}
    </Button>
  </div>
</div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
       
        <textarea
          id='content'
          placeholder='Write something...'
          className='h-36 mb-12'
          required
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
};

export default AddProduct;
