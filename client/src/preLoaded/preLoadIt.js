import { getAllContacts } from "@/features/user/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const preLoadIt =()=>{
    const {userInfo} = useSelector(redux=>redux.userReducer);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(userInfo){
            dispatch(getAllContacts(userInfo?.id))
        }
    },[userInfo])
}

export default preLoadIt;