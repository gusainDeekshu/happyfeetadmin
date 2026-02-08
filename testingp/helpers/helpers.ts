// Import the User model

import usersModel from "@/models/users";


// helpers.ts
const checkUserRole = async (userId: string, role: string) => {   
  try {
    console.log(userId + " user id");
    
    // Validate input
    if (!userId) {
      console.error('User ID is undefined or null');
      return false;
    }

    // Find the user by their ID
    const user = await usersModel.findById(userId);      

    if (!user) {
      console.error('User not found');
      return false;
    }
    
    // Assuming the user model has a field named 'roles' (an array of roles)
    return user.roles.includes(role);
   
  } catch (error) {
     console.error('Error checking user role:', error);
     return false;
   } 
}; 

export default checkUserRole;

// Usage example
// const hasRole = await checkUserRole('userIdHere', 'admin');
// if (hasRole) {
//   console.log('User has the admin role');
// } else {
//   console.log('User does not have the admin role');
// }
