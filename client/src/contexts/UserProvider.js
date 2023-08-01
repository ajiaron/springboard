import React, {useState} from "react";
import UserContext from './UserContext'
const UserProvider = ({children}) => {
   const [userid, setUserId] = useState(null)
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [firstName, setFirstName] = useState('') 
   const [lastName, setLastName] = useState('') 
   const [profilepic, setProfilePic] = useState('')
   const [isPublic, setIsPublic] = useState(1)
   return (
    <UserContext.Provider value = {{
    userid:userid, setUserId:setUserId,
    username:username, setUsername:setUsername, 
    email:email, setEmail:setEmail,
    firstName:firstName, setFirstName:setFirstName,
    lastName:lastName, setLastName:setLastName,
    profilepic:profilepic, setProfilePic:setProfilePic,
    isPublic:isPublic, setIsPublic:setIsPublic
    }}>
      {children}
    </UserContext.Provider>
)
}
export default UserProvider