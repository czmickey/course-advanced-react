import Form from './styles/Form';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SINGUP_MUTATION = gql`
    mutation SING_UP_MUTATION($email: String!, $name: String!, $password: String!) {
        createUser(data: {
            email: $email
            name: $name
            password: $password
        }) {
            id
            email
            name
        }
    }
`

export default function SignUp() {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        name: '',
        password: ''
    });
    const [signUp, { data, loading, error }] = useMutation(SINGUP_MUTATION, {
        variables: inputs,
        // refetch the currently logged user
        // refetchQueries: [{ query: CURRENT_USER_QUERY }]
    })

    async function handleSubmit(e) {
        e.preventDefault(); // stop the form from submitting
        console.log(inputs);
        const res = await signUp().catch(console.error);
        resetForm();
    }

    // const error = data?.authenticateUserWithPassword.__typename == 'UserAuthenticationWithPasswordFailure'
    //     ? data?.authenticateUserWithPassword
    //     : undefined;

    return (
        <Form method='POST' onSubmit={handleSubmit}>
            <h2>Sign Up for an Account</h2>
            <Error error={error} />
            <fieldset>
                {data?.createUser && (
                    <p>
                        Signed Up with {data.createUser.email}
                    </p>
                )}
                <label htmlFor="name">
                    Your Name
                    <input 
                        type="text" 
                        name="name" 
                        placeholder='Your Name'
                        autoComplete='name'
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
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
                <button type="submit">Sign Up!</button>
            </fieldset>
        </Form>
    );
}

export { SINGUP_MUTATION };