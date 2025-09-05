

const UserDetailsFunction = async(req,res)=>{

    const user = req.user
    
    if(!user.id){
        return res.json({"user":false})
    }
    return res.status(200).json({user})

}

export default UserDetailsFunction