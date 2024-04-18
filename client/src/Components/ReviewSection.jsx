import { useEffect, useState } from 'react';
import { Alert, Button, Modal, TextInput, Select, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link,  useNavigate } from 'react-router-dom';
import Review from './Review';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function ReviewSection({id}) {
//   const { product._id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [stars, setStars] = useState(1)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
        console.log(id)
      const res = await fetch('/api/comment/createR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId:id,
          userId: currentUser._id,
          stars
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [id]);

  const handleLike = async (commentId) => {
    console.log(comments)
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  // Other functions remain the same

  return (
    <div className='max-w-full mx-8 w-full p-3 flex-col flex md:flex-row md:justify-between ' >
        <div className="flex-1 mr-5 justify-center">
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm mt-10'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1 '>
          You must be signed in to give review.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
     <form
     onSubmit={handleSubmit}
     className='border border-teal-500 rounded-md p-2 mt-5'
   >
    <div className=" flex">
     <Textarea className='mr-5'
       placeholder='Add a review...'
       rows='3'
       maxLength='200'
       onChange={(e) => setComment(e.target.value)}
       value={comment}
     />
     <div className="w-1/3 ">
        <p className='  mt-1'>ratings</p>
  <Select
  value={stars}
  
  onChange={(e) => setStars(parseInt(e.target.value))}
  className='flex mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500'
>
{[1, 2, 3, 4, 5].map((star) => (
    <option
      key={star}
      value={star}
      className="py-2 px-4 hover:bg-teal-100 hover:text-teal-700"
    >
      {star} {star === 1 ? 'Star' : 'Stars'}
    </option>
  ))}
</Select></div>

    </div>
     <div className='flex justify-between items-center mt-3'>
       <p className='text-gray-500 text-xs'>
         {200 - comment.length} characters remaining
       </p>
       <Button outline gradientDuoTone='purpleToBlue' type='submit'>
         Submit
       </Button>
     </div>
     {commentError && (
       <Alert color='failure' className='mt-5'>
         {commentError}
       </Alert>
     )}
   </form>
   
      )}</div>
      <div className=" flex-1 ml-5 mr-10">
      {comments.length === 0 ? (
        <div className="flex items-center justify-center h-full">  <p className='text-sm text-center'>No Reviews Yet!</p></div>
      
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <h3 className='font-bold'>Ratings & Review</h3>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Review
              key={comment._id}
              comment={comment}
              
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}</div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
