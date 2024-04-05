import { useState, useEffect } from 'react';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const [formData, setFormData] = useState({});

  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    console.log(productId)
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/getproduct/${productId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data);

      } catch (error) {
        console.log(error.message);
        setPublishError('Something went wrong');
      }
    };
  
    fetchProduct();
  }, [productId]);
  
  if (!formData) {
    console.log(formData)
    return <div>Loading...</div>; // Add a loading indicator
  }
  

  const handleUploadImage = async (index, file) => {
    try {
      if (!file) {
        setImageUploadError({ ...imageUploadError, [index]: 'Please select an image' });
        return;
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress({ ...imageUploadProgress, [index]: progress.toFixed(0) });
        },
        (error) => {
          setImageUploadError({ ...imageUploadError, [index]: 'Image upload failed' });
          setImageUploadProgress({ ...imageUploadProgress, [index]: null });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress({ ...imageUploadProgress, [index]: null });
            setImageUploadError({ ...imageUploadError, [index]: null });
            setFormData((prevFormData) => ({
              ...prevFormData,
              [index === 0 ? 'image' : `image${index}`]: downloadURL,
            }));
          });
        }
      );
    } catch (error) {
      setImageUploadError({ ...imageUploadError, [index]: 'Image upload failed' });
      setImageUploadProgress({ ...imageUploadProgress, [index]: null });
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/product/updateProduct/${productId}`, {
        method: 'PUT',
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

      setPublishError(null);
      navigate(`/product/${productId}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Product</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          value={formData.title }
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Select
          value={formData.category }
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
          value={formData.quantity }
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />
        <TextInput
          type='number'
          placeholder='Add Price'
          required
          id='price'
          value={formData.price }
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        {/* Upload for the main image */}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => handleUploadImage(0, e.target.files[0])} // Pass index 0 to identify the main image
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={() => handleUploadImage(0)} // Pass index 0 to identify the main image
            disabled={imageUploadProgress[0]}
          >
            {imageUploadProgress[0] ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress[0]}
                  text={`${imageUploadProgress[0] || 0}%`}
                />
              </div>
            ) : (
              'Upload Main Image'
            )}
          </Button>
        </div>
        {imageUploadError[0] && <Alert color='failure'>{imageUploadError[0]}</Alert>}
        {formData.image && <img src={formData.image} alt='upload' className='w-full h-72 object-cover' />}

        {/* Upload for image1 */}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => handleUploadImage(1, e.target.files[0])} // Pass index 1 to identify this input
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={() => handleUploadImage(1)} // Pass index 1 to identify this input
            disabled={imageUploadProgress[1]}
          >
            {imageUploadProgress[1] ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress[1]}
                  text={`${imageUploadProgress[1] || 0}%`}
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
            onChange={(e) => handleUploadImage(2, e.target.files[0])} // Pass index 2 to identify this input
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={() => handleUploadImage(2)} // Pass index 2 to identify this input
            disabled={imageUploadProgress[2]}
          >
            {imageUploadProgress[2] ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress[2]}
                  text={`${imageUploadProgress[2] || 0}%`}
                />
              </div>
            ) : (
              'Upload Image2'
            )}
          </Button>
        </div>
        <ReactQuill id="content"
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          value={formData.content || ''}
          required
          onChange={(value) => {
            setFormData({ ...formData, content:value });
          }}
        />
       
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update Product
        </Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
};

export default UpdateProduct;
