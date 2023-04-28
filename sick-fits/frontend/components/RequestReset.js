import Form from './styles/Form';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        sendUserPasswordResetLink(email: $email) {
            code
            message
        }
    }
`

export default function RequestReset() {
    const { inputs, handleChange, resetForm } = useForm({ email: '' });
    const [signUp, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION, {
        variables: inputs,
    })

    async function handleSubmit(e) {
        e.preventDefault(); // stop the form from submitting
        console.log(inputs);
        const res = await signUp().catch(console.error);
        console.log(res);
        console.log({ data, loading, error })
        resetForm();
    }

    // const error = data?.authenticateUserWithPassword.__typename == 'UserAuthenticationWithPasswordFailure'
    //     ? data?.authenticateUserWithPassword
    //     : undefined;

    return (
        <Form method='POST' onSubmit={handleSubmit}>
            <h2>Request a Password Reset</h2>
            <Error error={error} />
            <fieldset>
                {data?.sendUserPasswordResetLink === null && (
                    <p>Success! Check your email for link!</p>
                )}
                <label htmlFor="email">
                    Email
                    <input 
                        type="email" 
                        name="email" 
                        placeholder='Your Email Address'
                        autoComplete='email'
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Request Reset!</button>
            </fieldset>
        </Form>
    );
}