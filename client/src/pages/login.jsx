import React, { useEffect } from "react";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { GoogleAuthProvider, ProviderId, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setNewUser, setUser } from "../features/user/userSlice";

function login() {
  const router = useRouter();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const newUser = useSelector((state) => state.newUser);

  useEffect(() => {
    if (userInfo?.id && !newUser) {
      router.push("/");
    }
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const {
        user: { email, displayName: name, photoURL: profilePicture, status },
      } = await signInWithPopup(firebaseAuth, provider);

      console.log(
        "Successfully signed in with Google:",
        email,
        name,
        profilePicture,
        status
      );

      const userInfo = {
        email,
        name,
        profilePicture,
        status: "",
      };
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        console.log(data);
        if (!data.status) {
          dispatch(setNewUser(true));
          console.log("dispatch from login.jsx");
          console.log(userInfo);
          dispatch(setUser(userInfo));

          router.push("/onboarding");
        } else {
          dispatch(setNewUser(false));
          dispatch(setUser(userInfo));
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg">
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl" onClick={handleLogin}>
          Login with Google
        </span>
      </button>
    </div>
  );
}

export default login;

// {
//     "uid": "TdUGrVrzPATzJINA9FokMyJR9eR2",
//     "email": "gauravish151297@gmail.com",
//     "emailVerified": true,
//     "displayName": "Gaurav Vishwakarma",
//     "isAnonymous": false,
//     "photoURL": "https://lh3.googleusercontent.com/a-/ALV-UjVaw1AREV_75ZEKZlXNnPdip6O53mCoTXavt2mtIGctm4WKhZZGyf3hnT2WsQjfzX2BpTEquRGuieMU1MsXN3o6CtoT_zOhqfbFHUrwcL1Tlx17WAN8RvEss5bKgGReqd1aS4DV8HmwYhb3RprpW55fCtxvoqPHBbWCzISIH1nFy8YBJFYn0ikLajRZ2NdWSQ9snC7BR07CX4888KyhRut7VYsk9yg6e_fmTXb-LPgOKhtpqa4GjFPa_Q9bXNw7M4TE30KFut1JqsuBE-JNh8q_l8r9p4ssWJb7rLVO7sRqiP73ow_K9LoW73_fClC_jEop4AnzKTE2m6A-h3k7hLdyETr07U9un50FmNTbNATPZGrw85sc8XNcuCCH4uk14eLZm6-3oIBQ2B-ZK82xpS2A4oU850EKsc-tXV9eYkeQfNtOLSX_m7qaNcibeVJ91Hxg0_RfrpzUHZe5Gs0BfqQ0pFtF2u6A0rgJthdMwIM2K6uMN_8YkhEP_NuzrlU7sJJ0iOrs1m5VxStExyd5uHzWkEGa-1YAYqvG8ziKBNbEd8SiiKr2D-mIbMwH2bVjqvz9YzESrmC_fP9ikwDHP4mSuMwzfLc-DeU_ViiXLTr5FLFnw3RMTx22NULfKV6HTXDDzuYPZ1GAzSTlqLFTA3IFZPYHHkzURfh4z8v49sfKrtogXvgLBoLBMrAOZab44T2SxywjR7H6_AeD6VWh7eMhm7rwLy-59pcTT-XKIG1BoWmS5SBrblGml2kNK7r4x-SPHXiCTyYPcLmQNTV9sUF109d7ZvaC9UIqLqnIugSJQtz1GgPoQV9giiTqFY1CgdW48ve8V7MShaspy2UM3BM-rQmwnsjnP40DaLCvsrNqjsT1ARHTc2T3TCVsGVuomH_ddCFqoF9ehLTIkzNMCJEudMSTsF7-SygUr5GlM4vd-J_rCzepS1qc5ItHDyBU=s96-c",
//     "providerData": [
//         {
//             "providerId": "google.com",
//             "uid": "106122169070717952902",
//             "displayName": "Gaurav Vishwakarma",
//             "email": "gauravish151297@gmail.com",
//             "phoneNumber": null,
//             "photoURL": "https://lh3.googleusercontent.com/a-/ALV-UjW0yH2ELisNJTCzM-3nz9QfuBFJztD_HfI6-CwPoY2EQ7CB2TT9K7GI2iIYzniHTH-pvOgWO6ca4rJh8P7P5PriGn3IGMKrDpeMkgc3a5uZVl__t2NZlSIk0EWPlD9gZp1tZE4sMX3-8bG4xDGXtb-n0M26FGM6GqeU-x40T08oNyNsqP7QRrBIax5IqNnf25rGn3VhLvZRjt8VLEeKaHju-PW6V1pAx9EGQ96gs7PuB8zO5eOVqbxIg3RB9hy8t1l5CbIzx8UMIXCcliyPK-891ji1aVKxoO9O5Qpg9NLj3CXoCDg3j1LMhl8q3KS6EMNZBD5sxAN101tbO6Pkc4tXQu2G8bfIqmz65YQyjmVvl-b6776XNBVwZiohgXrozeOYLrNuBBvfNGxcwvQBU_XC0zF8F5Ei5b96k5sFq2iRd2gJYJraDFZXeAacY7_q9m6gYr_l0X5cJ_-k58F30oGFlQZ_qdm9_22wOdWkiuDD5E16LIVZ0g8yi6S742ZkZCH4kgy5-8xlQEcC80-IV7HfTrXpIH-wcWKkTK0GljI59gSqVuDD0_zfkJ-x7uzw988oPuRySaABxk9n-JUlV6uOPWqT9Jo9h2-39_QWreLJuZ5-wHH5SGdR-SGh8iGnZkJR9ugJNNGvbdSmE8hjmNJcnoQ7LyMldV94EwhidHtAkIOLcCKtLK-iDXL-msv_bNVLoY4IvKuMrG6DVWzTYV0MgAZ0giWaYaUEPRO1b84N-pR7SZ5jDPv-O4Rp01pWee_FuQZnsUUkZjIR5jRWx1IFFl89udai2mIRotobhUYBsVnGG3uNQmayWHmR05uRnpvXpQvlP3GWfoU6gL5UQvrgj1GYKKveOJjNupnZPQhAGeH2BZ1hjVQilvKbMgwJIqSDUiPvT1dUvtUERGsPgxjj7JhSAJM8eZbVpOx_Vp_OHima9P8gUCnWioOqIUwy=s96-c"
//         }
//     ],
//     "stsTokenManager": {
//         "refreshToken": "AMf-vBzacicaclwRhCggcMy9zhmEqe5ayix1G4qWT-WfPaE9zvap_3GyKFFrJIiI8213n2iTL704buzN8ztliyIGKJaXM-88kaqrs-TTues6nC_AAe31pT3ugls0qs8cI7pPvkRDuRL68164vJPzZPTWoS528unYaLByfLHL995X0utVdQ7WldQMBgcmk5ARguv28BM3_a0HTkpNJx_Rq5sluBLgRTAEQBPOWGJbzWPS5Ljdaz-WbK5yrntrx9c5_w48dUfxI1BmYy91eThNVnuElE9TZWANUcglmsibxtnU3yq-O0SfUAfjjANuvxFkROCpda-ck0hK0hswqXwqpnUCZAGO0jpq-aFF-RncuXa5P662KZk4uOAtUV7bQ1cDDA_D9cRoSZRnKGClaix3LKnmzDl2kD6oxKC3BG_VcIuMwTlXlSR9x8K-zoB-VG_MBoNBGMdL4BzgWHMQZOF_yKY5FUvxVi45PvIhHiOBUrKFMGyllomnYLZxSPVjxKeGDNN8bzEuVd4ynt8B754aJiHUXI9EyOdY6omKToz2fZnC3vQBdfBBQjW-MC7h-Xt1BrZyHr6dWxKbr-fG9bYCJp_C-ECgCwZf6i4IcnE4sGnweLnXUMamXyprdGMF-MmzlMVZJHL_1UwxuPLS0xhgCTxPziviXvLTS8QO6SmRTEzWKQKtzb9Z2SA8sBbiHicrrJWb_rVcBHRzyVLDJ3NtBahMRKtcjsDvyaWMEeqTbtDlDvBe0adAzBhzZCSCFd5_4Ml_BvYVqBKd2WHRdkg9MlQO0WPk6fyAZ4Fbqf9Px_3P3SbpzJN7wIrJ-7_EdoXyCblx5e88UUYB80PCN_REZnI8t3fOl1lrIKCuuQE87UBRrB0rpY_zez-uV0RBpLwxbe8_90ae9yEpFjs4UlnM8-qLDFDxq-gr9doV-Us7akQzYcQAobYBjqSMFX8A6GRWBAEYhry0dB_tKnFMzU5WIOMc4XCakGUm_8KlPObSWcEUilhWOoBKDapGWroaW_4LgBw6tASBA1E2m112cOL2PDHTEB1RNMbTuiTjyTnZi9TI8-YsF79QJfF27jPspXhM_Ah8U15zKrPdI7oaUdA5dRjspuP1iKd6054JLOf3LfGQOQIttQgynRwlZ3QnA2IU3wRCtBSuek0k4FP4iTdTixn5l5Vqtauon1kRMXK1E20VqrH-hNJJUWX1IpOhRn5qXUmMPbFocfD2HVUd4URw2NVVSOglMZ1WvzvhhkzlpQKhD1ghcuPBChCO3gwRNzBfUzvQs3xEPL7Pmzm1nZGTiK1l-9tgcXp-0np1w9HQSd-EgoK0uPLWWLl08DYCf9NiJrh_BTbRlcCCLTyneAcVDNAjhgEHbvNBJlK5vw6o-7XGZ4P5ONO-eVDGzsjbINsgMYL6iD6h3ME9OUHChUB74gOYi8lQ89siwV5KE3rZRVOK-TZ9U9qCg4mGqI4GHTLzqCzGsWwKSl6RyLpbP57v61FQI2S18bKXNYwehg9OpRpbJTOkOeHGfk-xy2OJdfTMzPvrd-n8sRu9IyKerfEKDpUeGxbv8xSGPNRd9rSBsR4t5eF2apebx2lKnU1jzeEYCyir5hg-cdwDXS5dtmyH1vWA0tTOtUOuYSqK_bssgCYDOVjw5KLhbGK1DvWQacv4HsNz1IHjSu5ZeAcora9f7noMLT2xloTLjA",
//         "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlhNTE5MDc0NmU5M2JhZTI0OWIyYWE3YzJhYTRlMzA2M2UzNDFlYzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR2F1cmF2IFZpc2h3YWthcm1hIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BTFYtVWpWYXcxQVJFVl83NVpFS1psWE5uUGRpcDZPNTNtQ29UWGF2dDJtdElHY3RtNFdLaFpaR3lmM2huVDJXc1FqZnpYMkJwVEVxdVJHdWllTVUxTXNYTjNvNkN0b1Rfek9ocWZiRkhVcndjTDFUbHgxN1dBTjhSdkVzczViS2dHUmVxZDFhUzREVjhIbXdZaGIzUnBycFc1NWZDdHh2b3FQSEJiV0N6SVNJSDFuRnk4WUJKRlluMGlrTGFqUloyTmRXU1E5c25DN0JSMDdDWDQ4ODhLeWhSdXQ3Vllzazl5ZzZlX2ZtVFhiLUxQZ09LaHRwcWE0R2pGUGFfUTliWE53N000VEUzMEtGdXQxSnFzdUJFLUpOaDhxX2w4cjlwNHNzV0piN3JMVk83c1JxaVA3M293X0s5TG9XNzNfZkNsQ19qRW9wNEFuektURTJtNkEtaDNrN2hMZHlFVHIwN1U5dW41MEZtTlRiTkFUUFpHcnc4NXNjOFhOY3VDQ0g0dWsxNGVMWm02LTNvSUJRMkItWks4MnhwUzJBNG9VODUwRUtzYy10WFY5ZVlrZVFmTnRPTFNYX203cWFOY2liZVZKOTFIeGcwX1JmcnB6VUhaZTVHczBCZnFRMHBGdEYydTZBMHJnSnRoZE13SU0ySzZ1TU5fOFlraEVQX051enJsVTdzSkowaU9yczFtNVZ4U3RFeHlkNXVIeldrRUdhLTFZQVlxdkc4emlLQk5iRWQ4U2lpS3IyRC1tSWJNd0gyYlZqcXZ6OVl6RVNybUNfZlA5aWt3REhQNG1TdU13emZMYy1EZVVfVmlpWExUcjVGTEZudzNSTVR4MjJOVUxmS1Y2SFRYRER6dVlQWjFHQXpTVGxxTEZUQTNJRlpQWUhIa3pVUmZoNHo4djQ5c2ZLcnRvZ1h2Z0xCb0xCTXJBT1phYjQ0VDJTeHl3alI3SDZfQWVENlZXaDdlTWhtN3J3THktNTlwY1RULVhLSUcxQm9XbVM1U0JyYmxHbWwya05LN3I0eC1TUEhYaUNUeVlQY0xtUU5UVjlzVUYxMDlkN1p2YUM5VUlxTHFuSXVnU0pRdHoxR2dQb1FWOWdpaVRxRlkxQ2dkVzQ4dmU4VjdNU2hhc3B5MlVNM0JNLXJRbXduc2puUDQwRGFMQ3Zzck5xanNUMUFSSFRjMlQzVENWc0dWdW9tSF9kZENGcW9GOWVoTFRJa3pOTUNKRXVkTVNUc0Y3LVN5Z1VyNUdsTTR2ZC1KX3JDemVwUzFxYzVJdEhEeUJVPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3doYXRzYXBwLWNsb25lLTQ1ODk0IiwiYXVkIjoid2hhdHNhcHAtY2xvbmUtNDU4OTQiLCJhdXRoX3RpbWUiOjE2OTY1MDg1NzUsInVzZXJfaWQiOiJUZFVHclZyelBBVHpKSU5BOUZva015SlI5ZVIyIiwic3ViIjoiVGRVR3JWcnpQQVR6SklOQTlGb2tNeUpSOWVSMiIsImlhdCI6MTY5NjUwODU3NSwiZXhwIjoxNjk2NTEyMTc1LCJlbWFpbCI6ImdhdXJhdmlzaDE1MTI5N0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNjEyMjE2OTA3MDcxNzk1MjkwMiJdLCJlbWFpbCI6WyJnYXVyYXZpc2gxNTEyOTdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.1gj6_aDvcmb9VrJROyM3BovpPEiUEhmUkYbq4r9FWauKX6SoQHKqHXBK7n9D7TTs9oLNxoqzNAQH06j5MjKYq-VRchKWZ_wS3x75JtJ8RVCxGhohqg1_AHW1fBebK7SqzNN0ZfI6MhASpUTDIJmuBcK-3jDxc1Y-XMEBuYG6WeI8Kk_NBSuif3F8QN00WcYbGyCOccI-H9vfp1XWY27wpsoqYMOt899UNIyg-zQIPPDYALOhVc8fyaPAaytp_J9nHQEmI1Rlup42-WIa6u88rIdQ2JpUl4NgNbO1_w14IKQVZveaCubzB9fygwdRIvJshNoTSC5cP59VD0aXVEKXhw",
//         "expirationTime": 1696512175508
//     },
//     "createdAt": "1696334120980",
//     "lastLoginAt": "1696508575698",
//     "apiKey": "AIzaSyDj5cqigU4uaAhM1-RH7N-N_WRii2FIdhU",
//     "appName": "[DEFAULT]"
// }
