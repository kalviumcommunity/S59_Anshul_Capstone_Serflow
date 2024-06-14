import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import Cookies from 'js-cookie'
import { InfinitySpin } from 'react-loader-spinner';

function ImageUploadModal({setImageModalOpen}) {
  const [files, setFiles] = useState([]);
  const [changeSuccess, setChangeSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Function to handle file uploads
  const handleProcess = (fieldName, file, metadata, load, error, progress, abort) => {
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress
        const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress(true, progressValue, 100);
      },
      (err) => {
        error(err.message);
      },
      () => {
        // GET download URL after successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          load(downloadURL);
          // console.log('File available at', downloadURL);
          changeProfileImage(downloadURL)
        });
      }
    );

    return {
      abort: () => {
        uploadTask.cancel();
        abort();
      },
    };
  };

  const changeProfileImage = async(downloadURL)=>{
    setLoading(true)
    try{
        const response = await fetch(`${import.meta.env.VITE_api_uri}/auth/user`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
                profileImage: downloadURL
            })
        })
        if(response.ok){
            const data = await response.json()
            Cookies.set('profileImage', data.profileImage, {expires : 1})
            // console.log(data.profileImage)
            setChangeSuccess(true)
            // console.log(data)
        }
    }
    catch(error){
        console.log(error)
    }finally{
        setLoading(false)
    }

  }

  return (
    <div
    onClick={(e) => {
        if (e.target != e.currentTarget) {
          return;
        }        
        setImageModalOpen(false);
      }}
    className="fixed right-0 left-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 bottom-0 jsutify-center items-center flex bg-[#00000080]">
    
    <div className="scrollbar-hide overflow-y-scroll relative max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8  rounded-xl">
        <div
        className='absolute top-2 right-2 cursor-pointer'
        onClick={()=>{
            setImageModalOpen(false)
        }}
        >
            <i className='bx bx-window-close'></i>
        </div>
        <br />
        <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={false}
            server={{ process: handleProcess }}
            name="files" /* sets the file input name, it's filepond by default */
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            labelFileProcessingComplete='File uploaded'
            stylePanelLayout={'compact'}
            allowRemove="false" 
            allowRevert="false"
        />
        {/* <br /> */}
        <div
        className='flex justify-center mt-4 w-full'
        >
            {loading ?  <div
            className='mr-10'>
              <InfinitySpin
              visible={true}
              width="120"
              color="green"
              ariaLabel="infinity-spin-loading"
            />
            </div> : null }
            {
                changeSuccess ? <div className="text-white  text-center text-md bg-green-600 p-2 rounded-lg w-full">Profile image changed successfully</div> : null
            }
        </div>
    </div>

    </div>
  );
}

export default ImageUploadModal;


