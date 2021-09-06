import {Dialog} from "@headlessui/react";
import {AnimatePresence, motion} from "framer-motion";
import {ModalProps} from "@shared/types";
import React, {useEffect, useRef, useState} from "react";
import Select from "./Select";
import {clamp, deleteBackend, getBackend, merge, putBackend, useUser} from "@shared/functions";
import {Field, Form, Formik, FormikHelpers, FormikProps} from "formik";

interface EntryData {
    status?: string,//"Planning" | "Playing" | "Completed" | "100%'d" | "Dropped",
    rating?: number | "",
    playtime?: number | "",
    note?: string
}

interface Props extends ModalProps {
    game: number,
    entry?: EntryData
}

const DEFAULT_ENTRY: EntryData = {status: "", rating: "", note: "", playtime: ""};

export function ListModal(props: Props) {
    const {user} = useUser();
    const [entry, setEntry] = useState<EntryData>(DEFAULT_ENTRY);
    const formRef = useRef<FormikProps<EntryData>>(null);
    const textarea = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (entry !== undefined)
            getBackend(`entries/${user.username}/${props.game}`)
                .then((res: EntryData) => setEntry(merge(DEFAULT_ENTRY, res)));
    }, []);

    const overlayVariants = {
        closed: {
            opacity: 0
        },
        open: {
            opacity: 0.6
        }
    };

    const contentVariants = {
        closed: {
            opacity: 0,
            scale: 0.95
        },
        open: {
            opacity: 1,
            scale: 1.0
        }
    };

    const transition = {duration: 0.15};

    const onClose = () => {
        props.onClose();
        formRef?.current?.resetForm(entry);
    };

    // TODO ERROR HANDLING
    function onSubmit(data: EntryData, {setSubmitting}: FormikHelpers<EntryData>) {
        console.log(data);
        if (data.status !== undefined) {
            putBackend(`entries/${user.username}/${props.game}`, data).then(res => {
                if (res.success) {
                    setEntry(res.entry);
                    props.onClose();
                }
                setSubmitting(false);
            });
        }
        else setSubmitting(false);
    }

    function deleteEntry() {
        deleteBackend(`entries/${user.username}/${props.game}`).then(res => {
            if (res.success) {
                onClose();
                setEntry({});
            }
        });
    }

    return <AnimatePresence>
        {props.show &&
        <Dialog static open={props.show} onClose={onClose} as={motion.div}
                initial="closed" animate="open" exit="closed"
                className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay as={motion.div}
                                transition={transition}
                                variants={overlayVariants}
                                className="fixed inset-0 bg-black"/>
                <motion.div
                    transition={transition}
                    variants={contentVariants}
                    className="bg-white dark:bg-main-light rounded-md relative
                               mx-auto z-10 p-6 shadow-xl transform transition-all">
                    <Dialog.Title className="font-semibold text-lg leading-6 text-gray-900 dark:text-gray-300 mb-2">
                        List
                    </Dialog.Title>
                    <Formik initialValues={entry} enableReinitialize validateOnChange
                            innerRef={formRef} onSubmit={onSubmit}>
                        {({values, setFieldValue}) =>
                            <Form>
                                <div>
                                    <div className="flex">
                                        <div className="w-40 relative">
                                            <label className="label" htmlFor="status">Status </label>
                                            <Select name="status" value={values.status}
                                                    change={opt => setFieldValue("status", opt)}
                                                    values={["Planning", "Playing", "Completed", "100%'d", "Dropped"]}/>
                                        </div>
                                        <div className="ml-6">
                                            <label className="label block" htmlFor="rating">Score</label>
                                            <Field className="input" type="number" min="0" max="100" name="rating"
                                                   onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                                                       setFieldValue("rating", clamp(+e.target.value, 0, 100))}/>
                                        </div>
                                        <div className="ml-6">
                                            <label className="label block" htmlFor="playtime">Playtime</label>
                                            <Field className="input" type="number" min="0" max="10000" name="playtime"
                                                   onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                       if (e.target.value !== "")
                                                           setFieldValue("playtime", Math.max(+e.target.value, 0));
                                                   }}/>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="label" htmlFor="note">Note</label>
                                        <Field className="w-full input leading-tight overflow-hidden" as="textarea"
                                               rows={1}
                                               name="note" style={{height: textarea.current?.scrollHeight}}
                                               innerRef={textarea}/>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button className="rounded py-2 text-gray-300 text-sm font-semibold px-3 transition-colors
                                               duration-150 dark:bg-main dark:hover:bg-red-500 hover:text-white"
                                            onClick={deleteEntry}
                                            type="button">
                                        Delete
                                    </button>
                                    <button className="rounded text-gray-300 button px-3 ml-2" type="submit">
                                        Save
                                    </button>
                                </div>
                                <button className="material-icons bg-transparent text-gray-300 transition-colors
                                           duration-150 hover:text-indigo-500 text-lg absolute top-2 right-2"
                                        onClick={props.onClose}>
                                    close
                                </button>
                            </Form>
                        }
                    </Formik>
                </motion.div>
            </div>
        </Dialog>
        }
    </AnimatePresence>;
}
