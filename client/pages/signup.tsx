import type {NextPage} from "next";
import Nav from "@components/Nav";
import {postBackend, useUser} from "@shared/functions";
import {Field, Form, Formik} from "formik";
import {useRouter} from "next/router";

const Signup: NextPage = () => {
    // TODO ERROR HANDLING
    const router = useRouter();
    const {mutateUser} = useUser();

    return <div id="App" className="text-center">
        <Nav/>
        <main className="mx-auto mt-10 inline-block rounded-md p-2 dark:bg-main-light">
            <div className="font-semibold text-xl p-2 text-left">Sign up</div>
            <Formik initialValues={{username: "", password1: "", password2: ""}}
                    onSubmit={(data, {setSubmitting}) => {
                        postBackend("signup", data).then(async res => {
                            if (res.success) {
                                setSubmitting(false);
                                await mutateUser(res.user);
                                router.push("/").then();
                            }
                        })
                    }}>
                <Form className="p-2 text-left w-72">
                    <div>
                        <label className="label block" htmlFor="username">Username</label>
                        <Field className="input w-full" name="username"/>
                    </div>

                    <div className="mt-2">
                        <label className="label block" htmlFor="password1">Password</label>
                        <Field className="input w-full" type="password" name="password1"/>
                    </div>

                    <div className="mt-2">
                        <label className="label block" htmlFor="password2">Confirm Password</label>
                        <Field className="input w-full" type="password" name="password2"/>
                    </div>

                    <button type="submit" className="w-full py-3 button mt-8">
                        Submit
                    </button>
                </Form>
            </Formik>
        </main>
    </div>
}

export default Signup;
