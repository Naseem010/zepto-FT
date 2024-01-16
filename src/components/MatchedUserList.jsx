import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../slices/mailSlice';

const MatchedUserList = ({inputTagRef, userInput, setUserInput, isVisible}) => {
    // Retrieve matchedUser from the Redux store
    const {matchedUser} = useSelector(state => state.mailList);
    
    // Set up Redux dispatch for adding users
    const dispatch = useDispatch();

    // State to keep track of the selected index for arrow navigation
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    // Listen for keyboard events to handle arrow keys and Enter key
    useEffect(() => {
        const handleKeyDown = (e) => {
          if (!isVisible) return;  // Skip handling key events if the component is not visible
          if (e.key === 'ArrowUp') {
            e.stopPropagation()
            e.preventDefault();
            // Move the selected index up circularly
            setSelectedIndex((prevIndex) => (prevIndex - 1 + matchedUser.length) % matchedUser.length);
          } else if (e.key === 'ArrowDown') {
            e.stopPropagation()
            e.preventDefault();
            // Move the selected index down circularly
            setSelectedIndex((prevIndex) => (prevIndex + 1) % matchedUser.length);
          } else if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            // When Enter key is pressed, add the selected user
            const selectedUser = matchedUser[selectedIndex];
            if (selectedUser) {
              dispatch(addUser(selectedUser.id));
              setSelectedIndex(0); // Reset selected index
              inputTagRef.current.value = '';
              setUserInput('');
              inputTagRef.current.blur();
            }
          }
        };
    
        // Add event listener for keydown
        document.addEventListener('keydown', handleKeyDown);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [dispatch, inputTagRef, setUserInput, matchedUser, selectedIndex, isVisible]);
    
      // Function to highlight the matching part of the text
      const highlightMatch = (text, query, type) => {
        if(query.length === 0)
        {
          if(type === "name"){
            return <span className=' font-bold'>{text}</span>
          }
          else{
            return <span className=''>{text}</span>
          }
        }
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        
        if(type === "name"){
          return parts.map((part, index) => (
            regex.test(part) ? <span key={index} className="">{part}</span> : <span key={index} className=' font-bold'>{part}</span>
          ));
        }
        else{
          return parts.map((part, index) => (
            regex.test(part) ? <span key={index} className=" opacity-50">{part}</span> : <span key={index} className=''>{part}</span>
          ));
        }
      };  

    // Click handler for adding a user when clicked on a user in the list
    const clickHandler = function (e, id) {
        e.stopPropagation();
        dispatch(addUser(id));
        inputTagRef.current.value = '';
        setUserInput("");
        inputTagRef.current.blur();
    }

    // If no matched users, display a message
    if(matchedUser.length === 0)
    {
        return <div className=' w-[100%] py-2 px-3'>
            No matched user found!
        </div>
    }
    
    // Render the list of matched users
    return (
    <div className=' w-[100%] flex flex-col gap-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)] mt-2 rounded-xl border border-solid'>
        {
            matchedUser.map((user, index) => 
                <div key={`${user.id}`} onClick={(e) => clickHandler(e, user.id)} className={` flex flex-row justify-around items-center px-3 py-2 hover:bg-[#DADADA] transition-all duration-200 ${index === selectedIndex ? 'bg-[]' : ''}`}>
                    <div className=' w-[10%] aspect-square rounded-full flex flex-row items-center justify-center overflow-hidden'>
                        <img src={user.photo} alt='User Thumbnail' />
                    </div>
                    <div className=' w-[33%]'>
                        {/* <p  className=' text-[14px]'>{user.name}</p> */}
                        <p className=' text-[14px]'>{highlightMatch(user.name, userInput, "name")}</p>
                    </div>

                    <div  className='w-[43%]'>
                        {/* <p className=' text-[10px] text-opacity-40'>{user.email}</p> */}
                        <p  className=' text-[13px]'>{highlightMatch(user.email, userInput, "mail")}</p>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default MatchedUserList