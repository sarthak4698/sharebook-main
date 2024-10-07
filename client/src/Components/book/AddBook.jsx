import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { pageTransition, pageZoom, uploadImage } from "../../util";
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import bookDummy from '../../assets/images/bookDummy.png'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddBook({ setisAddBook }) {

    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const { userId, username, location } = userSession;
    const toastify = (text) => toast(`${text}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
    });

    const history = useHistory();
    // if (!location) {
    //     toastify('Please complete your profile before adding any book!')
    // }

    const { register, handleSubmit, formState: { errors } } = useForm({ reValidateMode: 'onChange' });

    const [data, setData] = useState({ userId, username, location });

    const [image, setImage] = useState();
    const [preview, setPreview] = useState();
    const fileInputRef = useRef();

    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(image)
        } else {
            setPreview(null)
        }
    }, [image])


    // onSubmit handle event 
    const onSubmit = (data, e) => {
        setData(data);
        console.log('registering user ...')
    };

    useEffect(() => {
        const sendData = () => {
            if (data.bookname) {
                setisLoading(true)
            }
            let image_url = '';
            let newData = { ...data, userId, username, location: location || 'Delhi', image_url }
            uploadImage(image).then((image_url) => {
                newData.image_url = image_url
                axios.post(`/api/books/addbook`, newData)
                    .then((res) => {
                        if (res.status === 201) {
                            toastify('Book added successfully')
                            setisLoading(false)
                            history.push('/mybook')
                            setisAddBook(false)
                        }
                        else {
                            toastify('Could not add book')
                            setisLoading(false)
                        }

                    });
            })
        }
        if (data && data?.bookname) {
            sendData()
        }
    }, [data])

    return (
        <>
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageZoom}
                transition={pageTransition} className="grid mt-8 mb-12 max-w-screen-sm mx-auto gap-8 grid-cols-1">

                <div className="bg-white shadow-xl rounded-3xl px-6 sm:px-12 py-5">

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-row items-center justify-between mb-6">
                            <h2 className="font-bold h-text text-2xl my-3">Add Book</h2>
                            <motion.button
                                whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                                className="bg-gray-900 mx-2 px-5 py-3 flex items-center mb-1 shadow-xl text-white rounded-full focus:outline-none hover:bg-gray-800"
                                type="button" onClick={() => setisAddBook(false)}>
                                Cancel
                            </motion.button>

                        </div>
                        <div className="mb-5">
                            <div className="max-w-xs max-h-80 rounded-lg cursor-pointer border overflow-hidden">
                                {
                                    preview ?
                                        <img className="w-full h-full object-contain rounded-lg" src={preview} alt="" onClick={() => setImage(null)} />
                                        :
                                        (
                                            <img src={bookDummy} className="w-full h-full object-cover rounded-lg" onClick={(e) => {
                                                e.preventDefault();
                                                fileInputRef.current.click();
                                            }} alt="" />
                                        )
                                }
                                <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file && file.type.substring(0, 5) === 'image') {
                                        setImage(file)
                                    } else {
                                        setImage(null)
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="md:flex md:flex-row md:space-x-4 w-full">
                            <div className="mb-4 md:space-y-2 w-full">
                                <label className="font-semibold text-gray-600">Book Name</label>
                                <input placeholder="Book Name" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4 mt-2 focus:outline-none focus:border-gray-400"
                                    type="text" value={data?.bookname} {...register("bookname", { required: 'Please enter book name' })} />
                                {errors.bookname && <p className="text-red-500">{errors.bookname.message}</p>}
                            </div>
                            <div className="mb-4 md:space-y-2 w-full text-sm">
                                <label className="font-semibold text-gray-600">Book Category</label>
                                <input placeholder="Category" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg h-10 px-4 mt-2 focus:outline-none focus:border-gray-400"
                                    type="text" {...register("category", { required: 'Please enter a category' })} />
                                {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                            </div>
                        </div>
                        <div className="mb-4 md:space-y-2 w-full">
                            <label className=" font-semibold text-gray-600">Book Condition</label>
                            <div className="flex flex-wrap items-stretch w-full mb-4 relative">
                                <input type="text" className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded-lg px-3 relative focus:border-blue focus:shadow mt-2 focus:outline-none focus:border-gray-400"
                                    placeholder="2 Months Old , 5 Year Old, Misssing Some Pages, etc" {...register("condition")} />
                            </div>
                        </div>
                        <div className="flex-auto w-full mb-1 space-y-2">
                            <label className="font-semibold text-gray-600">Description</label>
                            <textarea className="w-full resize-none h-28 appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded-lg  py-3 px-4 mt-2 focus:outline-none focus:border-gray-400"
                                placeholder="Enter your Book Information / Description" {...register("description", { required: 'Please enter book description' })} ></textarea>
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                            {/* <p className="text-sm text-gray-400 text-left my-3">You inserted 0 characters</p> */}
                            <p className="text-sm text-red-400 text-left my-3">Maximum length 1000 characters</p>
                        </div>
                        <div className="my-4 w-full">
                            <label className=" font-semibold text-gray-600">Agreement (Optional)</label>
                            <div className="flex flex-wrap items-stretch w-full mb-4 relative">
                                <input type="number" min="1" className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded-lg px-3 relative focus:border-blue focus:shadow mt-2 focus:outline-none focus:border-gray-400"
                                    placeholder="Number of months to return the book" {...register("agreement")} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            {/* <button className="mb-2 md:mb-0 btn-bg px-5 py-2 text-base shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500">Save</button>
                            <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-base shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"> Cancel </button> */}
                            <motion.button
                                whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
                                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                                className="px-6 mx-2 py-3 flex items-center mb-1 mr-1 text-white focus:outline-none btn-bg"
                                type="submit">
                                {isLoading ? `Saving... ` : `Save`}
                            </motion.button>
                        </div>
                    </form>
                </div>
                <ToastContainer style={{ display: 'none' }} />
            </motion.div>

        </>
    )
}

export default AddBook
