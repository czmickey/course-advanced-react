import { useEffect, useState } from "react";

export default function useForm(initial = {}) {
    // create a state object for our inputs
    const [inputs, setInputs] = useState(initial);
    const initialValues = Object.values(initial).join('');

    useEffect(() => {
        setInputs(initial);
    }, [initialValues]);

    // {
    //     name: 'wes',
    //     description: 'nice shoes',
    //     price: 1000,
    // }

    const handleChange = (e) => {
        let { value, name, type } = e.target;

        if (type === 'number') {
            value = parseInt(value);
        }

        if (type === 'file') {
            [value] = e.target.files;
        }

        setInputs({
            // copy the existings state
            ...inputs,
            [name]: value,
        })
    };

    const resetForm = () => {
        setInputs(initial);
    }

    const clearForm = () => {
        const blankState = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, '']));
        setInputs(blankState);
    }

    // return the things we want to surface from this custom hook
    return {
        inputs,
        handleChange,
        resetForm,
        clearForm,
    }
}