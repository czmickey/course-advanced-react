import Form from './styles/Form';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGN_IN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    id
                    email
                    name
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                code
                message
            }
        }
    }
`

export default function SignIn() {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: ''
    });
    const [signIn, { data, loading }] = useMutation(SIGN_IN_MUTATION, {
        variables: inputs,
        // refetch the currently logged user
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    })

    async function handleSubmit(e) {
        e.preventDefault(); // stop the form from submitting
        console.log(inputs);
        const res = await signIn();
        console.log(res);
        resetForm();
    }

    const error = data?.authenticateUserWithPassword.__typename == 'UserAuthenticationWithPasswordFailure'
        ? data?.authenticateUserWithPassword
        : undefined;

    return (
        <Form method='POST' onSubmit={handleSubmit}>
            <h2>Sign Into Your Account</h2>
            <Error error={error} />
            <fieldset>
                <label htmlFor="email">
                    Email
                    <input 
                        type="email" 
                        name="email" 
                        placeholder='Your Email Address'
                        autoComplete='email'
                        value={inputs.email}
                        onChange={handleChange}
                        // change
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input 
                        type="password" 
                        name="password" 
                        placeholder='Password'
                        autoComplete='password'
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Sign In!</button>
            </fieldset>
        </Form>
    );
}