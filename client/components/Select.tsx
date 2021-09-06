import React, {useState} from "react";
import {FieldHookConfig, useField} from "formik";
import Popover from "./Popover";

interface SelectProps {
    change: (val: string) => void,
    // value: string,
    values: string[],
}

export default function Select(props: SelectProps & FieldHookConfig<string>) {
    const [field, meta] = useField(props);
    const [show, setShow] = useState(false);

    if (meta) {
    }

    return <>
        <input type="text" {...field} readOnly value={props.value} name={props.name} onClick={() => setShow(!show)}
               className="cursor-pointer w-full rounded py-2 px-4 h-10 input"/>
        <Popover show={show} onClose={() => setShow(false)} className="mt-3 top-16 left-1 right-1">
            {props.values.map(opt =>
                <li key={opt} className={`popoverItem
                                    ${opt === props.value && "text-indigo-400"}`}
                    onClick={() => {
                        props.change(opt);
                        setShow(false);
                    }}>
                    {opt}
                </li>
            )}
        </Popover>
    </>;
}