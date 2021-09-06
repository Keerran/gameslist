import {Dialog, Transition} from "@headlessui/react";
import {Fragment} from "react";
import {ModalProps} from "@shared/types";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {postBackend, useUser} from "@shared/functions";

interface FormData {
    username: string,
    password: string
}

export default function LoginModal(props: ModalProps) {
    const {mutateUser} = useUser();
    function onSubmit(data: FormData, {setSubmitting}: FormikHelpers<FormData>) {
        postBackend("login/", data).then(res => {
            setSubmitting(false);
            if(res.success)
                mutateUser(res.user).then(console.log);
            props.onClose()
        })
    }

    return (
        <Transition show={props.show} as={Fragment}>
            <Dialog onClose={props.onClose}
                    className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-30"
                        entered="opacity-30"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-30"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black"/>
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="bg-white dark:bg-main-light rounded-md w-full max-w-sm
                                        mx-auto z-10 p-6 shadow-xl transform transition-all">
                            <Dialog.Title
                                className="font-semibold text-lg leading-6 text-gray-900 dark:text-gray-300 mb-2">
                                Login
                            </Dialog.Title>

                            <Formik initialValues={{username: "", password: ""}} onSubmit={onSubmit}>
                                <Form className="flex flex-col space-y-6 mt-4">
                                    <div>
                                        <label className="label" htmlFor="username">Username</label>
                                        <Field className="block input w-full" type="text" name="username"/>
                                    </div>
                                    <div>
                                        <label className="label" htmlFor="password">Password</label>
                                        <Field className="block input w-full" type="password" name="password"/>
                                    </div>
                                    <button className="button w-full text-white"
                                            type="submit">
                                        Login
                                    </button>
                                </Form>
                            </Formik>

                            <button className="absolute top-4 right-4 rounded-md hover:bg-gray-100 hover:bg-main
                                               text-gray-300 duration-100 transition-colors ease-in material-icons"
                                    onClick={props.onClose}>
                                close
                            </button>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
